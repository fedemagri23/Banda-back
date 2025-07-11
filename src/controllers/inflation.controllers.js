import { pool } from "../db.js";

export async function getInflationData (req, res) {
  try {
    const { start_date, end_date } = req.query;
    
    let query = `
      SELECT date, rate
      FROM monthly_inflation
    `;
    const queryParams = [];
    
    if (start_date || end_date) {
      query += ' WHERE ';
      const conditions = [];
      
      if (start_date) {
        conditions.push('date >= $' + (queryParams.length + 1));
        queryParams.push(start_date);
      }
      
      if (end_date) {
        conditions.push('date <= $' + (queryParams.length + 1));
        queryParams.push(end_date);
      }
      
      query += conditions.join(' AND ');
    }
    
    query += ' ORDER BY date ASC';
    
    const result = await pool.query(query, queryParams);

    const formattedData = result.rows.map(row => [
      row.date.toISOString().split('T')[0],
      Number(row.rate),
    ]);

    return res.json({
      data: formattedData,
      count: formattedData.length,
    });
  } catch (err) {
    console.error('[getInflationData]', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export async function getCpiData (req, res) {
  try {
    const { start_date, end_date } = req.query;
    
    let query = `
      SELECT date, cpi_value
      FROM inflation_cpi
    `;
    const queryParams = [];
    
    if (start_date || end_date) {
      query += ' WHERE ';
      const conditions = [];
      
      if (start_date) {
        conditions.push('date >= $' + (queryParams.length + 1));
        queryParams.push(start_date);
      }
      
      if (end_date) {
        conditions.push('date <= $' + (queryParams.length + 1));
        queryParams.push(end_date);
      }
      
      query += conditions.join(' AND ');
    }
    
    query += ' ORDER BY date ASC';
    
    const result = await pool.query(query, queryParams);

    const formattedData = result.rows.map(row => [
      row.date.toISOString().split('T')[0],
      Number(row.cpi_value),
    ]);

    return res.json({
      data: formattedData,
      count: formattedData.length,
    });
  } catch (err) {
    console.error('[getCpiData]', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

