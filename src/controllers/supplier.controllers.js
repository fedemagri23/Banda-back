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
      address, // Object | TODO: Add schema
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
    Validations: 
    code: Only letters and numbers, no spaces, no special characters, at least 4 characters.
    name: At least 3 characters, no special characters, accepts spaces, normalized.
    country: Must exist, only the name is sent.
    address: At least 3 characters, no special characters, accepts spaces, normalized.
    phone: Only numbers, no special characters, spaces are normalized, at least 10 characters.
    mail: Must be a valid email, validated with regex.
    web: Must be a valid URL, validated with regex.
    description: No special characters, accepts spaces, normalized, can be empty.
    CUIT, CUIL, DNI, CDI: At least one of these four fields must be sent, validated with regex, 
      accepts spaces (normalized), dashes (removed), and dots (removed), only numbers.
    company_id: Must exist, the company ID is sent.
    */

    // Validations
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
          "The name must have at least 3 characters and not contain special characters.",
      });
    }

    if (!country) {
      return res.status(400).json({ error: "The country is required." });
    }

    if (!phone || !phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ error: "The phone number must contain at least 10 digits." });
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
        error: "The fields CUIT, CUIL, DNI, and CDI must contain only numbers.",
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

    const supplierExists = await pool.query(
      "SELECT * FROM supplier WHERE code = $1 AND company_id = $2",
      [code, company_id]
    );

    if (supplierExists.rowCount > 0) {
      return res.status(400).json({
        error: "A supplier with this code already exists for this company.",
      });
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
    console.error("Error adding supplier:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSuppliersByCompany = async (req, res) => {
  try {
    const company_id = req.params.companyId;

    const response = await pool.query(
      `SELECT * FROM supplier WHERE company_id = $1`,
      [company_id]
    );

    res.json(response.rows);
  } catch (error) {
    console.error("Error fetching supplier:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const company_id = req.params.companyId;
    const supplier_id = req.params.supplierId;

    // Verify that the supplier belongs to the company
    const supplierCheck = await pool.query(
      `SELECT * FROM supplier WHERE id = $1 AND company_id = $2`,
      [supplier_id, company_id]
    );

    if (supplierCheck.rowCount === 0) {
      return res.status(404).json({
        error: "Supplier not found or does not belong to this company.",
      });
    }

    // Delete the supplier (cascade deletion is handled automatically by the database)
    const response = await pool.query(
      `DELETE FROM supplier WHERE id = $1 AND company_id = $2 RETURNING id`,
      [supplier_id, company_id]
    );

    if (response.rowCount === 0) {
      return res.status(404).json({ error: "Supplier could not be deleted." });
    }

    res.json({ message: "Supplier deleted successfully", id: supplier_id });
  } catch (error) {
    console.error("Error deleting supplier:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSuppliersWithPurchases = async (req, res) => {
  try {
    const company_id = req.params.companyId;

    const response = await pool.query(
      `
      SELECT 
        s.name AS supplier_name,
        COALESCE(SUM(product_purchase_detail.total), 0) AS total_purchases
      FROM supplier s
      LEFT JOIN purchase_order po ON s.id = po.supplier_id
      LEFT JOIN purchase_proof pp ON po.id = pp.order_id
      LEFT JOIN product_purchase_detail ON pp.id = product_purchase_detail.proof_id
      WHERE s.company_id = $1
      GROUP BY s.name
      ORDER BY s.name
      `,
      [company_id]
    );

    res.json(response.rows);
  } catch (error) {
    console.error("Error fetching suppliers with purchases:", error.message);
    res.status(500).json({ error: error.message });
  }
};
