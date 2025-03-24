// src/components/HumidityPressureChart.jsx
import React from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts'
import { useClimateData } from '../context/ClimateDataContext'

const HumidityPressureChart = () => {
  const { climateData } = useClimateData()

  return (
    <div className="component-box">
      <h2 className="section-title">Humedad (%) y Presión (hPa)</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={climateData} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Legend verticalAlign="top" height={36} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10 }}
              tickFormatter={(val) => new Date(val).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
              angle={-90}
              textAnchor="end"
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
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
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Presión"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default HumidityPressureChart