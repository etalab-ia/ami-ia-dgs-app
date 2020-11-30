import axios from 'axios'
import { baseURL } from '../config.js'

axios.defaults.baseURL = baseURL

const genAuth = x => {
  if (!(typeof x === 'object' && x !== null)) {
    return {}
  }
  const [username, password] = x
  return {
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
    }
  }
}

export const getLastResults = (last_results, format, x) => {
  let headers = {}
  if (format === "excel") {
    headers = {
      headers: {
        'Content-Disposition': "attachment filename=template.xlsx",
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ...(genAuth(x).headers)
      },
      responseType: 'arraybuffer',
    }
  } else {
    headers = genAuth(x)
  }
  return axios.post(
    '/dgs-api/predict/last_results/' + format,
    { 'last_results_keys': [...last_results] },
    headers
  )
}

export const getModelsPerformances = (x) => axios.get('/dgs-api/predict/performances', genAuth(x))
export const getDocuments = (id, x) => axios.get('/dgs-api/documents/' + id, genAuth(x))
export const getTopicModel = (x) => axios.get('/dgs-api/topics/model', genAuth(x))
export const getTopic = (id, x) => axios.get('/dgs-api/topics/' + id, genAuth(x))
export const getClustersModel = (x) => axios.get('/dgs-api/clusters/model', genAuth(x))
export const getClusters = (id, x) => axios.get('/dgs-api/clusters/' + id, genAuth(x))
