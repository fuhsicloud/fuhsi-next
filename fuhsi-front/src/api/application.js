// import api from './index'
import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function getAppList (parameter) {
  return axios({
    url: '/apps',
    method: 'get',
    data: parameter
  })
}

// export function getClusterName (parameter) {
//   return axios({
//     url: '/clusters/name',
//     method: 'get',
//     data: parameter
//   })
// }

export function getAppDetail (parameter) {
  return axios({
    url: `/app/detail/${parameter}`,
    method: 'get',
    data: parameter
  })
}

export function getAppServices (appName, clusterName) {
  return axios({
    url: `/services?AppName=${appName}&ClusterName=${clusterName}`,
    method: 'get'
    // data:
  })
}

export function getServiceDetail (parameter) {
  return axios({
    url: `/service/detail/${parameter}`,
    method: 'get',
    data: parameter
  })
}

export function getAppContainers (appName, entName, serviceName) {
  return axios({
    url: `/containers?AppName=${appName}&Entname=${entName}&ServiceName=${serviceName}`,
    method: 'get'
    // data:
  })
}

export function getResourceName (username) {
  return axios({
    url: `/app/queryResource?username=${username}`,
    method: 'get'
  })
}

// export function getClusterHosts (id, parameter) {
//   return axios({
//     url: `/cluster/hosts/${id}?cluster=${parameter}`,
//     method: 'get',
//     data: parameter
//   })
// }

// export function getEnts (parameter) {
//   return axios({
//     url: '/ent',
//     method: 'get',
//     data: parameter
//   })
// }
