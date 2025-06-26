"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

const FORM_FIELDS = {
  intereses: {
    label: "Intereses",
    placeholder: "¿Qué temas o actividades te apasionan? Por ejemplo: tecnología, arte, ciencias, deportes...",
    minLength: 10,
  },
  materias: {
    label: "Materias Favoritas",
    placeholder: "¿Qué materias te gustaron más en la escuela? ¿Por qué te gustaron?",
    minLength: 10,
  },
  estiloVida: {
    label: "Estilo de Vida Deseado",
    placeholder: "¿Cómo te gustaría que sea tu vida profesional? (horarios flexibles, trabajo en equipo, etc)",
    minLength: 10,
  },
  valores: {
    label: "Valores Personales",
    placeholder: "¿Qué valores son importantes para ti? (ayudar a otros, creatividad, innovación...)",
    minLength: 10,
  },
  habilidades: {
    label: "Habilidades",
    placeholder: "¿Cuáles son tus puntos fuertes? (comunicación, resolución de problemas, creatividad...)",
    minLength: 10,
  },
}

function QuestionnairePage() {
  const [form, setForm] = useState({
    intereses: "",
    materias: "",
    estiloVida: "",
    valores: "",
    habilidades: "",
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validateField = (name, value) => {
    if (value.length < FORM_FIELDS[name].minLength) {
      return `Por favor, proporciona más detalles sobre tus ${name} (mínimo ${FORM_FIELDS[name].minLength} caracteres)`
    }
    return ""
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = () => {
    const newErrors = {}
    let isValid = true

    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key])
      if (error) {
        newErrors[key] = error
        isValid = false
      }
    })

    setErrors(newErrors)

    if (isValid) {
      localStorage.setItem("respuestas", JSON.stringify(form))
      navigate("/resultados")
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="container">
      <h2 className="title">Cuestionario Vocacional</h2>
      <p className="description">
        Para brindarte las mejores recomendaciones, por favor responde las siguientes preguntas con el mayor detalle posible.
      </p>

      <div className="form">
        {Object.entries(form).map(([key, value]) => (
          <div key={key} className="form-group">
            <label className="form-label">{FORM_FIELDS[key].label}:</label>
            <textarea
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={FORM_FIELDS[key].placeholder}
              className={`form-textarea ${errors[key] ? "error" : ""}`}
            />
            {errors[key] && <p className="error-message">{errors[key]}</p>}
          </div>
        ))}

        <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
          Ver recomendaciones
        </button>
      </div>
    </div>
  )
}

export default QuestionnairePage
