import { pool } from "../db.js";

export const addPurchaseOrder = async (req, res) => {
  const { condition, supplier_id, proof_code, proof_type, products_details } =
    req.body;
  const company_id = req.params.companyId;

  try {
    /*
    Validaciones:
    condition: Debe ser uno de los siguientes strings: 
      ["CNT", "P30", "P60", "P90", "CTE", "CDF", "TRB", "DBA", "CUC", "OTH"]
      VER MANUAL DE PAGOS
    supplier_id debe tener una instancia de supplier asociada existente
    proof_code maximo 8 caracteres, solo letras y numeros, no se aceptan espacios
    proof_type: Debe ser uno de los siguientes strings:
      [ "FACTA", "FACTB", "FACTC", "FACTM", "FACTE",
        "NTCRA", "NTCRB", "NTCRC", "NTCRM",
        "NTDBA", "NTDBB", "NTDBC", "NTDBM",
        "RECIB", "OTHER"
      ]
      VER MANUAL DE PAGOS
    products_details: Debe ser un objeto con los siguientes campos:
      detail.batch_number: Puede contener letras, numeros y guiones, nada mas
      detail.total: Numero real de dos decimales 
    Ninguno puede ser vacio.
    */

    const validConditions = [
      "CNT",
      "P30",
      "P60",
      "P90",
      "CTE",
      "CDF",
      "TRB",
      "DBA",
      "CUC",
      "OTH",
    ];
    const validProofTypes = [
      "FACTA",
      "FACTB",
      "FACTC",
      "FACTM",
      "FACTE",
      "NTCRA",
      "NTCRB",
      "NTCRC",
      "NTCRM",
      "NTDBA",
      "NTDBB",
      "NTDBC",
      "NTDBM",
      "RECIB",
      "OTHER",
    ];

    if (!validConditions.includes(condition)) {
      return res.status(400).json({ error: "Invalid payment condition." });
    }

    const supplierCheck = await pool.query(
      `SELECT * FROM supplier WHERE id = $1`,
      [supplier_id]
    );
    if (supplierCheck.rowCount === 0) {
      return res.status(400).json({ error: "Supplier not found." });
    }

    if (!/^[A-Za-z0-9]{1,8}$/.test(proof_code)) {
      return res.status(400).json({
        error:
          "Invalid proof code. Only letters and numbers are allowed, up to 8 characters, no spaces.",
      });
    }

    if (!validProofTypes.includes(proof_type)) {
      return res.status(400).json({ error: "Invalid proof type." });
    }

    if (!Array.isArray(products_details) || products_details.length === 0) {
      return res
        .status(400)
        .json({ error: "You must provide at least one product detail." });
    }

    for (const detail of products_details) {
      if (
        !detail.batch_number ||
        !/^[A-Za-z0-9\-]+$/.test(detail.batch_number)
      ) {
        return res.status(400).json({
          error:
            "Invalid batch number. Only letters, numbers and hyphens are allowed.",
        });
      }

      if (
        typeof detail.total !== "number" ||
        !/^\d+(\.\d{1,2})?$/.test(detail.total.toFixed(2))
      ) {
        return res.status(400).json({
          error: "Total must be a number with up to two decimal places.",
        });
      }
    }

    // Purchase order
    const response_order = await pool.query(
      `
      INSERT INTO purchase_order (condition, supplier_id, company_id) VALUES ($1, $2, $3) RETURNING *
      `,
      [condition, supplier_id, company_id]
    );

    if (response_order.rowCount == 0) {
      console.error("Error creating purchase order:", error.message);
      return res.status(500).json({ error: error.message });
    }

    const order_id = response_order.rows[0].id;

    // Proof
    const response_proof = await pool.query(
      `
      INSERT INTO proof (code, type, supplier_id, order_id, company_id) VALUES ($1, $2, $3, $4, $5) RETURNING *
      `,
      [proof_code, proof_type, supplier_id, order_id, company_id]
    );

    if (response_proof.rowCount == 0) {
      console.error("Error creating purchase proof:", error.message);
      return res.status(500).json({ error: error.message });
    }

    const proof_id = response_proof.rows[0].id;

    // Purchase details
    for (const detail of products_details) {
      const response_detail = await pool.query(
        `
        INSERT INTO product_purchase_detail (batch_number, total, product_id, proof_id, company_id) VALUES ($1, $2, $3, $4, $5) RETURNING *
        `,
        [
          detail.batch_number,
          detail.total,
          detail.product_id,
          proof_id,
          company_id,
        ]
      );

      if (response_detail.rowCount == 0) {
        console.error(
          "Error creating purchase detail for product:",
          error.message
        );
        return res.status(500).json({ error: error.message });
      }
    }

    res.json(response_order.rows[0]);
  } catch (error) {
    console.error("Error creating purchase item:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getPurchaseOrders = async (req, res) => {
  const company_id = req.params.companyId;

  try {
    const response = await pool.query(
      `
      SELECT 
        purchase_order.id AS order_id,
        purchase_order.created_at AS order_created_at,
        purchase_order.condition,
        purchase_order.company_id,
    
        proof.id AS proof_id,
        proof.supplier_id,
        proof.code,
        proof.type,
        proof.order_id AS proof_order_id,
    
        product_purchase_detail.id AS detail_id,
        product_purchase_detail.batch_number,
        product_purchase_detail.total,
        product_purchase_detail.canceled,
        product_purchase_detail.product_id
    
      FROM purchase_order 
      JOIN proof ON purchase_order.id = proof.order_id
      JOIN product_purchase_detail ON proof.id = product_purchase_detail.proof_id
      WHERE purchase_order.company_id = $1
      `,
      [company_id]
    );

    if (response.rowCount == 0) {
      return res.status(404).json({ error: "No purchase orders found." });
    }

    const rows = response.rows;
    const ordersMap = new Map();

    for (const row of rows) {
      const orderId = row.order_id;

      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          id: row.order_id,
          created_at: row.order_created_at,
          condition: row.condition,
          company_id: row.company_id,
          proof: {
            id: row.proof_id,
            supplier_id: row.supplier_id,
            code: row.code,
            type: row.type,
            order_id: row.proof_order_id,
          },
          details: [],
        });
      }

      ordersMap.get(orderId).details.push({
        id: row.detail_id,
        batch_number: row.batch_number,
        total: row.total,
        canceled: row.canceled,
        product_id: row.product_id,
      });
    }

    const formatted = Array.from(ordersMap.values());
    res.json(formatted);
  } catch (error) {
    console.error("Error fetching purchase orders:", error.message);
    res.status(500).json({ error: error.message });
  }
};
