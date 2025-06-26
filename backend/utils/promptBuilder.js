function buildPrompt(respuestas) {
  const { intereses, materias, estiloVida, valores, habilidades } = respuestas;

  return `
Sos un orientador vocacional.

Con base en las siguientes respuestas del usuario, recomendá de 3 a 5 carreras afines. Para cada una, devolvé:
- Nombre de la carrera
- Breve descripción (1-2 oraciones)
- Porcentaje de afinidad estimado

Respuestas del usuario:
- Intereses: ${intereses}
- Materias favoritas: ${materias}
- Estilo de vida: ${estiloVida}
- Valores personales: ${valores}
- Habilidades destacadas: ${habilidades}

Devolvé solo el JSON con este formato:

[
  {
    "carrera": "Nombre de la carrera",
    "descripcion": "Breve descripción",
    "afinidad": 90
  }
]
`;
}

module.exports = { buildPrompt };
