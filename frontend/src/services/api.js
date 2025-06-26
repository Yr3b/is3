export async function fetchSuggestions(respuestas) {
  try {
    const res = await fetch("http://localhost:3000/suggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(respuestas),
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.mensaje || "Error en la API");
    }

    if (!Array.isArray(data)) {
      throw new Error("La respuesta no tiene el formato esperado");
    }

    return data;
  } catch (error) {
    console.error("Error en la API:", error);
    throw error;
  }
}