function SuggestionCard({ data }) {
  // Función para determinar el color basado en la afinidad
  const getAffinityColor = (affinity) => {
    if (affinity >= 80) return "#059669"; // Verde para alta afinidad
    if (affinity >= 60) return "#0284c7"; // Azul para afinidad media-alta
    if (affinity >= 40) return "#f59e0b"; // Amarillo para afinidad media
    return "#dc2626"; // Rojo para baja afinidad
  };

  return (
    <div style={{ 
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      marginBottom: "1rem",
      padding: "1.5rem",
      backgroundColor: "#fff",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Barra de afinidad en la parte superior */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${data.afinidad}%`,
        height: "4px",
        backgroundColor: getAffinityColor(data.afinidad)
      }} />

      <h3 style={{ 
        margin: "0 0 1rem 0",
        color: "#1f2937",
        fontSize: "1.25rem"
      }}>
        {data.carrera}
      </h3>

      <p style={{
        margin: "0 0 1rem 0",
        color: "#4b5563",
        lineHeight: "1.6"
      }}>
        {data.descripcion}
      </p>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        color: getAffinityColor(data.afinidad),
        fontWeight: "600"
      }}>
        <span>Afinidad:</span>
        <span style={{
          backgroundColor: `${getAffinityColor(data.afinidad)}20`,
          color: getAffinityColor(data.afinidad),
          padding: "0.25rem 0.75rem",
          borderRadius: "9999px",
          fontSize: "0.875rem"
        }}>
          {data.afinidad}%
        </span>
      </div>
    </div>
  );
}

export default SuggestionCard;