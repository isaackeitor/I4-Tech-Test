// src/context/ClimateDataContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { fetchClimateData } from '../services/influx'

const ClimateDataContext = createContext()

export const useClimateData = () => useContext(ClimateDataContext)

export const ClimateDataProvider = ({ children }) => {
  const [climateData, setClimateData] = useState([])
  const [selectedLocation, setSelectedLocation] = useState('Guatemala City')

  useEffect(() => {
    const getData = async () => {
      const data = await fetchClimateData(selectedLocation)
      setClimateData(data)
    }
    getData()
  }, [selectedLocation])

  const value = {
    climateData,
    selectedLocation,
    setSelectedLocation
  }

  return (
    <ClimateDataContext.Provider value={value}>
      {children}
    </ClimateDataContext.Provider>
  )
}