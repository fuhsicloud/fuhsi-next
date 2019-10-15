import { axios } from '@/utils/request'

export default {
  QueryBaseGroupList () {
    const url = `/group/querygrouplist`
    return axios({
      url: url,
      method: 'get'
    })
  }
}
