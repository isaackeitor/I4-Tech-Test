// src/components/LocationSelector.jsx
import React, { useEffect, useState } from 'react'
import { useClimateData } from '../context/ClimateDataContext'
import { fetchLocations } from '../services/influx'

const LocationSelector = () => {
  const { selectedLocation, setSelectedLocation } = useClimateData()
  const [locations, setLocations] = useState([])

  useEffect(() => {
    fetchLocations().then(data => {
      setLocations(data)
    })
  }, [])

  const handleChange = (e) => {
    setSelectedLocation(e.target.value)
  }

  return (
    <div className="component-box">
      <div className="form-group">
        <label htmlFor="location-select">Ubicación:</label>
        <select
          id="location-select"
          value={selectedLocation}
          onChange={handleChange}
        >
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default LocationSelector