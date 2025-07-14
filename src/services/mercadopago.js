import { MercadoPagoConfig, Payment } from 'mercadopago';

// Configurar MercadoPago con tu access token
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: {
    timeout: 5000,
  }
});

const payment = new Payment(client);

// Procesar pago directo (Checkout API)
export const processPayment = async (paymentData) => {
  try {
    const body = {
      transaction_amount: paymentData.transactionAmount,
      token: paymentData.token,
      description: paymentData.description,
      installments: paymentData.installments,
      payment_method_id: paymentData.paymentMethodId,
      issuer_id: paymentData.issuerId,
      payer: {
        email: paymentData.payer.email,
        identification: {
          type: paymentData.payer.identification.type,
          number: paymentData.payer.identification.number
        }
      }
    };

    const response = await payment.create({ body });
    return response;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

// Procesar webhook de MercadoPago
export const processWebhook = async (paymentId) => {
  try {
    const paymentInfo = await payment.get({ id: paymentId });
    return paymentInfo;
  } catch (error) {
    console.error('Error processing webhook:', error);
    throw error;
  }
};