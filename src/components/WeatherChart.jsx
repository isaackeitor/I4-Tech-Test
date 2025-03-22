import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function WeatherChart({ data }) {
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  
  // Available metrics to display
  const metrics = {
    temperature: ['TEMPC', 'TEMP_MAXC', 'TEMP_MINC'],
    humidity: ['HUMIDITY'],
    pressure: ['PRESSURE'],
    wind: ['WINDSPEED']
  };

  // Colors for each field
  const colors = {
    TEMPC: '#ff7300',
    TEMP_MAXC: '#ff0000',
    TEMP_MINC: '#0088ff',
    HUMIDITY: '#00ff73',
    PRESSURE: '#8884d8',
    WINDSPEED: '#82ca9d'
  };

  // Names for each field
  const fieldNames = {
    TEMPC: 'Temperatura Actual (°C)',
    TEMP_MAXC: 'Temperatura Máxima (°C)',
    TEMP_MINC: 'Temperatura Mínima (°C)',
    HUMIDITY: 'Humedad (%)',
    PRESSURE: 'Presión Atmosférica (hPa)',
    WINDSPEED: 'Velocidad del Viento (m/s)'
  };

  // Filter and prepare data for the selected metrics
  const prepareChartData = () => {
    const selectedFields = metrics[selectedMetric];
    
    // Filter data for selected fields
    const filteredData = data.filter(d => selectedFields.includes(d._field));
    
    // Group data by time
    return filteredData
      .map(d => ({
        time: new Date(d._time).toLocaleString('es-ES', { hour12: false }),
        location: d.LOCATION || 'Unknown',
        field: d._field,
        value: parseFloat(d._value)
      }))
      // Combine by time and location
      .reduce((acc, curr) => {
        const timeKey = `${curr.time}-${curr.location}`;
        const existing = acc.find(item => 
          item.time === curr.time && item.location === curr.location
        );
        
        if (existing) {
          existing[curr.field] = curr.value;
        } else {
          const newEntry = { 
            time: curr.time, 
            location: curr.location
          };
          selectedFields.forEach(field => {
            newEntry[field] = field === curr.field ? curr.value : null;
          });
          acc.push(newEntry);
        }
        return acc;
      }, [])
      // Sort by time
      .sort((a, b) => new Date(a.time) - new Date(b.time));
  };

  const chartData = prepareChartData();
  const activeFields = metrics[selectedMetric];
  
  // Get title based on selected metric
  const getChartTitle = () => {
    switch(selectedMetric) {
      case 'temperature': return '🌡️ Temperatura';
      case 'humidity': return '💧 Humedad';
      case 'pressure': return '📊 Presión Atmosférica';
      case 'wind': return '🌬️ Velocidad del Viento';
      default: return '';
    }
  };

  return (
    <div style={{ 
      background: '#1e1e1e', 
      padding: '1.5rem', 
      borderRadius: '10px', 
      boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
      width: '100%'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem' 
      }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem' }}>
          {getChartTitle()}
        </h2>
        
        <div>
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '6px',
              backgroundColor: '#333',
              color: '#fff',
              border: '1px solid #444',
              fontSize: '0.9rem'
            }}
          >
            <option value="temperature">Temperatura</option>
            <option value="humidity">Humedad</option>
            <option value="pressure">Presión</option>
            <option value="wind">Viento</option>
          </select>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
          <defs>
            {activeFields.map(field => (
              <linearGradient key={field} id={`${field}Gradient`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[field]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors[field]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 10, fill: '#ddd' }}
            tickFormatter={(value) => {
              // Show shorter time format
              try {
                const date = new Date(value);
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              } catch (e) {
                return value;
              }
            }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fill: '#ddd' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#222', borderRadius: '5px', color: '#fff' }}
            formatter={(value, name) => [value, fieldNames[name]]}
            labelFormatter={(label) => `Hora: ${label}`}
          />
          <Legend 
            wrapperStyle={{ color: '#fff' }} 
            formatter={(value) => fieldNames[value]}
          />

          {activeFields.map(field => (
            <Line
              key={field}
              type="monotone"
              dataKey={field}
              stroke={`url(#${field}Gradient)`}
              strokeWidth={2}
              dot={{ r: 4, fill: colors[field] }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              connectNulls={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      {chartData.length === 0 && (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          color: '#aaa'
        }}>
          No hay datos disponibles para mostrar
        </div>
      )}
    </div>
  );
}