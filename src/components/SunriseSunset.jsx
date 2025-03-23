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

  return (
    <div className="component-box">
      <h2 className="section-title">Salida y Puesta del Sol</h2>
      <p><strong>Amanecer:</strong> {sunriseStr}</p>
      <p><strong>Anochecer:</strong> {sunsetStr}</p>
      <div className="day-progress-bar">
        <div
          className="day-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}

export default SunriseSunset