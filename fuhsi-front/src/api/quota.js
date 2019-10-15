import { axios } from '@/utils/request'

export default {
  QueryQuotaList (key) {
    let url = `/resourse/quota/list`
    if (key !== '') {
      url += `?key=${key}`
    }
    return axios({
      url: url,
      method: 'get'
    })
  },
  AddQuota (args) {
    return axios({
      url: '/resourse/quota/quotainfoadd',
      method: 'post',
      data: args
    })
  },
  ModifyQuota (args) {
    return axios({
      url: '/resourse/quota/quotainfomodify',
      method: 'post',
      data: args
    })
  },
  QueryQuotaInfo (quotaId) {
    const url = `/resourse/quota/detail/${quotaId}`
    return axios({
      url: url,
      method: 'get'
    })
  },
  DeleteQuotaInfo (quotaId) {
    const url = `/resourse/quota/quotadel/${quotaId}`
    return axios({
      url: url,
      method: 'get'
    })
  },
  DistributeQuota (args) {
    return axios({
      url: '/resourse/quota/distributequota',
      method: 'post',
      data: args
    })
  }
}
