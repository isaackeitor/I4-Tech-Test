import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ClimateDataProvider, useClimateData } from './context/ClimateDataContext'

import './styles/global.css'

function NotificationToast({ message }) {
  if (!message) return null
  return (
    <div className="notification-toast">
      {message}
    </div>
  )
}

function AppContainer() {
  const { localNotification } = useClimateData()
  return (
    <>
      <App />
      <NotificationToast message={localNotification} />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClimateDataProvider>
      <AppContainer />
    </ClimateDataProvider>
  </React.StrictMode>
)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(() => {
    Notification.requestPermission()
  })
}