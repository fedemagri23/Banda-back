import { pool } from "../db.js";

export const addProduct = async (req, res) => {
  try {
    const company_id = req.params.companyId;
    const { sku, upc, ean, name, list_price, currency } = req.body;

    /*
        Validaciones: 
        sku: numeros y letras
        upc: exactamente 12 digitos, numeros y letras
        ean: exactamente 13 digitos, numeros y letras
        name: Numeros, letras, guiones, espacios se normalizan, ningun otro caracter especial
        list_price: Valor numerico de hasta dos decimales
        currency: String de longitud exacta 3, solo letras y se normaliza a mayuscula
        company_id: Debe existir una company relacionada
        */

    if (!/^[a-zA-Z0-9]+$/.test(sku)) {
      return res
        .status(400)
        .json({ error: "SKU must contain only letters and numbers" });
    }

    if (!/^[a-zA-Z0-9]{12}$/.test(upc)) {
      return res.status(400).json({
        error: "UPC must be exactly 12 characters (letters and numbers)",
      });
    }

    if (!/^[a-zA-Z0-9]{13}$/.test(ean)) {
      return res.status(400).json({
        error: "EAN must be exactly 13 characters (letters and numbers)",
      });
    }

    if (!/^[a-zA-Z0-9\s-]+$/.test(name)) {
      return res.status(400).json({
        error: "Name can only contain letters, numbers, hyphens, and spaces",
      });
    }

    const normalizedName = name.trim().toLowerCase();

    if (isNaN(list_price) || !/^\d+(\.\d{0,2})?$/.test(list_price.toString())) {
      return res.status(400).json({
        error: "Price must be a numeric value with up to two decimal places",
      });
    }

    if (!/^[a-zA-Z]{3}$/.test(currency)) {
      return res
        .status(400)
        .json({ error: "Currency must be exactly 3 letters" });
    }

    const normalizedCurrency = currency.toUpperCase();

    const companyExists = await pool.query(
      "SELECT id FROM company WHERE id = $1",
      [company_id]
    );

    if (companyExists.rows.length === 0) {
      return res.status(400).json({ error: "Company not found" });
    }

    const response = await pool.query(
      `
          INSERT INTO product (sku, upc, ean, name, list_price, currency, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
          `,
      [
        sku,
        upc,
        ean,
        normalizedName,
        list_price,
        normalizedCurrency,
        company_id,
      ]
    );

    res.json(response.rows[0]);
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getProductsByCompany = async (req, res) => {
  try {
    const id = req.params.companyId;

    const response = await pool.query(
      `
          SELECT * FROM product WHERE company_id = $1
          `,
      [id]
    );

    res.json(response.rows);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ error: error.message });
  }
};
