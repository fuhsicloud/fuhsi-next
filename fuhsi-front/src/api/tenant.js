import { axios } from '@/utils/request'

export default {
  QueryTenantList (args) {
    let url = `/auth/tenant/list?pageNo=${args.pageNo}&pageSize=${args.pageSize}`
    if (args.Status) {
      url += `&Status=${args.Status}`
    }
    return axios({
      url: url,
      method: 'get'
    })
  },
  AllTenantList () {
    const url = `/auth/tenant/alllist`
    return axios({
      url: url,
      method: 'get'
    })
  },
  AddTenant (args) {
    return axios({
      url: '/auth/tenant/newtenant',
      method: 'post',
      data: args
    })
  },
  QueryTenantInfo (tenantId) {
    return axios({
      url: `/auth/tenant/detail/${tenantId}`,
      method: 'get'
    })
  },
  TenantReview (tenantId, status) {
    const params = {
      TenantId: tenantId,
      Status: status
    }
    return axios({
      url: '/auth/tenant/tenantreview',
      method: 'post',
      data: params
    })
  },
  ModifyTenant (args) {
    return axios({
      url: '/auth/tenant/modifytenant',
      method: 'post',
      data: args
    })
  }
}
