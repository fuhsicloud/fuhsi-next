import { axios } from '@/utils/request'

export default {
  QueryServiceByName (serviceName, clusterName, appName) {
    return axios({
      url: `/service/name?AppName=${appName}&ClusterName=${clusterName}&ServiceName=${serviceName}`,
      method: 'get'
    })
  },
  addService (param) {
    return axios({
      url: '/service',
      method: 'post',
      data: param
    })
  },
  serviceOption (serviceId, replicas, start) {
    let url = `/service/scale/${serviceId}?replicas=${replicas}`
    if (start === 1) {
      url += `&start=${start}`
    }
    return axios({
      url: url,
      method: 'get'
    })
  },
  getWebttyInfo (id) {
    return axios({
      url: `/webtty/${id}`,
      method: 'get',
      data: id
    })
  },
  serviceUpdate (serviceId, args) {
    return axios({
      url: `/service/upgrade/${serviceId}`,
      method: 'post',
      data: args
    })
  }
}
