// src/components/CloudsChart.jsx
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import { useClimateData } from '../context/ClimateDataContext'

const CloudsChart = () => {
  const { climateData } = useClimateData()

  return (
    <div className="component-box">
      <h2 className="section-title">Nubosidad (%)</h2>
      <div className="chart-container">
        <BarChart
          width={600}
          height={300}
          data={climateData}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="CLOUDS" fill="var(--color-springGreen)" name="Nubosidad" />
        </BarChart>
      </div>
    </div>
  )
}

export default CloudsChart