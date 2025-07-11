

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
