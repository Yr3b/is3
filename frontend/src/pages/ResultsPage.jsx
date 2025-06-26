import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSuggestions } from "../services/api";
import SuggestionCard from "../components/SuggestionCard";
import FeedbackButton from "../components/FeedbackButton";

function ResultsPage() {
  const [sugerencias, setSugerencias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerSugerencias = async () => {
      try {
        const respuestas = localStorage.getItem("respuestas");

        if (!respuestas) {
          setError("No se encontraron respuestas del cuestionario.");
          setIsLoading(false);
          return;
        }

        const respuestasParseadas = JSON.parse(respuestas);
        const data = await fetchSuggestions(respuestasParseadas);

        if (!data || data.length === 0) {
          setError("No se obtuvieron sugerencias. Por favor, intenta nuevamente.");
          return;
        }

        setSugerencias(data);
      } catch (err) {
        // Si el error es por respuestas inadecuadas, mostramos un mensaje específico
        if (err.message?.includes("información proporcionada no es suficiente")) {
          setError(err.message);
        } else {
          setError("Hubo un problema al obtener las sugerencias.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    obtenerSugerencias();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Cargando sugerencias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#dc2626" }}>
        <h2>No pudimos generar recomendaciones</h2>
        <p className="error-message">{error}</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/cuestionario")}
        >
          Volver al cuestionario
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Resultados recomendados</h2>
      <div style={{ marginTop: "1rem" }}>
        {sugerencias.map((item, idx) => (
          <SuggestionCard key={`suggestion-${idx}`} data={item} />
        ))}
      </div>
      <FeedbackButton />
    </div>
  );
}

export default ResultsPage;