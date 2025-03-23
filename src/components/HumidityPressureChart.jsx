// src/components/HumidityPressureChart.jsx
import React from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import { useClimateData } from '../context/ClimateDataContext'

const HumidityPressureChart = () => {
  const { climateData } = useClimateData()

  return (
    <div className="component-box">
      <h2 className="section-title">Humedad (%) y Presión (hPa)</h2>
      <div className="chart-container">
        <ComposedChart
          width={600}
          height={300}
          data={climateData}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="HUMIDITY"
            fill="var(--color-victoriaPeak)"
            name="Humedad"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="PRESSURE"
            stroke="#333"
            name="Presión"
          />
        </ComposedChart>
      </div>
    </div>
  )
}

export default HumidityPressureChart