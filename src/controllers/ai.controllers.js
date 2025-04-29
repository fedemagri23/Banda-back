import aiPrompt from "../ai/ai.js";
import { pool } from "../db.js";

export const getAiInterests = async (req, res) => {
  const company_id = req.params.companyId;

  const { rows } = await pool.query(
    `
        SELECT * FROM company WHERE id = $1 
        `,
    [company_id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: "Company not found" });
  }

  const company = rows[0];

  const country = company.country;
  const industry = company.industry;

  const data_prompt = `
      Give me current values ​​for the ten most relevant 
      indicators for a company in the country of ${country}
      based on the industry of ${industry} and general ${country} 
      econmy interests.
      These indicators should be introjections, not 
      projections, and must be numeric magnitudes 
      (aproximations not accepted, unknown values not accepted).
      If a value is N/A or unknown dont include it in the response.
    `;

  const response_structure_prompt = `, the response
      must be a json with this format:
      {"indicator_name": string, "value": string}.`;

  const parsing_prompt = `
      only the json, not extra text. 
      ONLY JSON. The indicator_names must be in the 
      lenguage spoken in ${country}, and should be short.
    `;

  const prompt = `
      ${data_prompt}${response_structure_prompt}${parsing_prompt}
    `;

  let attempts = 0;
  const maxAttempts = 5;
  const retryDelay = 6000; // 3 seconds
  while (attempts < maxAttempts) {
    try {
      const response_json = await aiPrompt(prompt);
      return res.json(
        JSON.parse(
          response_json.replace(/^```json\n/, "").replace(/\n```$/, "")
        )
      );
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed:`, error.message);
      if (error.message.includes("503") && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        break;
      }
    }
  }

  console.error("Error getting AI interests after maximum retries.");
  res.status(500).json([]);
};
