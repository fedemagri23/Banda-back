import nodemailer from 'nodemailer';
import { pool } from '../db.js';

export const sendSaleOrderEmail = async (req,res) => {

  const authHeader = req.headers.authorization;
  const jwt = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!jwt) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const {invoiceId} = req.body;

  const pdfBuffer = await getInvoicePDF(invoiceId,jwt);

  const result = await pool.query(
    'SELECT sale_id FROM sale_invoice WHERE id = $1',
    [invoiceId]
  )

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  const { sale_id } = result.rows[0];

  const saleResult = await pool.query(
    'SELECT client_id, company_id FROM sale_order WHERE id = $1',
    [sale_id]
  );

  if (saleResult.rowCount === 0) {
    return res.status(404).json({ message: 'Sale order not found' });
  }

  const { client_id, company_id } = saleResult.rows[0];

  const clientResult = await pool.query(
    'SELECT mail FROM client WHERE id = $1',
    [client_id]
  );

  if (clientResult.rowCount === 0) {
    return res.status(404).json({ message: 'Client not found' });
  }
  const { mail: clientEmail } = clientResult.rows[0];

  
  try {
    
    // Obtener el email de la compañía
    const companyResult = await pool.query(
      `SELECT email, app_password FROM company WHERE id = $1`,
      [company_id]
    );

    if (companyResult.rowCount === 0) {
      throw new Error('Company not found');
    }

    const { email: companyEmail, app_password : app_password } = companyResult.rows[0];
    // Crear transporter con las credenciales de la compañía
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user:  companyEmail,
        pass:  app_password,
      },
      tls: {
        rejectUnauthorized: false,
      }
    });

    const mailOptions = {
      from: companyEmail,
      to: clientEmail,
      subject: `Nueva Orden de Venta creada`,
      text: `Se ha generado una nueva orden de venta para su empresa. ¡Gracias por confiar en nosotros!`,
      attachments: [
        {
          filename: "factura.pdf",
          content: pdfBuffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log('Email enviado correctamente');
    return res.status(200).json({ message: "Email enviado correctamente" });
  } catch (error) {
    console.error('Error enviando email:', error.message);
    throw error;
  }
};

import fetch from "node-fetch"; // o import fetch from "node-fetch";



async function getInvoicePDF(invoiceId,jwt) {
  const response = await fetch('http://localhost:3000/api/invoice/download', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify({ invoiceId}),
  });
  
  if (!response.ok) {
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);

}

