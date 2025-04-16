import { pool } from "../db.js";

export const getOrderBalanceChart = async (req, res) => {
  const { startDate, endDate } = req.query;
  const company_id = req.params.companyId;

  try {
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

    const saleMetrics = Object.values(
      saleResponse.rows.reduce((acc, item) => {
        const created_at = item.created_at;
        const total = Number(item.total);

        if (!acc[created_at]) {
          acc[created_at] = {
            date: created_at,
            balance: total,
          };
        } else {
          acc[created_at].balance += total;
        }
        return acc;
      }, {})
    );

    const purchaseMetrics = Object.values(
      purchaseResponse.rows.reduce((acc, item) => {
        const created_at = item.created_at;
        const total = Number(item.total);

        if (!acc[created_at]) {
          acc[created_at] = {
            date: created_at,
            balance: total,
          };
        } else {
          acc[created_at].balance += total;
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
      const total = Number(item.total);
      acc += total;
      return acc;
    }, 0);

    const purchaseBalance = purchaseResponse.rows.reduce((acc, item) => {
      const total = Number(item.total);
      acc += total;
      return acc;
    }, 0);

    const balance = round(saleBalance - purchaseBalance);

    // Endpoint exaple: http://localhost:3000/metric/order/balance-chart/1?startDate=2023-01-01&endDate=2023-12-31

    res.json({
      "metrics": metrics,
      "balance": balance,
    });
  } catch (error) {
    console.error("Error getting balance chart:", error.message);
    res.status(500).json({ error: error.message });
  }
};
