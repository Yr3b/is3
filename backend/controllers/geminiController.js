const { GoogleGenAI } = require("@google/genai");
const XLSX = require('xlsx');
const path = require('path');
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Función para cargar carreras desde Excel
function cargarCarrerasDesdeExcel() {
  try {
    // Asumimos que el archivo está en la carpeta data del backend
    const excelPath = path.join(__dirname, '..', 'data', 'carreras.xlsx');
    const workbook = XLSX.readFile(excelPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      console.error("No se encontraron datos en el archivo Excel");
      return [];
    }

    // Obtener la primera fila para diagnóstico
    console.log("Primera fila del Excel:", JSON.stringify(data[0], null, 2));

    // Validar que cada fila tenga el campo Carreras (plural)
    const carrerasValidas = data.filter(row => row.Carreras && typeof row.Carreras === 'string');
    
    if (carrerasValidas.length === 0) {
      console.error("No se encontraron carreras válidas en el Excel. Asegúrate de que haya una columna llamada 'Carreras'");
      return [];
    }

    console.log(`Se cargaron ${carrerasValidas.length} carreras desde el Excel`);

    // Convertir los datos al formato que necesitamos
    return carrerasValidas.map(row => ({
      nombre: row.Carreras.trim(), // La columna se llama "Carreras" (con s)
      descripcion: row.Descripcion ? row.Descripcion.trim() : undefined
    }));
  } catch (error) {
    console.error("Error al cargar carreras desde Excel:", error);
    return [];
  }
}

function cleanJsonResponse(text) {
  return text.replace(/```json\s*/g, "").replace(/```/g, "").trim();
}

async function getSuggestionsFromGemini(respuestas) {
  // Cargar carreras frescas cada vez que se llama a la función
  const CARRERAS_DISPONIBLES = cargarCarrerasDesdeExcel();

  if (CARRERAS_DISPONIBLES.length === 0) {
    throw new Error("No hay carreras disponibles en el sistema. Verifica el archivo Excel.");
  }

  const prompt = `
Actúa como un orientador vocacional experto que analiza respuestas y recomienda carreras.

CONTEXTO:
Estas son las respuestas del usuario al cuestionario vocacional:
${JSON.stringify(respuestas, null, 2)}

CARRERAS DISPONIBLES:
Las recomendaciones SOLO pueden ser de esta lista de carreras disponibles:
${JSON.stringify(CARRERAS_DISPONIBLES, null, 2)}

INSTRUCCIONES:
1. Primero, evalúa si las respuestas son válidas considerando:
   - Que tengan sentido y sean coherentes
   - Que estén relacionadas con la pregunta
   - Que proporcionen información útil para una orientación vocacional
   - Que no sean respuestas genéricas o sin sentido

2. Si las respuestas NO son válidas, devuelve este objeto JSON sin ningún formato adicional:
{
  "error": "respuestas_inadecuadas",
  "mensaje": "La información proporcionada no es suficiente o adecuada para hacer una recomendación precisa. Por favor, intenta completar el cuestionario nuevamente proporcionando más detalles sobre tus intereses y preferencias."
}

3. Si las respuestas SON válidas, analiza el perfil del usuario y recomienda las carreras más adecuadas de la lista proporcionada:
   - DEBES devolver al menos 1 recomendación si las respuestas son válidas
   - Devuelve hasta 3 carreras recomendadas en total
   - Usa este formato exacto para cada recomendación:
[
  {
    "carrera": "Nombre exacto de la carrera de la lista",
    "descripcion": "Explicación personalizada de por qué esta carrera se alinea con el perfil del usuario",
    "afinidad": 95
  }
]

REGLAS IMPORTANTES:
- SIEMPRE debes recomendar al menos 1 carrera si las respuestas son válidas
- SOLO recomendar carreras de la lista proporcionada
- La afinidad debe ser un número entre 0 y 100
- La afinidad debe reflejar qué tan bien se alinea la carrera con el perfil
- Si una carrera tiene menos de 40% de afinidad, no la recomiendas
- Ordena las carreras de mayor a menor afinidad
- NO uses comillas backtick (\`\`\`)
- NO incluyas la palabra "json"
- NO incluyas texto adicional
- Devuelve SOLO el JSON puro

NOTA IMPORTANTE: Si las respuestas son válidas pero no encuentras ninguna carrera con afinidad mayor a 40%, aún así debes recomendar la carrera más afín, ajustando su porcentaje de afinidad para reflejar el bajo match pero permitiendo que el usuario reciba al menos una sugerencia.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const text = response.text;

    const cleanedText = cleanJsonResponse(text);
    console.log("Respuesta limpia:", cleanedText);

    try {
      const jsonResponse = JSON.parse(cleanedText);

      if (jsonResponse.error === "respuestas_inadecuadas") {
        throw new Error(jsonResponse.mensaje);
      }

      if (!Array.isArray(jsonResponse) || jsonResponse.length === 0) {
        console.error("La respuesta no es un array válido o está vacío:", cleanedText);
        throw new Error("El sistema no pudo generar recomendaciones válidas. Por favor, intenta nuevamente con respuestas más detalladas.");
      }

      // Validar que cada carrera recomendada esté en la lista de carreras disponibles
      jsonResponse.forEach((sugerencia) => {
        if (!CARRERAS_DISPONIBLES.some((c) => c.nombre === sugerencia.carrera)) {
          console.error("Carrera no encontrada en la lista:", sugerencia.carrera);
          console.log("Carreras disponibles:", CARRERAS_DISPONIBLES.map(c => c.nombre));
          throw new Error("La respuesta contiene carreras que no están en la lista disponible");
        }

        if (
          typeof sugerencia.afinidad !== "number" ||
          sugerencia.afinidad < 0 ||
          sugerencia.afinidad > 100
        ) {
          throw new Error("La respuesta contiene porcentajes de afinidad inválidos");
        }
      });

      // Ordenar por afinidad de mayor a menor
      return jsonResponse.sort((a, b) => b.afinidad - a.afinidad);
    } catch (parseError) {
      console.error("Error al parsear JSON:", parseError);
      throw new Error("El sistema no pudo generar recomendaciones válidas. Por favor, intenta nuevamente.");
    }
  } catch (error) {
    console.error("❌ Error al generar contenido con Gemini:", error.message);
    throw error;
  }
}

module.exports = { 
  getSuggestionsFromGemini,
  cargarCarrerasDesdeExcel // Exportamos la función para poder probarla
};
