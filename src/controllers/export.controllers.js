import { Parser } from 'json2csv';
import fs from 'fs';
import path from 'path';
import { pool } from '../db.js';

const exportClientsToCSV = async (req, res) => {

  const companyId = req.params.companyId;
  if (!companyId) return res.status(400).send('Falta company_id');

  if (!companyId) return res.status(400).send('Falta company_id');
  try {
    const result = await pool.query('SELECT * FROM client WHERE company_id = $1', [companyId]);
    const datos = result.rows;
    if (!datos.length) return res.status(404).send('No hay datos para exportar');
    const fields = Object.keys(datos[0]);
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(datos);
    const filePath = path.join(process.cwd(), 'client.csv');
    fs.writeFileSync(filePath, csv);
    res.download(filePath, 'client.csv', () => fs.unlinkSync(filePath));
  } catch (err) {
    console.error('Error al exportar CSV:', err);
    res.status(500).send('Ocurrió un error al generar el CSV.');
  }
};

const exportSuppliersToCSV = async (req, res) => {
  const companyId = req.params.companyId;
  if (!companyId) return res.status(400).send('Falta company_id');
  try {
    const result = await pool.query('SELECT * FROM supplier WHERE company_id = $1', [companyId]);
    const datos = result.rows;
    if (!datos.length) return res.status(404).send('No hay datos para exportar');
    const fields = Object.keys(datos[0]);
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(datos);
    const filePath = path.join(process.cwd(), 'supplier.csv');
    fs.writeFileSync(filePath, csv);
    res.download(filePath, 'supplier.csv', () => fs.unlinkSync(filePath));
  } catch (err) {
    console.error('Error al exportar CSV:', err);
    res.status(500).send('Ocurrió un error al generar el CSV.');
  }
};

const exportPurchasesToCSV = async (req, res) => {
  const companyId = req.params.companyId;
  if (!companyId) return res.status(400).send('Falta company_id');
  try {
    const result = await pool.query('SELECT * FROM purchase_order WHERE company_id = $1', [companyId]);
    const datos = result.rows;
    if (!datos.length) return res.status(404).send('No hay datos para exportar');
    const fields = Object.keys(datos[0]);
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(datos);
    const filePath = path.join(process.cwd(), 'purchase.csv');
    fs.writeFileSync(filePath, csv);
    res.download(filePath, 'purchase.csv', () => fs.unlinkSync(filePath));
  } catch (err) {
    console.error('Error al exportar CSV:', err);
    res.status(500).send('Ocurrió un error al generar el CSV.');
  }
};

const exportSalesToCSV = async (req, res) => {
  const companyId = req.params.companyId;
  if (!companyId) return res.status(400).send('Falta company_id');
  try {
    const result = await pool.query('SELECT * FROM sale_order WHERE company_id = $1', [companyId]);
    const datos = result.rows;
    if (!datos.length) return res.status(404).send('No hay datos para exportar');
    const fields = Object.keys(datos[0]);
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(datos);
    const filePath = path.join(process.cwd(), 'sale.csv');
    fs.writeFileSync(filePath, csv);
    res.download(filePath, 'sale.csv', () => fs.unlinkSync(filePath));
  } catch (err) {
    console.error('Error al exportar CSV:', err);
    res.status(500).send('Ocurrió un error al generar el CSV.');
  }
};

const exportInventoryToCSV = async (req, res) => {
    const companyId = req.params.companyId;
  if (!companyId) return res.status(400).send('Falta company_id');
  try {
    const result = await pool.query('SELECT * FROM product_purchase_detail NATURAL JOIN product WHERE company_id = $1;', [companyId]);
    const datos = result.rows;
    if (!datos.length) return res.status(404).send('No hay datos para exportar');
    const fields = Object.keys(datos[0]);
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(datos);
    const filePath = path.join(process.cwd(), 'inventory.csv');
    fs.writeFileSync(filePath, csv);
    res.download(filePath, 'inventory.csv', () => fs.unlinkSync(filePath));
  } catch (err) {
    console.error('Error al exportar CSV:', err);
    res.status(500).send('Ocurrió un error al generar el CSV.');
  }
};

const exportEmployeesToCSV = async (req, res) => {
  const companyId = req.params.companyId;
if (!companyId) return res.status(400).send('Falta company_id');
try {
  const result = await pool.query('SELECT * FROM product WHERE company_id = $1', [companyId]);
  const datos = result.rows;
  if (!datos.length) return res.status(404).send('No hay datos para exportar');
  const fields = Object.keys(datos[0]);
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(datos);
  const filePath = path.join(process.cwd(), 'inventory.csv');
  fs.writeFileSync(filePath, csv);
  res.download(filePath, 'inventory.csv', () => fs.unlinkSync(filePath));
} catch (err) {
  console.error('Error al exportar CSV:', err);
  res.status(500).send('Ocurrió un error al generar el CSV.');
}
};

export {
  exportClientsToCSV,
  exportSuppliersToCSV,
  exportPurchasesToCSV,
  exportSalesToCSV,
  exportInventoryToCSV,
  exportEmployeesToCSV
};

