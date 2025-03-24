// src/components/CloudsChart.jsx
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts'
import { useClimateData } from '../context/ClimateDataContext'

const CloudsChart = () => {
  const { climateData } = useClimateData()

  return (
    <div className="component-box">
      <h2 className="section-title">Nubosidad (%)</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={climateData} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Legend verticalAlign="top" height={36} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10 }}
              tickFormatter={(val) => new Date(val).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
              tickLine={false}
              angle={-90}
              textAnchor="end"
            />
            <YAxis domain={[0, 'dataMax + 20']} />
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
            <Bar dataKey="CLOUDS" fill="var(--color-springGreen)" name="Nubosidad" barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CloudsChart