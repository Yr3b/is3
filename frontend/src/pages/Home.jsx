"use client"

import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="container container-center">
      <div className="hero-section">
        <h1 className="hero-title">MentorX — Asistente Vocacional</h1>
        <p className="hero-description">
          Esta app te ayudará a encontrar carreras que se alineen con tus intereses, valores y estilo de vida.
        </p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate("/cuestionario")}>
          Comenzar cuestionario
        </button>
      </div>
    </div>
  )
}

export default Home
