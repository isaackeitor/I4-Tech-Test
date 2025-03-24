import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { fetchClimateData } from '../services/influx'

const ClimateDataContext = createContext()

export const useClimateData = () => useContext(ClimateDataContext)

export const ClimateDataProvider = ({ children }) => {
  const [climateData, setClimateData] = useState([])
  const [selectedLocation, setSelectedLocation] = useState('Guatemala City')
  const [localNotifications, setLocalNotifications] = useState([])
  const prevDataRef = useRef([])
  const prevMeasurementRef = useRef(null)
  const lastTimeRef = useRef(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const fieldLabels = {
      TEMPC: 'Temperatura actual',
      TEMP_MINC: 'Temperatura mínima',
      TEMP_MAXC: 'Temperatura máxima',
      WINDDIRECTION: 'Dirección del viento',
      WINDSPEED: 'Velocidad del viento',
      WEATHER: 'Condición climática',
      DETAIL: 'Detalle',
      HUMIDITY: 'Humedad',
      PRESSURE: 'Presión',
      CLOUDS: 'Nubosidad'
    }

    const formatValue = (field, value) => {
      if (field === 'TEMPC' || field === 'TEMP_MINC' || field === 'TEMP_MAXC') return `${value}°C`;
      if (field === 'WINDDIRECTION') return `${value}°`;
      if (field === 'WINDSPEED') return `${value} m/s`;
      if (field === 'HUMIDITY' || field === 'CLOUDS') return `${value}%`;
      if (field === 'PRESSURE') return `${value} hPa`;
      return value;
    }

    // Cuando cambiamos de ubicación, marcamos como primera carga
    isFirstLoad.current = true;

    const getData = async () => {
      const data = await fetchClimateData(selectedLocation)
      const newLastMeasurement = data.length ? data[data.length - 1] : null
      
      // Si es la primera carga para esta ubicación, solo almacenamos el valor
      // pero no mostramos notificaciones
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        lastTimeRef.current = newLastMeasurement?.time || null;
        prevMeasurementRef.current = newLastMeasurement;
        setClimateData(data);
        return;
      }
      
      // Detectar si realmente hay una nueva medición con un nuevo timestamp
      if (newLastMeasurement && 
          (lastTimeRef.current === null || 
           newLastMeasurement.time !== lastTimeRef.current)) {
        
        // Nueva medición detectada
        lastTimeRef.current = newLastMeasurement.time;
        
        if (prevMeasurementRef.current) {
          const fieldsToCheck = Object.keys(fieldLabels)
          const changedFields = fieldsToCheck.filter(
            field => newLastMeasurement[field] !== prevMeasurementRef.current[field]
          )
          
          const newNotifications = changedFields.map(field => {
            const label = fieldLabels[field]
            const newValue = formatValue(field, newLastMeasurement[field])
            
            if (Notification.permission === 'granted') {
              navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(label, {
                  body: `Nuevo valor: ${newValue}`
                })
              })
            }
            
            return {
              id: `${field}-${Date.now()}`,
              message: `${label}: ${newValue}`
            }
          })
          
          if (newNotifications.length > 0) {
            setLocalNotifications(newNotifications)
            console.log('Nuevas notificaciones:', newNotifications);
          }
        }
      }
      
      prevMeasurementRef.current = newLastMeasurement
      setClimateData(data)
    }
    getData()

    const interval = setInterval(() => {
      getData()
    }, 10000)

    return () => clearInterval(interval)
  }, [selectedLocation])

  const value = {
    climateData,
    selectedLocation,
    setSelectedLocation,
    localNotifications
  }

  return (
    <ClimateDataContext.Provider value={value}>
      {children}
    </ClimateDataContext.Provider>
  )
}