import { pool } from "../db.js";

/*

Send ID via hotpost:
  const id = parseInt(req.params.id);

Get ID from auth token:
  const userId = req.user.userId;

*/

export const addSupplier = async (req, res) => {
  try {
    const {
      code,
      name,
      country,
      address,  // Object | TODO: Agregar schema
      phone,
      mail,
      web,
      description,
      CUIT,
      CUIL,
      DNI,
      CDI,
      company_id,
    } = req.body;

    /*
    Validaciones: 
    code: Solo letras y números, sin espacios, sin caracteres especiales, al menos 4 caracteres.
    name: Al menos 3 caracteres, sin caracteres especiales, acepta espacios, estos se normalizan.
    country: Debe existir, se envia el nombre nada mas.
    address: Al menos 3 caracteres, sin caracteres especiales, acepta espacios, estos se normalizan.
    phone: Solo números, sin caracteres especiales, los espacios se normalizan al menos 10 caracteres.
    mail: Debe ser un email válido, se valida con regex.
    web: Debe ser un URL válido, se valida con regex.
    description: sin caracteres especiales, acepta espacios, estos se normalizan, puede ser vacio.
    CUIT, CUIL, DNI, CDI: Al menos uno de estos cuatro campos debe ser enviado, se valida con regex, 
      acepta espacios (se normalizan), guiones (se eliminan) y puntos (se eliminan), solo números.
    company_id: Debe existir, se envia el id de la compañia.
    */

    // Validaciones
    const codeRegex = /^[a-zA-Z0-9]{4,}$/;
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]{3,}$/;
    const phoneRegex = /^\d{10,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*$/;
    const idRegex = /^\d+$/;

    if (
      !address ||
      typeof address !== "object" ||
      !address.town ||
      !address.street ||
      !address.number
    ) {
      return res.status(400).json({
        error: "La dirección debe incluir al menos 'town', 'street' y 'number'.",
      });
    }

    if (!code || !codeRegex.test(code)) {
      return res.status(400).json({ error: "El código debe tener al menos 4 caracteres alfanuméricos." });
    }

    if (!name || !nameRegex.test(name)) {
      return res.status(400).json({ error: "El nombre debe tener al menos 3 caracteres y no contener caracteres especiales." });
    }

    if (!country) {
      return res.status(400).json({ error: "El país es obligatorio." });
    }

    if (!phone || !phoneRegex.test(phone)) {
      return res.status(400).json({ error: "El teléfono debe contener al menos 10 dígitos." });
    }

    if (!mail || !emailRegex.test(mail)) {
      return res.status(400).json({ error: "El correo electrónico no es válido." });
    }

    if (web && !urlRegex.test(web)) {
      return res.status(400).json({ error: "La URL del sitio web no es válida." });
    }

    if (!CUIT && !CUIL && !DNI && !CDI) {
      return res.status(400).json({ error: "Debe proporcionar al menos uno de los siguientes campos: CUIT, CUIL, DNI o CDI." });
    }

    const normalizeId = (id) => id?.replace(/[\s.-]/g, "");
    const normalizedCUIT = normalizeId(CUIT);
    const normalizedCUIL = normalizeId(CUIL);
    const normalizedDNI = normalizeId(DNI);
    const normalizedCDI = normalizeId(CDI);

    const normalizeCountry = (country) => {
      return country
        ? country.charAt(0).toUpperCase() + country.slice(1).toLowerCase()
        : "";
    };

    const normalizedCountry = normalizeCountry(country);

    if (
      (normalizedCUIT && !idRegex.test(normalizedCUIT)) ||
      (normalizedCUIL && !idRegex.test(normalizedCUIL)) ||
      (normalizedDNI && !idRegex.test(normalizedDNI)) ||
      (normalizedCDI && !idRegex.test(normalizedCDI))
    ) {
      return res.status(400).json({ error: "Los campos CUIT, CUIL, DNI y CDI deben contener solo números." });
    }

    if (!company_id || !idRegex.test(company_id)) {
      return res.status(400).json({ error: "El ID de la compañía es obligatorio y debe ser un número válido." });
    }

    const companyCheck = await pool.query("SELECT * FROM company WHERE id = $1", [company_id]);
    if (companyCheck.rowCount === 0) {
      return res.status(404).json({ error: "La compañía proporcionada no existe." });
    }

    // Convertir address a formato PostgreSQL
    const addressPG = {
      town: address.town,
      street: address.street,
      number: address.number,
      floor: address.floor || null,
      departament: address.departament || null,
      zip_code: address.zip_code || null,
      observations: address.observations || null
    };

    const response = await pool.query(
      `WITH inserted AS (
        INSERT INTO supplier (
          code, name, country, 
          address, 
          phone, mail, web, description, 
          CUIT, CUIL, DNI, CDI, company_id
        ) 
        VALUES (
          $1, $2, $3, 
          (SELECT ROW($4, $5, $6::integer, $7::integer, $8, $9, $10)::address), 
          $11, $12, $13, $14, $15, $16, $17, $18, $19
        ) 
        RETURNING *
      )
      SELECT 
        i.*,
        (i.address).town as address_town,
        (i.address).street as address_street,
        (i.address).number as address_number,
        (i.address).floor as address_floor,
        (i.address).departament as address_departament,
        (i.address).zip_code as address_zip_code,
        (i.address).observations as address_observations
      FROM inserted i`,
      [
        code,
        name,
        normalizedCountry,
        addressPG.town,
        addressPG.street,
        addressPG.number,
        addressPG.floor,
        addressPG.departament,
        addressPG.zip_code,
        addressPG.observations,
        phone,
        mail,
        web,
        description,
        normalizedCUIT,
        normalizedCUIL,
        normalizedDNI,
        normalizedCDI,
        company_id
      ]
    );

    const result = response.rows[0];
    
    if (result) {
      result.address = {
        town: result.address_town,
        street: result.address_street,
        number: result.address_number ? parseInt(result.address_number) : null,
        floor: result.address_floor ? parseInt(result.address_floor) : null,
        departament: result.address_departament,
        zip_code: result.address_zip_code,
        observations: result.address_observations
      };

      delete result.address_town;
      delete result.address_street;
      delete result.address_number;
      delete result.address_floor;
      delete result.address_departament;
      delete result.address_zip_code;
      delete result.address_observations;
    }
    
    res.json(result);
  } catch (error) {
    console.error("Error adding supplier:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getCompanies = async (req, res) => {
  const response = await pool.query("SELECT * FROM company");
  res.json(response.rows);
};

export const getCompaniesByUserId = async (req, res) => {
  const userId = parseInt(req.params.id);
  const response = await pool.query("SELECT * FROM company WHERE id=$1", [
    userId,
  ]);
  res.json(response.rows);
};
