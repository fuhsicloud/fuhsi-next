
import { axios } from '@/utils/request'

export default {
  getDeployImages (envType, clusterType, cloudimgname) {
    return axios({
      url: `/registry/deploy/images?envType=${envType}&clusterType=${clusterType}&cloudimgname=${cloudimgname}`,
      method: 'get'
    })
  },
  getImageInfo (clusterUrl, clusterType) {
    var param = {
      'GroupName': clusterType
    }
    return axios({
      url: '/registry/group/images/' + clusterUrl + '?GroupName=' + clusterType,
      method: 'get',
      data: param
    })
  },
  getRegistryServer (keywords) {
    let url = `/registry/server`
    if (keywords !== '') {
      url += `?ClusterName=${keywords}`
    }
    return axios({
      url: url,
      method: 'get'
    })
  },
  getRegistryGroupList (pageNo, pageSize) {
    const url = `/registry/group?pageNo=${pageNo}&pageSize=${pageSize}`
    return axios({
      url: url,
      method: 'get'
    })
  },
  getHarborRegistryList (pageNo, pageSize, groupName, clusterName) {
    const url = `/registry/group/images?pageNo=${pageNo}&pageSize=${pageSize}&GroupName=${groupName}&ClusterName=${clusterName}`
    return axios({
      url: url,
      method: 'get'
    })
  }
}
