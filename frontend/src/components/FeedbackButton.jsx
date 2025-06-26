import { useState } from "react";

function FeedbackButton() {
  const [feedback, setFeedback] = useState(null);

  const handleFeedback = (value) => {
    setFeedback(value);
    // Opcional: enviar a backend
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <p>¿Te resultaron útiles estas sugerencias?</p>
      <button onClick={() => handleFeedback("👍")}>👍</button>
      <button onClick={() => handleFeedback("👎")}>👎</button>
      {feedback && <p>Gracias por tu respuesta!</p>}
    </div>
  );
}

export default FeedbackButton;