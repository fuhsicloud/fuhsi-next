import { axios } from '@/utils/request'

export default {
  QueryBaseUserList () {
    const url = `/user/getuserlist`
    return axios({
      url: url,
      method: 'get'
    })
  }
}
