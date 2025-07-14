import { processPayment, processWebhook } from "../services/mercadopago.js";
import {pool} from "../db.js";

const plans = {
  standard: {
    price: 40,
    description: "Plan Standard - Acceso a funcionalidades básicas",
  },
  plus: {
    price: 60,
    description: "Plan Plus - Acceso a funcionalidades avanzadas",
  },
  free_trial: {
    price: 0,
    description: "Prueba Gratuita - 30 días gratis",
  }
}

export const processPaymentController = async (req, res) => {
  try {
    const paymentData = req.body;

    const selectedPlan = plans[paymentData.planId] || plans.free_trial;
    const months = paymentData.months || 1;

    if(!selectedPlan) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    const completePaymentData = {
      token: paymentData.token,
      transactionAmount: selectedPlan.price * months, // Mapear nombre
      paymentMethodId: paymentData.payment_method_id,   // Mapear nombre
      installments: paymentData.installments,
      issuerId: paymentData.issuerId || "25",           // Valor por defecto
      description: selectedPlan.description || "Pago desde aplicación",
      payer: {
        email: paymentData.payer.email,
        identification: {
          type: paymentData.payer.identification?.type || "DNI",
          number: paymentData.payer.identification?.number || "12345678"
        }
      }
    };

    const result = await processPayment(completePaymentData);
    
    // Guardar el pago en la base de datos
    await pool.query(
      'INSERT INTO mercado_pago_payments (payment_id, status, amount, description, payer_email, user_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [result.id, result.status, result.transaction_amount, result.description, paymentData.payer.email, paymentData.userId || 1]
    );

    if(result.status == 'approved') {
      // Actualizar el plan del usuario
      await activateUserPlan(paymentData.userId, paymentData.planId, paymentData.months);
    }

    res.json({
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      detail: result.status_detail
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({
      error_message: error.message
    });
  }
};

async function activateUserPlan(userId, planName, months) {
  try {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Obtener el plan seleccionadoawait client.query(`
      await client.query(`
          UPDATE useraccount 
          SET 
            current_plan = $1, 
            plan_activated_at = CURRENT_DATE, 
            plan_expires_at = CURRENT_DATE + INTERVAL '${months} months'
          WHERE id = $2
        `, [planName, userId]);
            
      await client.query('COMMIT');
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error activating user plan:', error);
    throw error;
  }
}


export const webhookController = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentInfo = await processWebhook(data.id);
      
      // Actualizar estado del pago en la base de datos
      await pool.query(
        'UPDATE mercado_pago_payments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE payment_id = $2',
        [paymentInfo.status, paymentInfo.id]
      );

    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Error');
  }
};

export const getPublicKey = async (req, res) => {
  try {
    res.json({
      public_key: process.env.MERCADOPAGO_PUBLIC_KEY
    });
  } catch (error) {
    res.status(500).json({ error: 'Error getting public key' });
  }
};