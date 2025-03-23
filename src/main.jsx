import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ClimateDataProvider } from './context/ClimateDataContext'

import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClimateDataProvider>
      <App />
    </ClimateDataProvider>
  </React.StrictMode>
)