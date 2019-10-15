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
export function getClusterList (parameter) {
  return axios({
    url: '/clusters',
    method: 'get',
    data: parameter
  })
}

export function getClusterName (parameter) {
  return axios({
    url: '/clusters/name',
    method: 'get',
    data: parameter
  })
}

export function getClusterDetail (parameter) {
  return axios({
    url: `/cluster/detail/${parameter}`,
    method: 'get',
    data: parameter
  })
}

export function getClusterHosts (id, parameter) {
  return axios({
    url: `/cluster/hosts/${id}?cluster=${parameter}`,
    method: 'get',
    data: parameter
  })
}

export function getEnts (parameter) {
  return axios({
    url: '/ent',
    method: 'get',
    data: parameter
  })
}
