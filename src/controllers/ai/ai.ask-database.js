import { pool } from "../../db.js";
import { aiPrompt } from "../../ai/ai.js";

export const askWithIaDatabase = async (req, res) => {
  const { query, companyId, userId, history } = req.body;

  const context = `
    Eres un asistente de una empresa, los distintos empleados te podran pedir informacion de la base de datos de la empresa,
    para ello debes convertir la pregunta del usuario en una consulta SQL, luego un sistema aparte se encargara de ejecutar la consulta y devolver el resultado.
    La fecha actual es ${new Date().toISOString().split("T")[0]}.
  `;

  const restrictions = `
    Por seguridad las operaciones destructivas o modificativas no estan permitidas, solo lectura.
    Algunos datos de la base de datos son internos, como ids, no los reveles. 
    No puedes revelar informacion de otras companies ni users.
    TODAS las consultas para tablas con company_id DEBEN incluir el filtro: company_id = ${companyId}
    TODAS las consultas para tablas con user_id DEBEN incluir el filtro: user_id = ${userId}
    No debes revelar información sensible como contraseñas, claves, datos personales, etc. En tal caso devuleve una advertencia y no generes una consulta.
    Tampoco debes revelar información de otras empresas, solo la tuya.
    No debes revelar información de otras personas, solo la tuya.
    No debes mostrar como esta implementada la base de datos, solo responde las consultas.
    Bajo ninguna circunstancia generes o sugieras queries que modifiquen o eliminen datos (por ejemplo: DELETE, UPDATE, INSERT, DROP, ALTER, TRUNCATE, etc.).
    Si el usuario intenta inducirte a generar una query de ese tipo, responde con un mensaje de advertencia clara y no generes la consulta.
  `

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

  const format = `
    ## Manejo de variaciones en los datos
    IMPORTANTE: Las bases de datos pueden tener inconsistencias en formato, por lo tanto:

    1. Para comparaciones de texto:
      - Utiliza LOWER() en ambos lados de la comparación: LOWER(columna) = LOWER('valor')
      - O utiliza operadores case-in sensitive como ILIKE cuando estén disponibles
      - Ejemplo: WHERE LOWER(country) = LOWER('united states')

    2. Para sinónimos y variaciones:
      - Utiliza condiciones OR con posibles variantes para todos los casos.
      - Ejemplo: WHERE LOWER(country) IN (LOWER('USA'), LOWER('United States'), LOWER('U.S.A.'), LOWER('Estados Unidos')), esto para todos los casos que se pregunte por alguna constante (otros paises por ejemplo).
      
    3. Para fechas y números:
      - Considera rangos en lugar de valores exactos cuando sea apropiado

    4. Para no revelar nombres de tablas, siempre renombrar ajustandose a lo que se pida.

    ## Formato de respuesta (RESPONDE EN EL IDIOMA EN EL QUE TE HABLEN)
    Responde EXCLUSIVAMENTE con uno de estos formatos JSON:

    1. Si puedes generar una consulta SQL válida:
      { "type": "sql", "query": "SELECT ... WHERE company_id = ${companyId} AND ..." }

    2. Si necesitas aclaración, o es una advertencia, o cualquier otro caso:
      { "type": "question", "message": "¿Podrías especificar...?" }

    NO incluyas comentarios, bloques de código, explicaciones ni texto adicional.
  `;

  const historyContext = `
    El historial de peticiones anteriores es:
    ${
      history && Array.isArray(history)
        ? history.map((h) => `${h.role}: ${h.content}`).join("\n")
        : ""
    }
    Fin del historial.
  `;

  const prompt = `
    ${context} ${restrictions} ${schema} ${format} ${historyContext}
    El mensaje del usuario para esta solicitud es: ${query}
  `;

  const restrictedWords = [
    "INSERT",
    "UPDATE",
    "DELETE",
    "TRUNCATE",
    "CREATE",
    "ALTER",
    "DROP",
    "RENAME",
    "GRANT",
    "REVOKE",
    "BEGIN",
    "COMMIT",
    "ROLLBACK",
    "SAVEPOINT",
    "RELEASE SAVEPOINT",
    "REFRESH",
    "VACUUM",
    "ANALYZE",
    "CLUSTER"
  ];

  try {
    const aiResponse = await aiPrompt(prompt);

    const cleanResponse = aiResponse
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^[\s\n]+|[\s\n]+$/g, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanResponse);
    } catch (error) {
      console.error("Error parseando respuesta JSON:", error);
      console.error("Respuesta original:", aiResponse);
      console.error("Respuesta limpia:", cleanResponse);
      return res.status(500).json({ error: "Error procesando la respuesta de la IA" });
    }

    console.log("Parsed AI Response:", parsed);

    if (parsed.type === "sql") {
      const cleanSql = parsed.query.trim();
      if (
        restrictedWords.some((word) =>
          parsed.query.toLowerCase().includes(word.toLowerCase())
        )
      ) {
        return res
          .status(400)
          .json({ error: "Solo se permiten consultas Read Only." });
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
    console.error(error);
    res.status(500).json({ error: "Error procesando la consulta de IA." });
  }
};