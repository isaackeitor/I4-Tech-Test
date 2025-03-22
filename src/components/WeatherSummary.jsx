import React from 'react';

const WeatherSummary = ({ data, location }) => {
  // Skip if no data
  if (!data || data.length === 0) {
    return null;
  }

  // Get the latest readings for each key metric
  const getLatestMetrics = () => {
    const metrics = {};
    const fields = ['TEMPC', 'TEMP_MAXC', 'TEMP_MINC', 'HUMIDITY', 'PRESSURE', 'WINDSPEED', 'WEATHER'];
    
    // Group by field and get latest reading
    fields.forEach(field => {
      const fieldData = data
        .filter(d => d._field === field)
        .sort((a, b) => new Date(b._time) - new Date(a._time));
      
      if (fieldData.length > 0) {
        metrics[field] = {
          value: fieldData[0]._value,
          time: new Date(fieldData[0]._time)
        };
      }
    });
    
    return metrics;
  };

  const latestMetrics = getLatestMetrics();

  // Format for displaying
  const formatValue = (field, data) => {
    if (!data) return 'N/A';
    
    switch(field) {
      case 'TEMPC':
      case 'TEMP_MAXC':
      case 'TEMP_MINC':
        return `${parseFloat(data.value).toFixed(1)}°C`;
      case 'HUMIDITY':
        return `${parseFloat(data.value).toFixed(1)}%`;
      case 'PRESSURE':
        return `${parseFloat(data.value).toFixed(1)} hPa`;
      case 'WINDSPEED':
        return `${parseFloat(data.value).toFixed(1)} m/s`;
      default:
        return data.value;
    }
  };

  // Choose weather icon based on conditions
  const getWeatherIcon = (weather) => {
    if (!weather) return '🌥️';
    const condition = weather.value.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('lluvia')) return '🌧️';
    if (condition.includes('cloud') || condition.includes('nube')) return '☁️';
    if (condition.includes('clear') || condition.includes('despejado')) return '☀️';
    if (condition.includes('storm') || condition.includes('tormenta')) return '⛈️';
    if (condition.includes('snow') || condition.includes('nieve')) return '❄️';
    return '🌥️';
  };

  const locationTitle = location === 'all' ? 'Todas las ubicaciones' : location;

  return (
    <div style={{ 
      background: '#1e1e1e', 
      padding: '1.5rem', 
      borderRadius: '12px', 
      boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
      width: '100%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem' }}>
          Resumen del Clima: {locationTitle}
        </h2>
        <div style={{ fontSize: '2.5rem' }}>
          {getWeatherIcon(latestMetrics.WEATHER)}
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        width: '100%'
      }}>
        <MetricCard 
          title="Temperatura" 
          value={formatValue('TEMPC', latestMetrics.TEMPC)}
          icon="🌡️"
          detail={`Máx: ${formatValue('TEMP_MAXC', latestMetrics.TEMP_MAXC)} / Mín: ${formatValue('TEMP_MINC', latestMetrics.TEMP_MINC)}`}
        />
        
        <MetricCard 
          title="Humedad" 
          value={formatValue('HUMIDITY', latestMetrics.HUMIDITY)}
          icon="💧"
        />
        
        <MetricCard 
          title="Presión" 
          value={formatValue('PRESSURE', latestMetrics.PRESSURE)}
          icon="📊"
        />
        
        <MetricCard 
          title="Viento" 
          value={formatValue('WINDSPEED', latestMetrics.WINDSPEED)}
          icon="🌬️"
        />
      </div>

      {latestMetrics.TEMPC && (
        <div style={{ marginTop: '1rem', textAlign: 'right', fontSize: '0.9rem', color: '#aaa' }}>
          Última actualización: {latestMetrics.TEMPC.time.toLocaleString()}
        </div>
      )}
    </div>
  );
};

// Helper component for each metric card
const MetricCard = ({ title, value, icon, detail }) => (
  <div style={{ 
    background: '#2a2a2a', 
    padding: '1rem', 
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }}>
    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
    <h3 style={{ margin: '0 0 0.5rem 0', color: '#ccc' }}>{title}</h3>
    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</div>
    {detail && (
      <div style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '0.5rem' }}>{detail}</div>
    )}
  </div>
);

export default WeatherSummary;
