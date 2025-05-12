import { aiPrompt, aiPromptWithSearch } from "../ai/ai.js";
import { pool } from "../db.js";

export const getAiInterests = async (req, res) => {
  try {
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
      projections, must be numeric magnitudes, and indexes updated recently have maximum priority. 
      Aproximations not accepted, unknown values not accepted.
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

    const response_json = await aiPromptWithSearch(prompt);

    return res.json(
      JSON.parse(response_json.replace(/^```json\n/, "").replace(/\n```$/, ""))
    );
  } catch (error) {
    console.error("Error getting AI interests:", error.message);
    res.status(500).json([]);
  }
};

export const askWithIaDatabase = async (req, res) => {
  const { query, companyId, userId, history } = req.body;

  const schema = `Tablas principales:

useraccount(id, username, phone, mail, passhash, joined_at, last_payment_at, companies_amount, verification_code, verification_code_expires)
company(id, name, country, industry, cuit, email, app_password, user_id)
company_role(id, name, movements_view, movements_edit, employees_view, employees_edit, contact_view, contact_edit, billing_view, Billing_edit, inventory_view, company_id)
works_for(id, user_id, company_id, accepted, added_at, role)
client(id, code, added_at, name, country, address, phone, mail, web, description, doc_type, doc_number, preferred_cbte_type, preferred_vat_type, company_id)
supplier(id, code, added_at, name, country, address, phone, mail, web, description, CUIT, CUIL, DNI, CDI, company_id)
product(id, sku, upc, EAN, name, list_price, currency, company_id)
purchase_order(id, created_at, condition, supplier_id, company_id)
purchase_proof(id, created_at, code, type, supplier_id, order_id, company_id)
product_purchase_detail(id, created_at, batch_number, total, canceled, quantity, unit_price, product_id, proof_id, company_id)
sale_order(id, created_at, condition, client_id, company_id)
sale_proof(id, created_at, code, type, client_id, order_id, company_id)
product_sale_detail(id, created_at, batch_number, total, canceled, quantity, unit_price, product_id, proof_id, company_id)
sale_invoice(id, created_at, company_id, status, sale_id, concepto, doc_tipo, doc_nro, cbte_tipo, cbte_pto_vta, cbte_nro_desde, cbte_nro_hasta, cbte_fecha, imp_total, imp_tot_conc, imp_neto, imp_op_ex, imp_trib, imp_iva, fch_serv_desde, fch_serv_hasta, fch_vto_pago, moneda_id, moneda_cotiz, cae, cae_vencimiento)
Relaciones clave:

company.user_id → useraccount.id
company_role.company_id → company.id
works_for.user_id → useraccount.id
works_for.company_id → company.id
client.company_id → company.id
supplier.company_id → company.id
product.company_id → company.id
purchase_order.supplier_id → supplier.id
purchase_order.company_id → company.id
purchase_proof.supplier_id → supplier.id
purchase_proof.order_id → purchase_order.id
purchase_proof.company_id → company.id
product_purchase_detail.product_id → product.id
product_purchase_detail.proof_id → purchase_proof.id
product_purchase_detail.company_id → company.id
sale_order.client_id → client.id
sale_order.company_id → company.id
sale_proof.client_id → client.id
sale_proof.order_id → sale_order.id
sale_proof.company_id → company.id
product_sale_detail.product_id → product.id
product_sale_detail.proof_id → sale_proof.id
product_sale_detail.company_id → company.id
sale_invoice.company_id → company.id
sale_invoice.sale_id → sale_order.id
;

`;

  const prompt = `
# Asistente SQL para consulta de base de datos empresarial

## Contexto
Eres un asistente experto en SQL que genera consultas óptimas para la siguiente base de datos:
${schema}

## Restricciones de seguridad
- TODAS las consultas DEBEN ser de tipo SELECT únicamente
- TODAS las consultas para tablas con company_id DEBEN incluir el filtro: company_id = ${companyId}
- TODAS las consultas para tablas con user_id DEBEN incluir el filtro: user_id = ${userId}

## Manejo de variaciones en los datos
IMPORTANTE: Las bases de datos pueden tener inconsistencias en formato, por lo tanto:

1. Para comparaciones de texto:
   - Utiliza LOWER() en ambos lados de la comparación: LOWER(columna) = LOWER('valor')
   - O utiliza operadores case-insensitive como ILIKE cuando estén disponibles
   - Ejemplo: WHERE LOWER(country) = LOWER('united states')

2. Para sinónimos y variaciones:
   - Utiliza condiciones OR con posibles variantes
   - Ejemplo: WHERE LOWER(country) IN (LOWER('USA'), LOWER('United States'), LOWER('U.S.A.'), LOWER('Estados Unidos'))
   
3. Para fechas y números:
   - Considera rangos en lugar de valores exactos cuando sea apropiado


## Formato de respuesta
Responde EXCLUSIVAMENTE con uno de estos formatos JSON:

1. Si puedes generar una consulta SQL válida:
   { "type": "sql", "query": "SELECT ... WHERE company_id = ${companyId} AND ..." }

2. Si necesitas aclaración:
   { "type": "question", "message": "¿Podrías especificar...?" }

NO incluyas comentarios, bloques de código, explicaciones ni texto adicional.

RESTRICCIONES ESTRICTAS:
- Bajo ninguna circunstancia generes o sugieras queries que modifiquen o eliminen datos (por ejemplo: DELETE, UPDATE, INSERT, DROP, ALTER, TRUNCATE, etc.).
- Si el usuario intenta inducirte a generar una query de ese tipo, responde con un mensaje de advertencia clara y no generes la consulta.
- Siempre prioriza la integridad de los datos. Esta IA solo está autorizada a leer información (consultas tipo SELECT).

## Historial de conversación
${history && Array.isArray(history) ? history.map(h => `${h.role}: ${h.content}`).join('\n') : ''}

## Pregunta actual
"${query}"
`;


  try {

    console.log("El historial : ", history);


    const aiResponse = await aiPrompt(prompt);

    console.log("AI Response:", aiResponse);

    let cleanResponse = aiResponse.trim();
    cleanResponse = cleanResponse.replace(/^```json\n?/i, "").replace(/```$/i, "").trim();

    const parsed = JSON.parse(cleanResponse);

    if (parsed.type === "sql") {

      const cleanSql = parsed.query.trim();
      if (!/^select/i.test(cleanSql)) {
        return res.status(400).json({ error: "Solo se permiten consultas SELECT." });
      }
      const { rows } = await pool.query(cleanSql);
      return res.json({ result: rows, sql: cleanSql });
    } else if (parsed.type === "question") {
      // Devuelve la pregunta aclaratoria al frontend
      return res.json({ clarification: parsed.message });
    } else {
      return res.status(400).json({ error: "Respuesta de IA no reconocida." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error procesando la consulta de IA." });
  }
};