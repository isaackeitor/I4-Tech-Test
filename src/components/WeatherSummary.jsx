// src/components/WeatherSummary.jsx
import React from 'react'
import { useClimateData } from '../context/ClimateDataContext'

const WeatherSummary = () => {
  const { climateData } = useClimateData()
  const latest = climateData[climateData.length - 1]

  if (!latest) return <div className="component-box">Cargando clima...</div>

  return (
    <div className="component-box">
      <h2 className="section-title">Estado Actual del Clima</h2>
      <p><strong>Weather:</strong> {latest.WEATHER}</p>
      <p><strong>Detalle:</strong> {latest.DETAIL}</p>
      <img
        src={`https://openweathermap.org/img/wn/${latest.ICON}@2x.png`}
        alt="icono del clima"
      />
    </div>
  )
}

export default WeatherSummary