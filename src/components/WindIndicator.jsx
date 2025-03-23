// src/components/WindIndicator.jsx
import React from 'react'
import { useClimateData } from '../context/ClimateDataContext'
import '../styles/global.css'

const WindIndicator = () => {
  const { climateData } = useClimateData()
  const latest = climateData[climateData.length - 1]
  if (!latest) return null

  const direction = latest.WINDDIRECTION
  const speed = latest.WINDSPEED

  return (
    <div className="component-box">
      <h2 className="section-title">Viento</h2>
      <div className="wind-indicator-container">
        <div className="wind-arrow" style={{ transform: `rotate(${direction}deg)` }} />
        <div className="wind-info">
          <p><strong>Dirección:</strong> {direction}°</p>
          <p><strong>Velocidad:</strong> {speed} m/s</p>
        </div>
      </div>
    </div>
  )
}

export default WindIndicator