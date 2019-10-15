
import { axios } from '@/utils/request'

export default {
  getCodeReps () {
    return axios({
      url: `/ci/codes`,
      method: 'get'
    })
  },
  getCodeRepInfo (clusterUrl, clusterType) {
    var param = {
      'GroupName': clusterType
    }
    return axios({
      url: '/registry/group/images/' + clusterUrl + '?GroupName=' + clusterType,
      method: 'get',
      data: param
    })
  }
}
