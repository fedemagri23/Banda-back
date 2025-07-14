import 'dotenv/config';

export const PORT = process.env.PORT || 3001;

export const SECRET_KEY = process.env.JWT_SECRET;

export const currencyExchange = {
    // Based on USD (Echange USD-XXX)
    'USD': 1, 
    'ARS': 1260, 
    'EUR': 0.86,
    'GBP': 0.74,
    'JPY': 147,
    'CNY': 7.2, 
    'BRL': 5.56, 
    'CLP': 957,
    'UYU': 40.6,
    'PEN': 3.5,
    'COP': 4000, 
    'MXN': 16.6,
    'AUD': 1.5,
    'CAD': 1.37,
    'CHF': 0.8,
    'ZAR': 17.9
};