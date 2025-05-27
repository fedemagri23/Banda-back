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
      - Utiliza condiciones OR con posibles variantes
      - Ejemplo: WHERE LOWER(country) IN (LOWER('USA'), LOWER('United States'), LOWER('U.S.A.'), LOWER('Estados Unidos'))
      
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

// Import functions

function getSchemaForType(type) {
  switch (type) {
    case "supplier":
      return `
        Tabla: supplier
        Campos requeridos: name, country
        Campos opcionales: 
          - code (VARCHAR)
          - added_at (TIMESTAMP)
          - address (ADDRESS: town, street, number, floor, departament, zip_code, observations)
          - phone (VARCHAR)
          - mail (VARCHAR)
          - web (VARCHAR)
          - description (VARCHAR)
          - cuit (VARCHAR)  // Nota: en la BD es 'cuit', no 'CUIT'
          - cuil (VARCHAR)  // Nota: en la BD es 'cuil', no 'CUIL'
          - dni (VARCHAR)   // Nota: en la BD es 'dni', no 'DNI'
          - cdi (VARCHAR)   // Nota: en la BD es 'cdi', no 'CDI'
          - company_id (INTEGER)
      `;
    case "client":
      return `
        Tabla: client
        Campos requeridos: name, country
        Campos opcionales:
          - code (VARCHAR)
          - added_at (TIMESTAMP)
          - address (ADDRESS: town, street, number, floor, departament, zip_code, observations)
          - phone (VARCHAR)
          - mail (VARCHAR)
          - web (VARCHAR)
          - description (VARCHAR)
          - doc_type (INT, default 0)
          - doc_number (VARCHAR)
          - preferred_cbte_type (INT, default 0)
          - preferred_vat_type (INT, default 0)
          - company_id (INTEGER)
      `;
    case "product":
      return `
        Tabla: product
        Campos requeridos: name
        Campos opcionales:
          - sku (VARCHAR)
          - upc (VARCHAR(12))
          - ean (VARCHAR(13))  // Nota: en la BD es 'ean', no 'EAN'
          - list_price (NUMERIC(16,2))
          - currency (VARCHAR(3))
          - company_id (INTEGER)
      `;
    default:
      return "";
  }
}

function getAllSchemas() {
  return `

        Tabla: supplier
        Campos requeridos: name, country
        Campos opcionales: 
          - code (VARCHAR)
          - address (ADDRESS: town, street, number, floor, departament, zip_code, observations)
          - phone (VARCHAR)
          - mail (VARCHAR)
          - web (VARCHAR)
          - description (VARCHAR)
          - CUIT (VARCHAR)
          - CUIL (VARCHAR)
          - DNI (VARCHAR)
          - CDI (VARCHAR)
      
        Tabla: client
        Campos requeridos: name, country
        Campos opcionales:
          - code (VARCHAR)
          - address (ADDRESS: town, street, number, floor, departament, zip_code, observations)
          - phone (VARCHAR)
          - mail (VARCHAR)
          - web (VARCHAR)
          - description (VARCHAR)
          - doc_type (INT, default 0)
          - doc_number (VARCHAR)
          - preferred_cbte_type (INT, default 0)
          - preferred_vat_type (INT, default 0)
  
        Tabla: product
        Campos requeridos: name
        Campos opcionales:
          - sku (VARCHAR)
          - upc (VARCHAR(12))
          - EAN (VARCHAR(13))
          - list_price (NUMERIC(16,2))
          - currency (VARCHAR(3))

      `;
}

function parseAIResponse(response) {
  try {
    // Buscar el primer { y el último }
    const firstBrace = response.indexOf("{");
    const lastBrace = response.lastIndexOf("}");

    // Fallback if standard JSON object delimiters aren't found or are malformed
    if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
      let cleanResponseFallback = response
        .replace(/^```json\n?/, "") // Remove ```json marker
        .replace(/\n?```$/, "") // Remove ``` marker
        .trim();

      try {
        // Try parsing the basic cleaned version as a fallback
        return JSON.parse(cleanResponseFallback);
      } catch (e) {
        console.error("Falló parseo fallback. Respuesta original:", response);
        throw new Error(
          "No se encontró un JSON válido (formato {..}) en la respuesta y el parseo fallback falló."
        );
      }
    }

    // Extract only the part of the JSON between the first { and the last }
    const jsonString = response.substring(firstBrace, lastBrace + 1);

    // Attempt to parse the extracted JSON string
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parseando respuesta de IA:", error.message);
    console.error("Respuesta original que causó el error:", response);
    // Re-throw a new error to be caught by the main try...catch block
    throw new Error(
      "Error procesando la respuesta JSON de la IA: " + error.message
    );
  }
}

async function readFirstLines(file, numLines) {
  return new Promise((resolve, reject) => {
    const lines = [];
    let currentLine = "";

    const stream = file
      .createReadStream()
      .setEncoding("utf8")
      .on("data", (chunk) => {
        currentLine += chunk;
        const lineEnds = currentLine.split("\n");

        for (let i = 0; i < lineEnds.length - 1; i++) {
          if (lines.length < numLines) {
            lines.push(lineEnds[i]);
          }
        }

        currentLine = lineEnds[lineEnds.length - 1];

        if (lines.length >= numLines) {
          stream.destroy();
        }
      })
      .on("end", () => {
        if (currentLine && lines.length < numLines) {
          lines.push(currentLine);
        }
        resolve(lines.join("\n"));
      })
      .on("error", reject);
  });
}

function readCSVContent(file) {
  if (!file || !file.buffer) {
    throw new Error("No se proporcionó archivo o el archivo está vacío.");
  }
  return file.buffer.toString("utf-8");
}

async function validateFileType(csvContent, type) {
  const firstLines = csvContent.split("\n").slice(0, 5).join("\n");
  const validationPrompt = `
    # Validación de tipo de CSV

    ## Muestra del CSV
    ${firstLines}

    ## Tarea
    Analiza el contenido del CSV y determina si corresponde a ${type}.
    Para esto, verifica si las columnas y datos son típicos de ${type}.

    ## Hacete las preguntas :

    Esto matchea mejor para otra tabla?
    Estoy seguro que esto no vale para otro caso?

    ## Estructura esperada para ${type} :
    ${getSchemaForType(type)}

    ## Estrucuctura de todos los casos:
    ${getAllSchemas()}

    ## Formato de respuesta
    Responde EXCLUSIVAMENTE con un JSON que contenga:
    {
      "isValid": true/false,
      "reason": "explicación de por qué es válido o no",
      "detectedType": "supplier/client/product" // el tipo que parece ser
    }

    Es fundamental que reason sea lo mas corta y precisa posible
    ## Responde en español
  `;

  //console.log('Validando tipo de archivo con prompt:', validationPrompt);
  const validationResponse = await aiPrompt(validationPrompt);
  console.log("Respuesta RAW de validación:", validationResponse);

  return parseAIResponse(validationResponse);
}

async function getCSVMapping(csvContent, type) {
  const firstLines = csvContent.split("\n").slice(0, 5).join("\n");
  const mappingPrompt = `
    # Análisis de formato CSV para ${type}

    ## Muestra del CSV
    ${firstLines}

    ## Tarea
    Analiza el formato del CSV y genera un mapeo de columnas.
    Para cada columna del CSV, identifica a qué campo de la base de datos corresponde.

    ## Estructura de la base de datos para ${type}
    ${getSchemaForType(type)}

    ## Formato de respuesta
    Responde EXCLUSIVAMENTE con un JSON que contenga:
    {
      "mapping": [
        {
          "csvColumn": "nombre de la columna en el CSV", // Or numeric index if no header
          "dbField": "nombre del campo en la BD",
          "required": true/false,
          "type": "string/number/date"
        }
      ],
      "delimiter": ",",
      "hasHeader": true/false,
      "encoding": "UTF-8"
    }
    
  `;

  //console.log('Obteniendo mapeo con prompt:', mappingPrompt);
  const aiResponse = await aiPrompt(mappingPrompt);
  console.log("Respuesta RAW de mapeo:", aiResponse);

  return parseAIResponse(aiResponse);
}

async function processAndInsertRows(
  csvContent,
  mappingResult,
  type,
  companyId
) {
  const { mapping, delimiter, hasHeader } = mappingResult;

  // Función para parsear correctamente campos CSV con comillas
  function parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Comillas dobles escapadas
          current += '"';
          i++;
        } else {
          // Cambiar estado de comillas
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        // Fin de campo
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    // Agregar último campo
    result.push(current.trim());
    return result;
  }

  const lines = csvContent.split("\n");
  const startIndex = hasHeader && lines.length > 0 ? 1 : 0;
  const results = {
    processed: 0,
    errors: [],
  };

  // Get header names if present
  let headerMap = {};
  if (hasHeader && lines.length > 0) {
    const headerLineValues = parseCSVLine(lines[0]);
    console.log("Headers encontrados:", headerLineValues);

    headerLineValues.forEach((headerName, index) => {
      const cleanHeader = headerName.replace(/^"|"$/g, "");
      headerMap[cleanHeader.toLowerCase()] = index;
    });
    console.log("Header Map creado:", headerMap);
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (let i = startIndex; i < lines.length; i++) {
      const rawLine = lines[i];
      if (!rawLine.trim()) continue;

      console.log(`Procesando línea ${i + 1}:`, rawLine);
      let rowData = { company_id: companyId };
      let lineValues = parseCSVLine(rawLine);
      console.log("Valores de la línea parseados:", lineValues);

      try {
        for (const map of mapping) {
          console.log("Procesando mapeo:", map);
          const dbField = map.dbField;
          const required = map.required;
          const type = map.type;
          const csvColumnIdentifier = map.csvColumn;

          let value = undefined;

          if (hasHeader) {
            const columnIndex = headerMap[csvColumnIdentifier.toLowerCase()];
            console.log(
              `Buscando columna "${csvColumnIdentifier}" en índice:`,
              columnIndex
            );

            if (columnIndex !== undefined && lineValues.length > columnIndex) {
              value = lineValues[columnIndex];
              // Remover comillas si existen
              value = value.replace(/^"|"$/g, "");
              console.log(
                `Valor encontrado para ${csvColumnIdentifier}:`,
                value
              );
            }
          }

          // Resto del código de procesamiento de valores...
          if (value !== undefined && value !== null) {
            let processedValue = value.trim();

            if (processedValue === "" && !required) {
              processedValue = null;
            } else if (processedValue === "" && required) {
              throw new Error(
                `Línea ${
                  i + 1
                }: Campo requerido "${csvColumnIdentifier}" está vacío.`
              );
            } else if (processedValue !== "") {
              if (type === "number") {
                processedValue = parseFloat(
                  processedValue.replace(/[^0-9.,]+/g, "").replace(",", ".")
                );
                if (isNaN(processedValue)) {
                  throw new Error(
                    `Línea ${
                      i + 1
                    }: Valor inválido para campo numérico "${csvColumnIdentifier}": "${value}"`
                  );
                }
              } else if (type === "date") {
                const date = new Date(processedValue);
                if (isNaN(date.getTime())) {
                  throw new Error(
                    `Línea ${
                      i + 1
                    }: Valor inválido para campo de fecha "${csvColumnIdentifier}": "${value}"`
                  );
                }
                processedValue = date.toISOString().split("T")[0];
              }
            }

            rowData[dbField] = processedValue;
          } else if (required) {
            throw new Error(
              `Línea ${
                i + 1
              }: Campo requerido "${csvColumnIdentifier}" (BD: ${dbField}) faltante.`
            );
          }
        }

        // Resto del código de inserción...
        const { query: insertSql, values: insertValues } = getInsertQuery(
          rowData,
          type
        );
        await client.query(insertSql, insertValues);
        results.processed++;
      } catch (error) {
        console.error(`Error detallado en fila ${i + 1}:`, error.message);
        results.errors.push({
          line: i + 1,
          error: error.message,
          data: rawLine,
        });
      }
    }

    await client.query("COMMIT");
    console.log("Transacción de inserción completada.");
  } catch (transactionError) {
    await client.query("ROLLBACK");
    console.error(
      "Transacción de inserción fallida, realizando ROLLBACK:",
      transactionError.message
    );
    results.errors.push({
      line: "Transaction",
      error: "Inserción masiva fallida: " + transactionError.message,
      details: transactionError.stack,
    });
    throw transactionError;
  } finally {
    client.release();
  }

  return results;
}

export const processCSVWithAI = async (req, res) => {
  const file = req.file;
  const { type } = req.params;
  const companyId = req.params.companyId;

  try {
    const csvContent = readCSVContent(file);

    const prompt = `
    # Procesamiento de CSV para importación a base de datos

    ## Tipo de importación
    ${type}

    ## Estructura de la base de datos
    ${getSchemaForType(type)}

    ## Contenido del CSV
    ${csvContent}

    ## Tarea
    1. Analiza el contenido del CSV
    2. Determina si corresponde al tipo ${type}
    3. Mapea las columnas del CSV a los campos de la base de datos
    4. Procesa cada línea y genera las queries SQL para la inserción

    ## Formato de respuesta
    Responde EXCLUSIVAMENTE con un JSON que contenga:
    {
      "isValid": true/false,
      "reason": null,
      "mapping": [
        {
          "csvColumn": "nombre de la columna en el CSV",
          "dbField": "nombre del campo en la BD (usar nombres exactos de la BD)",
          "required": true/false,
          "type": "string/number/date"
        }
      ],
      "queries": [
        {
          "sql": "INSERT INTO ${type} (...) VALUES (...);",
          "values": ["valor1", "valor2", null, ...],
          "lineNumber": 1
        }
      ]
    }

    ## Reglas importantes
    - Usar parámetros preparados ($1, $2, etc.) para los valores
    - Escapar correctamente los strings
    - Manejar correctamente los tipos de datos (texto, números, fechas)
    - Para direcciones, usar el tipo compuesto address
    - Si un campo opcional está vacío, usar null (en minúsculas)
    - Si un campo requerido está vacío, marcar como error
    - Incluir company_id en cada query
    - IMPORTANTE: Usar null en minúsculas para valores nulos, NO usar NULL
    - IMPORTANTE: Asegurarse que el JSON sea válido (sin comas extra, etc.)
    - IMPORTANTE: Usar los nombres exactos de las columnas como están en la BD (en minúsculas)
    - MUY IMPORTANTE : Si ves alguna primary key duplicada o algun unique duplicado devolve false en isValid y en reason explica cual es el valor duplicado
    `;

    console.log("Enviando CSV completo a la IA para procesamiento...");
    const aiResponse = await aiPrompt(prompt);
    console.log("Respuesta de la IA recibida: ", aiResponse);

    const result = parseAIResponse(aiResponse);

    if (!result.isValid) {
      return res.status(400).json({
        success: false,
        error: `Archivo incorrecto: ${result.reason}`,
      });
    }

    // Insertar los datos en la base de datos
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      for (const query of result.queries) {
        await client.query(query.sql, query.values);
      }

      await client.query("COMMIT");

      return res.json({
        success: true,
        processedCount: result.queries.length,
        mapping: result.mapping,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error procesando CSV:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

function getRequiredFields(type) {
  switch (type) {
    case "supplier":
      return ["name", "country"];
    case "client":
      return ["name", "country"];
    case "product":
      return ["name"];
    default:
      return [];
  }
}
