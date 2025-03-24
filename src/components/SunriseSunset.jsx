// src/components/SunriseSunset.jsx
import React from 'react'
import { useClimateData } from '../context/ClimateDataContext'

const SunriseSunset = () => {
  const { climateData } = useClimateData()
  const latest = climateData[climateData.length - 1]
  if (!latest) return null

  const sunriseTs = parseInt(latest.SUNRISE, 10) * 1000
  const sunsetTs = parseInt(latest.SUNSET, 10) * 1000
  const sunriseDate = new Date(sunriseTs)
  const sunsetDate = new Date(sunsetTs)

  const sunriseStr = sunriseDate.toLocaleTimeString('es-ES', { hour12: false })
  const sunsetStr = sunsetDate.toLocaleTimeString('es-ES', { hour12: false })

  const now = Date.now()
  const totalDay = sunsetTs - sunriseTs
  const elapsed = now - sunriseTs
  const progressPercent = Math.max(0, Math.min(100, (elapsed / totalDay) * 100))

  const isDay = now >= sunriseTs && now <= sunsetTs
  const dayNightLabel = isDay ? 'Día' : 'Noche'
  const progress = Math.floor(progressPercent)

  return (
    <div className="component-box sunrise-sunset-container">
      <h2 className="section-title">Salida y Puesta del Sol</h2>
      {/* Información de texto */}
      <div className="sunset-info">
        <p><strong>Amanecer:</strong> {sunriseStr}</p>
        <p><strong>Anochecer:</strong> {sunsetStr}</p>
      </div>

      {/* Anillo de progreso */}
      <div className="day-progress-circle">
        <svg viewBox="0 0 36 36">
          {/* Círculo de fondo */}
          <circle className="progress-bg" cx="18" cy="18" r="16" />
          {/* Círculo activo */}
          <circle
            className="progress-ring"
            cx="18"
            cy="18"
            r="16"
            strokeDasharray="100"
            strokeDashoffset={100 - progress}
            transform="rotate(-90 18 18)"
          />
          {/* Texto en el centro */}
          <text x="18" y="15" className="progress-text" textAnchor="middle">
            {progress}%
          </text>
          <text x="18" y="25" className="progress-text" textAnchor="middle">
            {dayNightLabel}
          </text>
        </svg>
      </div>
    </div>
  )
}

export default SunriseSunset