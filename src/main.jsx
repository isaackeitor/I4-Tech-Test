import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ClimateDataProvider, useClimateData } from './context/ClimateDataContext'
import { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './styles/global.css'

function AppContainer() {
  const { localNotifications } = useClimateData()

  useEffect(() => {
    if (localNotifications && localNotifications.length > 0) {
      localNotifications.forEach(notification => {
        toast(notification.message, {
          toastId: notification.id,
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          type: "info"
        })
      })
    }
  }, [localNotifications])

  return (
    <>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
      />
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