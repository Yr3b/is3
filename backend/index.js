const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rutas
const suggestionsRoutes = require("./routes/suggestions");
app.use("/suggestions", suggestionsRoutes);

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});