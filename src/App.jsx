import React from 'react'
import LocationSelector from './components/LocationSelector'
import WeatherSummary from './components/WeatherSummary'
import TemperatureChart from './components/TemperatureChart'
import HumidityPressureChart from './components/HumidityPressureChart'
import CloudsChart from './components/CloudsChart'
import WindIndicator from './components/WindIndicator'
import SunriseSunset from './components/SunriseSunset'
import { useClimateData } from './context/ClimateDataContext'

const App = () => {
  const { selectedLocation } = useClimateData()

  return (
    <div className="app-container">
      <h1 className="section-title">Dashboard Climático - {selectedLocation}</h1>
      
      <LocationSelector />
      <div className="top-bar">
        <WeatherSummary />
        <WindIndicator />
        <SunriseSunset />
      </div>
      <TemperatureChart />
      <HumidityPressureChart />
      <CloudsChart />
    </div>
  )
}

export default App