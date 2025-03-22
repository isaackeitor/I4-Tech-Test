import React from 'react';

const WeatherDetails = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Extract unique locations from the data
  const locations = [...new Set(data
    .filter(item => item.LOCATION)
    .map(item => item.LOCATION)
  )];

  // Group the latest data by location
  const groupedData = locations.map(location => {
    const locationData = data.filter(d => d.LOCATION === location);
    
    // Get latest values for each field
    const fields = {};
    ['WEATHER', 'DETAIL', 'SUNRISE', 'SUNSET', 'WINDDIRECTION', 'CLOUDS'].forEach(field => {
      const fieldData = locationData
        .filter(d => d._field === field)
        .sort((a, b) => new Date(b._time) - new Date(a._time));
      
      if (fieldData.length > 0) {
        fields[field] = fieldData[0]._value;
      }
    });

    return {
      location,
      ...fields,
      time: locationData.length > 0 ? 
        new Date(locationData.sort((a, b) => new Date(b._time) - new Date(a._time))[0]._time) : null
    };
  });

  return (
    <div style={{ 
      background: '#1e1e1e', 
      padding: '1.5rem', 
      borderRadius: '12px', 
      boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
      width: '100%'
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.8rem' }}>
        ℹ️ Detalles del Clima
      </h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem',
        width: '100%'
      }}>
        {groupedData.map((locationData, index) => (
          <div key={index} style={{ 
            background: '#2a2a2a', 
            padding: '1.5rem', 
            borderRadius: '8px' 
          }}>
            <h3 style={{ 
              margin: '0 0 1rem 0', 
              fontSize: '1.4rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>📍 {locationData.location}</span>
              {getWeatherIcon(locationData.WEATHER)}
            </h3>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {locationData.WEATHER && (
                  <tr>
                    <td style={cellStyle}>Condición:</td>
                    <td style={valueCellStyle}>{locationData.WEATHER}</td>
                  </tr>
                )}
                {locationData.DETAIL && (
                  <tr>
                    <td style={cellStyle}>Detalles:</td>
                    <td style={valueCellStyle}>{locationData.DETAIL}</td>
                  </tr>
                )}
                {locationData.SUNRISE && (
                  <tr>
                    <td style={cellStyle}>Amanecer:</td>
                    <td style={valueCellStyle}>{formatTime(locationData.SUNRISE)}</td>
                  </tr>
                )}
                {locationData.SUNSET && (
                  <tr>
                    <td style={cellStyle}>Atardecer:</td>
                    <td style={valueCellStyle}>{formatTime(locationData.SUNSET)}</td>
                  </tr>
                )}
                {locationData.WINDDIRECTION && (
                  <tr>
                    <td style={cellStyle}>Dirección del viento:</td>
                    <td style={valueCellStyle}>{locationData.WINDDIRECTION}</td>
                  </tr>
                )}
                {locationData.CLOUDS && (
                  <tr>
                    <td style={cellStyle}>Nubosidad:</td>
                    <td style={valueCellStyle}>{locationData.CLOUDS}%</td>
                  </tr>
                )}
              </tbody>
            </table>

            {locationData.time && (
              <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#aaa', textAlign: 'right' }}>
                Actualizado: {locationData.time.toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper styles and functions
const cellStyle = {
  padding: '0.5rem 0',
  color: '#ccc',
  borderBottom: '1px solid #444',
  textAlign: 'left'
};

const valueCellStyle = {
  ...cellStyle,
  color: '#fff',
  fontWeight: '500',
  textAlign: 'right'
};

const formatTime = (timeStr) => {
  try {
    // Handle different time formats
    if (timeStr.includes(':')) {
      return timeStr;  // Already formatted
    }
    const time = new Date(parseInt(timeStr) * 1000);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return timeStr;  // Return as-is if parsing fails
  }
};

// Choose weather icon based on conditions
const getWeatherIcon = (weather) => {
  if (!weather) return '🌥️';
  const condition = weather.toLowerCase();
  
  if (condition.includes('rain') || condition.includes('lluvia')) return '🌧️';
  if (condition.includes('cloud') || condition.includes('nube')) return '☁️';
  if (condition.includes('clear') || condition.includes('despejado')) return '☀️';
  if (condition.includes('storm') || condition.includes('tormenta')) return '⛈️';
  if (condition.includes('snow') || condition.includes('nieve')) return '❄️';
  return '🌥️';
};

export default WeatherDetails;
