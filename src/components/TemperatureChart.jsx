// src/components/TemperatureChart.jsx
import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts'
import { useClimateData } from '../context/ClimateDataContext'

const TemperatureChart = () => {
  const { climateData } = useClimateData()

  return (
    <div className="component-box">
      <h2 className="section-title">Temperaturas (°C)</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={climateData} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Legend verticalAlign="top" height={36} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10 }}
              tickFormatter={(val) => new Date(val).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
              angle={-90}
              textAnchor="end"
            />
            <YAxis />
            <Tooltip
              labelFormatter={(val) =>
                new Date(val).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }
            />
            <Line
              type="monotone"
              dataKey="TEMP_MINC"
              stroke="var(--color-fenceGreen)"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Temp Mín"
            />
            <Line
              type="monotone"
              dataKey="TEMP_MAXC"
              stroke="var(--color-busyBee)"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Temp Máx"
            />
            <Line
              type="monotone"
              dataKey="TEMPC"
              stroke="var(--color-springGreen)"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Temp Actual"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TemperatureChart