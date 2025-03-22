import { useEffect, useState } from 'react'
import { fetchWeatherData, fetchLocations } from './services/influx'
import WeatherChart from './components/WeatherChart'
import WeatherSummary from './components/WeatherSummary'
import WeatherDetails from './components/WeatherDetails'

function App() {
  const [data, setData] = useState([])
  const [locations, setLocations] = useState([])
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch available locations
    fetchLocations()
      .then(locs => {
        setLocations(locs);
        if (locs.length > 0) {
          setSelectedLocation(locs[0]);
        }
      })
      .catch(err => {
        console.error('Error fetching locations:', err);
        setError('No se pudieron cargar las ubicaciones disponibles');
      });
    
    // Fetch weather data
    fetchWeatherData()
      .then((res) => {
        setData(res)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error al obtener datos:', err)
        setError('Error al cargar datos del clima. Por favor, intente más tarde.')
        setLoading(false)
      })
  }, [])

  // Filter data by selected location
  const filteredData = selectedLocation === 'all' 
    ? data 
    : data.filter(item => item.LOCATION === selectedLocation);

  return (
    <div style={{ 
      backgroundColor: '#121212', 
      minHeight: '100vh',
      color: '#fff',
      width: '100%',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{
        padding: '1.5rem 2rem',
        borderBottom: '1px solid #333'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '2.5rem', 
          margin: 0
        }}>
          📊 Dashboard del Clima en Guatemala
        </h1>
      </header>
      
      <main style={{ 
        flex: 1,
        padding: '2rem',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        {error && (
          <div style={{ 
            backgroundColor: '#ff5555', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        {loading ? (
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem',
            height: '50vh'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Cargando datos...</div>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%',
              border: '5px solid #333', 
              borderTop: '5px solid #4f46e5',
              animation: 'spin 1s linear infinite' 
            }}></div>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <>
            <div style={{ 
              marginBottom: '2rem', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '1rem' 
            }}>
              <label htmlFor="location-select" style={{ fontSize: '1.1rem' }}>Ubicación:</label>
              <select 
                id="location-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '6px',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '1px solid #444',
                  fontSize: '1rem'
                }}
              >
                <option value="all">Todas las ubicaciones</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div style={{ 
              display: 'grid', 
              gridGap: '2rem',
              width: '100%'
            }}>
              <WeatherSummary data={filteredData} location={selectedLocation} />
              <WeatherChart data={filteredData} />
              <WeatherDetails data={filteredData} />
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App