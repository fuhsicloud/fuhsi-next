import { axios } from '@/utils/oauthcenterrequest'

export default {
  QueryTenantClientList (tenantCode) {
    const url = `/v1/client/queryListByTenant?tenantCode=${tenantCode}`
    return axios({
      url: url,
      method: 'get'
    })
  },
  AddTenantClient (args) {
    return axios({
      url: '/v1/client/addClient',
      method: 'post',
      data: args
    })
  },
  ResetTenantClientSecrect (id) {
    const url = `/v1/client/resetClient?id=${id}`
    return axios({
      url: url,
      method: 'get'
    })
  },
  QueryTenantAccountList (clientId) {
    const url = `/v1/user/listByClient?clientId=${clientId}`
    return axios({
      url: url,
      method: 'get'
    })
  },
  AddTenantAccount (args) {
    return axios({
      url: '/v1/user/addUserByClient',
      method: 'post',
      data: args
    })
  }
}
