import { currencyExchange } from "../config.js";
import { pool } from "../db.js";

export const getCurrencies = async (req, res) => {
  try {
    res.json(currencyExchange);
  } catch (error) {
    console.error("Error getting currencies:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getOrderBalanceChart = async (req, res) => {
  try {
    const { startDate, endDate, currency } = req.query;
    const company_id = req.params.companyId;

    const purchaseResponse = await pool.query(
      `
      SELECT * FROM product_purchase_detail WHERE company_id = $1 AND created_at BETWEEN $2 AND $3 
      `,
      [company_id, startDate, endDate]
    );

    const saleResponse = await pool.query(
      `
      SELECT * FROM product_sale_detail WHERE company_id = $1 AND created_at BETWEEN $2 AND $3 
      `,
      [company_id, startDate, endDate]
    );

    if (purchaseResponse.rows.length === 0 && saleResponse.rows.length === 0) {
      return res.json({
        metrics: [],
        balance: 0
      });
    }

    const saleMetrics = Object.values(
      saleResponse.rows.reduce((acc, item) => {
        const created_at = item.created_at;
        const total = Number(item.total);
        const itemCurrency = item.currency;

        const usdBalance = total / currencyExchange[itemCurrency];
        
        if (!acc[created_at]) {
          acc[created_at] = {
            date: created_at,
            balance: usdBalance * currencyExchange[currency],
          };
        } else {
          acc[created_at].balance += usdBalance * currencyExchange[currency];
        }
        return acc;
      }, {})
    );

    const purchaseMetrics = Object.values(
      purchaseResponse.rows.reduce((acc, item) => {
        const created_at = item.created_at;
        const total = Number(item.total);
        const itemCurrency = item.currency;

        console.log(currencyExchange[itemCurrency]);

        const usdBalance = total / currencyExchange[itemCurrency];
        
        if (!acc[created_at]) {
          acc[created_at] = {
            date: created_at,
            balance: usdBalance * currencyExchange[currency],
          };
        } else {
          acc[created_at].balance += usdBalance * currencyExchange[currency];
        }
        return acc;
      }, {})
    );

    const round = (num) => Math.round(num * 100) / 100;

    const saleMap = Object.fromEntries(
      saleMetrics.map((s) => [new Date(s.date).toISOString(), s.balance])
    );

    const purchaseMap = Object.fromEntries(
      purchaseMetrics.map((p) => [new Date(p.date).toISOString(), p.balance])
    );

    const allDates = Array.from(
      new Set([
        ...saleMetrics.map((s) => new Date(s.date).toISOString()),
        ...purchaseMetrics.map((p) => new Date(p.date).toISOString()),
      ])
    );

    const metrics = allDates.map((date) => {
      const sale = saleMap[date] || 0;
      const purchase = purchaseMap[date] || 0;
      return {
        date,
        balance: round(sale - purchase),
      };
    });

    const saleBalance = saleResponse.rows.reduce((acc, item) => {
      const itemCurrency = item.currency;
      const usdTotal = Number(item.total)/currencyExchange[itemCurrency];
      acc += usdTotal * currencyExchange[currency];
      return acc;
    }, 0);

    const purchaseBalance = purchaseResponse.rows.reduce((acc, item) => {
      const itemCurrency = item.currency;
      const usdTotal = Number(item.total)/currencyExchange[itemCurrency];
      acc += usdTotal * currencyExchange[currency];
      return acc;
    }, 0);

    const balance = round(saleBalance - purchaseBalance);

    // Endpoint exaple: http://localhost:3000/metric/order/balance-chart/1?startDate=2023-01-01&endDate=2023-12-31

    res.json({
      metrics: fillMissingDatesWithTimezone(metrics, ["balance"]),
      balance: balance,
    });
  } catch (error) {
    console.error("Error getting balance chart:", error.message);
    res.status(500).json({ error: error.message });
  }
};

function fillMissingDatesWithTimezone(data, categoryKeys) {
  if (data.length === 0) return [];

  // Ordenar los datos por fecha
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const startDate = new Date(sortedData[0].date);
  const endDate = new Date(sortedData[sortedData.length - 1].date);
  const dateMap = new Map(sortedData.map(item => [item.date.slice(0, 10), item]));

  const result = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const isoDate = current.toISOString().split("T")[0]; // yyyy-mm-dd
    const fullDate = `${isoDate}T03:00:00.000Z`;

    if (dateMap.has(isoDate)) {
      result.push(dateMap.get(isoDate));
    } else {
      const emptyEntry = { date: fullDate };
      categoryKeys.forEach(key => {
        emptyEntry[key] = 0;
      });
      result.push(emptyEntry);
    }

    current.setUTCDate(current.getUTCDate() + 1);
  }

  return result;
}

export const getSupplierDistributionChart = async (req, res) => {
  try {
    const company_id = req.params.companyId;
    const { startDate, endDate, currency } = req.query;
    const response = await pool.query(
      `
      SELECT 
        s.name AS supplier_name,
        product_purchase_detail.total AS total,
        product_purchase_detail.currency AS currency
      FROM supplier s
      LEFT JOIN purchase_order po ON s.id = po.supplier_id
      LEFT JOIN purchase_proof pp ON po.id = pp.order_id
      LEFT JOIN product_purchase_detail ON pp.id = product_purchase_detail.proof_id
      WHERE s.company_id = $1 AND product_purchase_detail.created_at BETWEEN $2 AND $3
      `,
      [company_id, startDate, endDate]
    );

    if (response.rows.length === 0) {
      return res.json([]);
    }

    // Agrupar por supplier_name y sumar los totales convertidos
    const supplierTotals = {};
    response.rows.forEach(item => {
      const supplier = item.supplier_name;
      const total = Number(item.total);
      const itemCurrency = item.currency;
      const usdTotal = total / currencyExchange[itemCurrency];
      const convertedTotal = usdTotal * currencyExchange[currency];
      if (!supplierTotals[supplier]) supplierTotals[supplier] = 0;
      supplierTotals[supplier] += convertedTotal;
    });

    const result = Object.entries(supplierTotals).map(([supplier_name, total_purchases]) => ({
      supplier_name,
      total_purchases: Math.round(total_purchases * 100) / 100
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching suppliers with purchases:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getClientDistributionChart = async (req, res) => {
  try {
    const company_id = req.params.companyId;
    const { startDate, endDate, currency } = req.query;

    const response = await pool.query(
      `
      SELECT 
        c.name AS client_name,
        psd.total AS total,
        psd.currency AS currency
      FROM client c
      LEFT JOIN sale_order so ON c.id = so.client_id
      LEFT JOIN sale_proof sp ON so.id = sp.order_id
      LEFT JOIN product_sale_detail psd ON sp.id = psd.proof_id
      WHERE c.company_id = $1 AND psd.created_at BETWEEN $2 AND $3
      `,
      [company_id, startDate, endDate]
    );

    if (response.rows.length === 0) {
      return res.json([]);
    }

    // Agrupar por client_name y sumar los totales convertidos
    const clientTotals = {};
    response.rows.forEach(item => {
      const client = item.client_name;
      const total = Number(item.total);
      const itemCurrency = item.currency;
      const usdTotal = total / currencyExchange[itemCurrency];
      const convertedTotal = usdTotal * currencyExchange[currency];
      if (!clientTotals[client]) clientTotals[client] = 0;
      clientTotals[client] += convertedTotal;
    });

    const result = Object.entries(clientTotals).map(([client_name, total_sales]) => ({
      client_name,
      total_sales: Math.round(total_sales * 100) / 100
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching clients with sales:", error.message);
    res.status(500).json({ error: error.message });
  }
};
