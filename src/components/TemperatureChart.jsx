// src/components/TemperatureChart.jsx
import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import { useClimateData } from '../context/ClimateDataContext'

const TemperatureChart = () => {
  const { climateData } = useClimateData()

  return (
    <div className="component-box">
      <h2 className="section-title">Temperaturas (°C)</h2>
      <div className="chart-container">
        <LineChart
          width={600}
          height={300}
          data={climateData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="TEMP_MINC"
            stroke="var(--color-fenceGreen)"
            name="Temp Mín"
          />
          <Line
            type="monotone"
            dataKey="TEMP_MAXC"
            stroke="var(--color-busyBee)"
            name="Temp Máx"
          />
          <Line
            type="monotone"
            dataKey="TEMPC"
            stroke="var(--color-springGreen)"
            name="Temp Actual"
          />
        </LineChart>
      </div>
    </div>
  )
}

export default TemperatureChart