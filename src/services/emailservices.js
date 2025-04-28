import nodemailer from 'nodemailer';
import { pool } from '../db.js';

export const sendSaleOrderEmail = async (clientEmail, company_id) => {
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
    });

    const mailOptions = {
      from: companyEmail,
      to: clientEmail,
      subject: `Nueva Orden de Venta creada`,
      text: `Se ha generado una nueva orden de venta para su empresa. Detalles:
      ¡Gracias por confiar en nosotros!`
    };

    await transporter.sendMail(mailOptions);
    console.log('Email enviado correctamente');
    return true;
  } catch (error) {
    console.error('Error enviando email:', error.message);
    throw error;
  }
};
