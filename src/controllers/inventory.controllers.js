import { pool } from "../db.js";

export const getInventoryByCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    // Query para obtener productos en órdenes de compra
    const purchasedProducts = await pool.query(
      `
        SELECT product_id, total FROM product_purchase_detail WHERE company_id = $1;
      `,
      [companyId]
    );

    console.log(purchasedProducts.rows);

    const purchasedProductsCompressed = Object.values(
      purchasedProducts.rows.reduce((acc, item) => {
        const id = item.product_id;
        const total = Number(item.total); // Convertir string a número

        if (!acc[id]) {
          acc[id] = {
            product_id: id,
            total_spent: total,
            amount: 1,
          };
        } else {
          acc[id].amount += 1;
          acc[id].total_spent += total;
        }
        return acc;
      }, {})
    );

    console.log(purchasedProductsCompressed);

    // Query para obtener productos en órdenes de venta
    const soldProducts = await pool.query(
      `
        SELECT product_id FROM product_sale_detail WHERE company_id = $1;
      `,
      [companyId]
    );

    console.log(soldProducts.rows);

    const soldProductsCompressed = Object.values(
      soldProducts.rows.reduce((acc, item) => {
        const id = item.product_id;
        if (!acc[id]) {
          acc[id] = { product_id: id, amount: 1 };
        } else {
          acc[id].amount += 1;
        }
        return acc;
      }, {})
    );

    console.log(soldProductsCompressed);

    const soldMap = soldProductsCompressed.reduce((acc, item) => {
      acc[item.product_id] = item.amount;
      return acc;
    }, {});

    const stock = purchasedProductsCompressed.map((item) => ({
      product_id: item.product_id,
      total_spent: item.total_spent,
      amount: item.amount - (soldMap[item.product_id] || 0),
    }));

    res.json(stock);
  } catch (error) {
    console.error("Error getting inventory:", error.message);
    res.status(500).json({ error: error.message });
  }
};
