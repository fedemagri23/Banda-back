import { pool } from "../db.js";

// TODO: Validar que el usuario tenga permisos para crear una factura
export async function createSaleInvoice(req, res) {
  try {
    await pool.query("BEGIN");

    const {
      sale_id,
      company_id,
      concepto,
      doc_tipo,
      doc_nro,
      cbte_tipo,
      cbte_pto_vta,
      cbte_nro_desde,
      cbte_nro_hasta,
      cbte_fecha,
      imp_total,
      imp_tot_conc,
      imp_neto,
      imp_op_ex,
      imp_trib,
      imp_iva,
      fch_serv_desde,
      fch_serv_hasta,
      fch_vto_pago,
      moneda_id,
      moneda_cotiz,
      cae,
      cae_vencimiento,
      taxes = [],
      vats = [],
      related = [],
      optional = [],
      buyers = [],
    } = req.body;

    if (!cae || !cae_vencimiento) {
      return res.status(400).json({
        message: "El CAE y la fecha de vencimiento son obligatorios",
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO sale_invoice (
      company_id, concepto, doc_tipo, doc_nro,
      cbte_tipo, cbte_pto_vta, cbte_nro_desde, cbte_nro_hasta, cbte_fecha,
      imp_total, imp_tot_conc, imp_neto, imp_op_ex, imp_trib, imp_iva,
      fch_serv_desde, fch_serv_hasta, fch_vto_pago,
      moneda_id, moneda_cotiz, cae, cae_vencimiento, sale_id
    ) VALUES (
      $1,$2,$3,$4, 
      $5,$6,$7,$8,$9, 
      $10,$11,$12,$13,$14,$15, 
      $16,$17,$18, 
      $19,$20,$21,$22, 
      $23
    ) RETURNING id`,
      [
        company_id,
        concepto,
        doc_tipo,
        doc_nro,
        cbte_tipo,
        cbte_pto_vta,
        cbte_nro_desde,
        cbte_nro_hasta,
        cbte_fecha,
        imp_total,
        imp_tot_conc,
        imp_neto,
        imp_op_ex,
        imp_trib,
        imp_iva,
        fch_serv_desde,
        fch_serv_hasta,
        fch_vto_pago,
        moneda_id || "PES",
        moneda_cotiz || 1,
        cae,
        cae_vencimiento,
        sale_id,
      ]
    );

    const saleInvoiceId = rows[0].id;

    // Insertar impuestos (taxes)
    for (const tax of taxes) {
      await pool.query(
        `INSERT INTO sale_invoice_tax (sale_invoice_id, tributo_id, description, base_amount, aliquot, amount)
       VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          saleInvoiceId,
          tax.tributo_id,
          tax.description,
          tax.base_amount,
          tax.aliquot,
          tax.amount,
        ]
      );
    }

    // Insertar IVA (vats)
    for (const vat of vats) {
      await pool.query(
        `INSERT INTO sale_invoice_vat (sale_invoice_id, vat_id, base_amount, amount)
       VALUES ($1, $2, $3, $4)`,
        [saleInvoiceId, vat.vat_id, vat.base_amount, vat.amount]
      );
    }

    // Insertar comprobantes relacionados (related)
    for (const rel of related) {
      await pool.query(
        `INSERT INTO sale_invoice_related (sale_invoice_id, related_cbte_tipo, related_pto_vta, related_nro, related_cuit, related_cbte_fch)
       VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          saleInvoiceId,
          rel.related_cbte_tipo,
          rel.related_pto_vta,
          rel.related_nro,
          rel.related_cuit,
          rel.related_cbte_fch,
        ]
      );
    }

    // Insertar opcionales (optional)
    for (const opt of optional) {
      await pool.query(
        `INSERT INTO sale_invoice_optional (sale_invoice_id, optional_id, value)
       VALUES ($1, $2, $3)`,
        [saleInvoiceId, opt.optional_id, opt.value]
      );
    }

    // Insertar compradores (buyers)
    for (const buyer of buyers) {
      await pool.query(
        `INSERT INTO sale_invoice_buyer (sale_invoice_id, doc_tipo, doc_nro, porcentaje)
       VALUES ($1, $2, $3, $4)`,
        [saleInvoiceId, buyer.doc_tipo, buyer.doc_nro, buyer.porcentaje]
      );
    }

    await pool.query("COMMIT");

    res.status(201).json({
      message: "Factura creada correctamente",
      saleInvoiceId,
    });
  } catch (error) {
    console.error("Error al crear la factura:", error.message);
    await pool.query("ROLLBACK");
    res.status(500).json({
      message: "Error al crear la factura",
      error: error.message,
    });
  }
}

export async function getAllSaleInvoices(req, res) {
  const { companyId } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT id, cbte_tipo, cbte_pto_vta, cbte_nro_desde, cbte_fecha, doc_tipo, doc_nro, imp_total
       FROM sale_invoice
       WHERE company_id = $1
       ORDER BY cbte_fecha DESC, cbte_nro_desde DESC`,
      [companyId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo facturas" });
  }
}

/**
 * Obtener una factura completa por ID
 *
 */
export async function getSaleInvoiceById(req, res) {
  const { id } = req.params;
  try {
    const { rows: invoiceRows } = await pool.query(
      `SELECT si.*, 
              so.id AS sale_id, 
              so.created_at AS sale_created_at, 
              so.condition AS sale_condition,
              c.id AS client_id, 
              c.name AS client_name, 
              c.code AS client_code,
              c.doc_type AS client_doc_type,
              c.doc_number AS client_doc_number,
              c.country AS client_country,
              c.preferred_cbte_type AS client_preferred_cbte_type,
              (c.address).town AS client_town,
              (c.address).street AS client_street,
              (c.address).number AS client_number
       FROM sale_invoice si
       LEFT JOIN sale_order so ON si.sale_id = so.id
       LEFT JOIN client c ON so.client_id = c.id
       WHERE si.id = $1`,
      [id]
    );
    if (invoiceRows.length === 0) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    const saleInvoice = invoiceRows[0];

    const { rows: taxes } = await pool.query(
      `SELECT * FROM sale_invoice_tax WHERE sale_invoice_id = $1`,
      [id]
    );
    const { rows: vats } = await pool.query(
      `SELECT * FROM sale_invoice_vat WHERE sale_invoice_id = $1`,
      [id]
    );
    const { rows: related } = await pool.query(
      `SELECT * FROM sale_invoice_related WHERE sale_invoice_id = $1`,
      [id]
    );
    const { rows: optional } = await pool.query(
      `SELECT * FROM sale_invoice_optional WHERE sale_invoice_id = $1`,
      [id]
    );
    const { rows: buyers } = await pool.query(
      `SELECT * FROM sale_invoice_buyer WHERE sale_invoice_id = $1`,
      [id]
    );

    const { rows: saleItems } = await pool.query(
      `SELECT pid.id AS product_id, pid.name AS product_name, psd.quantity, psd.unit_price, psd.total
       FROM sale_proof sp
       JOIN product_sale_detail psd ON sp.id = psd.proof_id
       JOIN product pid ON psd.product_id = pid.id
       WHERE sp.order_id = $1`,
      [saleInvoice.sale_id]
    );

    res.json({
      ...saleInvoice,
      taxes,
      vats,
      related,
      optional,
      buyers,
      saleItems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo factura" });
  }
}

export async function deleteSaleInvoice(req, res) {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM sale_invoice WHERE id = $1`,
      [id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }
    res.json({ message: "Factura eliminada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando factura" });
  }
}

export async function checkSaleInvoiceExists(req, res) {
  const { companyId, saleId } = req.params;

  try {
    const { rowCount } = await pool.query(
      `SELECT 1 FROM sale_invoice WHERE company_id = $1 AND sale_id = $2`,
      [companyId, saleId]
    );

    if (rowCount > 0) {
      return res.json({
        exists: true,
        message: "Invoice exists for the given sale.",
      });
    }

    res.json({
      exists: false,
      message: "No invoice found for the given sale.",
    });
  } catch (err) {
    console.error("Error checking sale invoice existence:", err.message);
    res.status(500).json({
      message: "Error checking sale invoice existence",
      error: err.message,
    });
  }
}
