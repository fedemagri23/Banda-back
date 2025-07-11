import { pool } from "../../db.js";
import { aiPrompt } from "../../ai/ai.js";

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