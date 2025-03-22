import { InfluxDB } from '@influxdata/influxdb-client'

const url = import.meta.env.VITE_INFLUX_URL
const token = import.meta.env.VITE_INFLUX_TOKEN
const org = import.meta.env.VITE_INFLUX_ORG
const bucket = import.meta.env.VITE_INFLUX_BUCKET

const influxDB = new InfluxDB({ url, token })
const queryClient = influxDB.getQueryApi(org)

export const fetchWeatherData = async () => {
  const query = `
    from(bucket: "${bucket}")
      |> range(start: -7d)
      |> filter(fn: (r) => r._measurement == "CLIMA_GT")
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