import { InfluxDB } from '@influxdata/influxdb-client'

const url = import.meta.env.VITE_INFLUX_URL
const token = import.meta.env.VITE_INFLUX_TOKEN
const org = import.meta.env.VITE_INFLUX_ORG
const bucket = import.meta.env.VITE_INFLUX_BUCKET

const influxDB = new InfluxDB({ url, token })
const queryClient = influxDB.getQueryApi(org)

export const fetchClimateData = async (location) => {
  const query = `
    from(bucket: "${bucket}")
      |> range(start: -7d)
      |> filter(fn: (r) => r._measurement == "CLIMA_GT")
      |> filter(fn: (r) => r.LOCATION == "${location}")
  `
  const data = []
  return new Promise((resolve, reject) => {
    queryClient.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row)
        data.push(o)
      },
      error(error) {
        reject(error)
      },
      complete() {
        resolve(data)
      }
    })
  }).then(rawData => {
    const numericFields = [
      'TEMPC','TEMP_MINC','TEMP_MAXC','WINDDIRECTION','WINDSPEED','HUMIDITY','PRESSURE','CLOUDS'
    ]
    const dataMap = {}
    rawData.forEach(row => {
      if (numericFields.includes(row._field)) {
        row._value = parseFloat(row._value || '0')
      }
      const t = row._time
      if (!dataMap[t]) {
        dataMap[t] = { time: t }
      }
      dataMap[t][row._field] = row._value
    })
    const finalData = Object.values(dataMap).sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    )
    return finalData
  })
}

export const fetchLocations = async () => {
  const query = `
    import "influxdata/influxdb/schema"
    
    schema.tagValues(
      bucket: "${bucket}",
      tag: "LOCATION",
      predicate: (r) => r._measurement == "CLIMA_GT",
      start: -30d
    )
  `

  return new Promise((resolve, reject) => {
    const locations = []
    
    queryClient.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row)
        if (o._value) {
          locations.push(o._value)
        }
      },
      error(error) {
        console.error('Error fetching locations:', error)
        resolve([])
      },
      complete() {
        resolve(locations)
      }
    })
  })
}