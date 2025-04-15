import { pool } from "../db.js";

export const getInventoryByCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    // Query para obtener productos en órdenes de compra
    const purchasedProducts = await pool.query(
      `
        SELECT product_id, total, quantity FROM product_purchase_detail WHERE company_id = $1;
      `,
      [companyId]
    );

    const purchasedProductsCompressed = Object.values(
      purchasedProducts.rows.reduce((acc, item) => {
        const id = item.product_id;
        const total = Number(item.total);
        const quantity = item.quantity;

        if (!acc[id]) {
          acc[id] = {
            product_id: id,
            total_spent: total,
            amount: quantity,
          };
        } else {
          acc[id].amount += quantity;
          acc[id].total_spent += total;
        }
        return acc;
      }, {})
    );

    // Query para obtener productos en órdenes de venta
    const soldProducts = await pool.query(
      `
        SELECT product_id, quantity FROM product_sale_detail WHERE company_id = $1;
      `,
      [companyId]
    );

    const soldProductsCompressed = Object.values(
      soldProducts.rows.reduce((acc, item) => {
        const id = item.product_id;
        const quantity = item.quantity
        if (!acc[id]) {
          acc[id] = { product_id: id, amount: quantity };
        } else {
          acc[id].amount += quantity;
        }
        return acc;
      }, {})
    );

    const soldMap = soldProductsCompressed.reduce((acc, item) => {
      acc[item.product_id] = item.amount;
      return acc;
    }, {});

    const productIds = purchasedProductsCompressed.map((item) => item.product_id);
    const productsQuery = await pool.query(
      `
        SELECT * FROM product WHERE id = ANY($1::int[]);
      `,
      [productIds]
    );

    const productMap = productsQuery.rows.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});

    const stock = purchasedProductsCompressed.map((item) => ({
      product: productMap[item.product_id],
      total_spent: item.total_spent,
      amount: item.amount - (soldMap[item.product_id] || 0),
    }));

    res.json(stock);
  } catch (error) {
    console.error("Error getting inventory:", error.message);
    res.status(500).json({ error: error.message });
  }
};