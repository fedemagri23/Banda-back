import { pool } from "../db.js";

export const addClient = async (req, res) => {
  try {
    const {
      code,
      name,
      country,
      address,
      phone,
      mail,
      web,
      description,
      CUIT,
      CUIL,
      DNI,
      CDI,
    } = req.body;
    const company_id = req.params.companyId;

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
        error:
          "The address must include at least 'town', 'street', and 'number'.",
      });
    }

    if (!code || !codeRegex.test(code)) {
      return res.status(400).json({
        error: "The code must have at least 4 alphanumeric characters.",
      });
    }

    if (!name || !nameRegex.test(name)) {
      return res.status(400).json({
        error:
          "The name must have at least 3 characters and no special characters.",
      });
    }

    if (!country) {
      return res.status(400).json({ error: "The country is required." });
    }

    if (!phone || !phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ error: "The phone number must have at least 10 digits." });
    }

    if (!mail || !emailRegex.test(mail)) {
      return res.status(400).json({ error: "The email address is not valid." });
    }

    if (web && !urlRegex.test(web)) {
      return res.status(400).json({ error: "The website URL is not valid." });
    }

    if (!CUIT && !CUIL && !DNI && !CDI) {
      return res.status(400).json({
        error:
          "You must provide at least one of the following fields: CUIT, CUIL, DNI, or CDI.",
      });
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
      return res.status(400).json({
        error: "The CUIT, CUIL, DNI, and CDI fields must contain only numbers.",
      });
    }

    if (!company_id || !idRegex.test(company_id)) {
      return res.status(400).json({
        error: "The company ID is required and must be a valid number.",
      });
    }

    const companyCheck = await pool.query(
      "SELECT * FROM company WHERE id = $1",
      [company_id]
    );
    if (companyCheck.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "The provided company does not exist." });
    }

    const clientExists = await pool.query(
      `SELECT * FROM client WHERE code = $1 AND company_id = $2`,
      [code, company_id]
    );
    if (clientExists.rowCount > 0) {
      return res.status(400).json({ error: "Client already exists." });
    }

    const addressPG = {
      town: address.town,
      street: address.street,
      number: address.number,
      floor: address.floor || null,
      departament: address.departament || null,
      zip_code: address.zip_code || null,
      observations: address.observations || null,
    };

    const response = await pool.query(
      `WITH inserted AS (
          INSERT INTO client (
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
        company_id,
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
        observations: result.address_observations,
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
    console.error("Error adding client:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getClientsByCompany = async (req, res) => {
  try {
    const company_id = req.params.companyId;

    const response = await pool.query(
      `SELECT * FROM client WHERE company_id = $1`,
      [company_id]
    );

    res.json(response.rows);
  } catch (error) {
    console.error("Error fetching clients:", error.message);
    res.status(500).json({ error: error.message });
  }
};
