const express = require("express");
const router = express.Router();
const { getSuggestionsFromGemini } = require("../controllers/geminiController");

router.post("/", async (req, res) => {
  try {
    const data = await getSuggestionsFromGemini(req.body);
    res.json(data);
  } catch (err) {
    console.error("Error al procesar sugerencias:", err.message);
    
    // Si el error es por respuestas inadecuadas, enviamos un estado 400
    if (err.message.includes("información proporcionada no es suficiente")) {
      return res.status(400).json({ 
        error: "respuestas_inadecuadas",
        mensaje: err.message 
      });
    }
    
    // Para otros errores, enviamos un 500
    res.status(500).json({ 
      error: "error_api",
      mensaje: "Error en la API de Gemini" 
    });
  }
});

module.exports = router;