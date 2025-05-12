import { Parser } from 'json2csv';
import fs from 'fs';
import path from 'path';
import {pool} from '../db.js'; // Importación de la conexión a PostgreSQL

const exportClientsToCSV = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM client');
    const datos = result.rows;

    const fields = Object.keys(datos[0])
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(datos);

    const filePath = path.join(process.cwd(), 'client.csv'); // Usar process.cwd() para obtener el directorio actual
    fs.writeFileSync(filePath, csv);

    res.download(filePath, 'client.csv', () => {
      fs.unlinkSync(filePath); // Borra el archivo después de enviarlo
    });
  } catch (err) {
    console.error('Error al exportar CSV:', err);
    res.status(500).send('Ocurrió un error al generar el CSV.');
  }
};

const exportSuppliersToCSV = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM supplier');
    const datos = result.rows;

    const fields = Object.keys(datos[0])
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(datos);

    const filePath = path.join(process.cwd(), 'supplier.csv'); // Usar process.cwd() para obtener el directorio actual
    fs.writeFileSync(filePath, csv);

    res.download(filePath, 'supplier.csv', () => {
      fs.unlinkSync(filePath); // Borra el archivo después de enviarlo
    });
  } catch (err) {
    console.error('Error al exportar CSV:', err);
    res.status(500).send('Ocurrió un error al generar el CSV.');
  }
};

const exportPurchasesToCSV = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM purchase_order');
    const datos = result.rows;

    const fields = Object.keys(datos[0])
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(datos);

    const filePath = path.join(process.cwd(), 'purchase.csv'); // Usar process.cwd() para obtener el directorio actual
    fs.writeFileSync(filePath, csv);

    res.download(filePath, 'purchase.csv', () => {
      fs.unlinkSync(filePath); // Borra el archivo después de enviarlo
    });
  } catch (err) {
    console.error('Error al exportar CSV:', err);
    res.status(500).send('Ocurrió un error al generar el CSV.');
  }
};

const exportSalesToCSV = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sale_order');
    const datos = result.rows;

    const fields = Object.keys(datos[0])
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(datos);

    const filePath = path.join(process.cwd(), 'sale.csv'); // Usar process.cwd() para obtener el directorio actual
    fs.writeFileSync(filePath, csv);

    res.download(filePath, 'sale.csv', () => {
      fs.unlinkSync(filePath); // Borra el archivo después de enviarlo
    });
  } catch (err) {
    console.error('Error al exportar CSV:', err);
    res.status(500).send('Ocurrió un error al generar el CSV.');
  }
};

export { exportClientsToCSV, exportSuppliersToCSV,exportPurchasesToCSV ,exportSalesToCSV };
