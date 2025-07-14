import { pool } from '../db.js';

export const getPlanInfo = async (req, res) => {

    try {

        const {userId} = req.body; // Asegúrate de que req.user esté definido y tenga el id del usuario

        const result = await pool.query(`SELECT current_plan, plan_activated_at, plan_expires_at
                             FROM useraccount WHERE id = $1`, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const plan = result.rows[0];

        res.json({
            current_plan: plan.current_plan,
            plan_activated_at: plan.plan_activated_at,
            plan_expires_at: plan.plan_expires_at,
        });
    }
    catch (error) {
        console.error('Error fetching plan info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
       
}