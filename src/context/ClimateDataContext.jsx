// src/context/ClimateDataContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { fetchClimateData } from '../services/influx'

const ClimateDataContext = createContext()

export const useClimateData = () => useContext(ClimateDataContext)

export const ClimateDataProvider = ({ children }) => {
  const [climateData, setClimateData] = useState([])
  const [selectedLocation, setSelectedLocation] = useState('Guatemala City')
  const [localNotification, setLocalNotification] = useState('')
  const prevDataLength = useRef(0)

  useEffect(() => {
    const getData = async () => {
      const data = await fetchClimateData(selectedLocation)
      if (data.length > prevDataLength.current && prevDataLength.current !== 0) {
        if (Notification.permission === 'granted') {
          navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('Nueva medición', {
              body: 'Se recibió una nueva medición.'
            })
          })
        }
        setLocalNotification('Se recibió una nueva medición.')
        setTimeout(() => setLocalNotification(''), 3000)
      }
      prevDataLength.current = data.length
      setClimateData(data)
    }
    getData()

    const interval = setInterval(() => {
      getData()
    }, 15000)

    return () => clearInterval(interval)
  }, [selectedLocation])

  const value = {
    climateData,
    selectedLocation,
    setSelectedLocation,
    localNotification
  }

  return (
    <ClimateDataContext.Provider value={value}>
      {children}
    </ClimateDataContext.Provider>
  )
}