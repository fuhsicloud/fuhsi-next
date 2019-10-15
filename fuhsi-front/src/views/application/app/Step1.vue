<template>
  <div>
    <a-form style="margin: 40px auto 0;">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item
            label="环境选择"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 16}">
            <a-select
              v-decorator="['env', {
                rules: [{ required: true, message: '请选择所属环境' }]
              }]"
              placeholder="请选择所属环境"
              :defaultValue="selectEnt"
              @change="handleEntChange"
              v-model="selectEnt"
            >
              <a-select-option v-for="item in ents" :key="item.Entname" :value="item.Entname">{{ item.Entname }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="所属集群"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 16}">
            <a-select
              v-decorator="['cluster', {
                rules: [{ required: true, message: '请选择部署群集' }]
              }]"
              placeholder="请选择群集类型"
              @click="handleClusterChange"
              v-model="selectedcluster"
            >
              <a-select-option v-for="item in clusters" :key="item" :value="item">{{ item }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-alert
        :closable="false"
        :message="'已选择镜像'+chooseCloudImage+' 该镜像可选版本有'+chooseCloudImageCount+'   个'"
        style="margin-bottom: 24px;"
        v-if="chooseCloudImageId!==''"
      />
      <a-form-item>
        <a-card
          :bordered="false">

          <!-- <div slot="extra">
            <a-input-search style="margin-left: 16px; width: 272px;" v-model="cloudimgname" />
          </div> -->

          <a-table :columns="columns" :dataSource="data" :loading="tableLoading" :rowKey="record => record.ImageId">
            <span slot="action" slot-scope="text, record">
              <a href="javascript:;" v-if="record.ImageId!==chooseCloudImageId" @click="useCloudImagesHandler(record)">使用该镜像部署</a>
              <a href="javascript:;" v-else style="color:rgb(255, 169, 28)">使用该镜像部署</a>
            </span>
            <template slot="Cloudimgname" slot-scope="text, record">
              {{ record.ServerDomain }}/{{ record.Name }}
            </template>
          </a-table>

        </a-card>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 24, offset: 18}">
        <a-button type="primary" @click="nextStep" v-if="chooseCloudImageId!=''">下一步</a-button>
        <a-button type="primary" disabled v-else>下一步</a-button>
      </a-form-item>
    </a-form>

  </div>
</template>

<script>
import { getEnts } from '@/api/cluster'
import registryFetch from '@/api/registry'
import { getGUID } from '@/utils/util'

export default {
  name: 'Step1',
  props: {
    preDataInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      ents: [],
      clustersData: {},
      clusters: [],
      selectEnt: '',
      selectedcluster: '',
      data: [],
      cloudimgname: '',
      // 选择镜像
      chooseCloudImageId: '',
      chooseCloudImage: '',
      chooseCloudImageCount: 0,
      columns: [{
        title: '集群',
        dataIndex: 'ClusterName',
        width: '20%'
      }, {
        title: '镜像',
        dataIndex: 'Cloudimgname',
        width: '60%',
        scopedSlots: { customRender: 'Cloudimgname' }
      }, {
        title: '操作',
        key: 'action',
        width: '20%',
        scopedSlots: { customRender: 'action' }
      }],
      tableLoading: false,
      // 镜像内容 暴露给父组件
      imageDataInfo: {},

      routeAppName: '',
      routeClusterName: '',
      routeEntname: ''
    }
  },
  created () {
    var self = this
    if (self.$route.params.appName) {
      self.routeAppName = self.$route.params.appName
    }
    if (self.$route.params.clusterName) {
      self.routeClusterName = self.$route.params.clusterName
    }
    if (self.$route.params.entname) {
      self.routeEntname = self.$route.params.entname
    }
    if (self.preDataInfo.step1 !== null && self.preDataInfo.step1 !== undefined && JSON.stringify(self.preDataInfo.step1) !== '{}') {
      self.routeEntname = self.preDataInfo.step1.selectEnt
      self.routeClusterName = self.preDataInfo.step1.selectedcluster
    }
    self.getEnts()
  },
  methods: {
    nextStep () {
      var self = this
      var outputObjJson = self.preDataInfo
      self.imageDataInfo['selectEnt'] = self.selectEnt
      self.imageDataInfo['selectedcluster'] = self.selectedcluster
      self.imageDataInfo['routeAppName'] = self.routeAppName
      outputObjJson['step1'] = self.imageDataInfo
      self.$emit('nextStep', outputObjJson)
    },
    getEnts () {
      var that = this
      getEnts()
        .then(res => {
          var info = res.result.data
          info.forEach((item) => {
            that.clustersData[item.Entname] = item.Clusters.split(',')
          })
          that.ents = info
          that.selectEnt = info.Entname
          if (that.routeEntname !== '') {
            that.selectEnt = that.routeEntname
            that.handleEntChange(that.selectEnt)
          }
          if (that.routeClusterName !== '') {
            that.selectedcluster = that.routeClusterName
          }
        })
    },
    handleEntChange (value) {
      this.getImages()
      if (this.clustersData[value] !== '') {
        this.clusters = this.clustersData[value]
      } else {
        this.clusters = []
      }
      this.selectedcluster = this.clustersData[value][0]
    },
    handleClusterChange () {
      var self = this
      self.getImages()
    },
    getImages () {
      var self = this
      self.tableLoading = true
      registryFetch.getDeployImages(self.selectEnt, self.selectEnt, self.cloudimgname)
        .then(res => {
          self.tableLoading = false
          var result = res.result
          self.data = []
          result.forEach(item => {
            self.data.push(item)
          })
        })
    },
    useCloudImagesHandler (item) {
      var self = this
      self.chooseCloudImageId = item.ImageId
      self.chooseCloudImage = item.ServerDomain + '/' + item.Name
      var tempTags = item.Tags
      if (tempTags === '') {
        self.chooseCloudImageCount = 0
      } else {
        var tagsArra = tempTags.split(',')
        self.chooseCloudImageCount = tagsArra.length
      }
      self.getImageInfo(item.Name)
    },
    getImageInfo (clusterUrl) {
      var self = this
      var clusterType = 'test'
      clusterType = clusterUrl.substring(0, clusterUrl.indexOf('/'))
      registryFetch.getImageInfo(clusterUrl, clusterType)
        .then(res => {
          var result = res.result
          self.imageDataInfo = result
          console.log(self.imageDataInfo)
        })
    },
    getRowKey () {
      return getGUID()
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-avatar-lg {
      width: 48px;
      height: 48px;
      line-height: 48px;
  }

  .list-content-item {
      color: rgba(0, 0, 0, .45);
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
      margin-left: 10px;
      span {
          line-height: 20px;
      }
      p {
          margin-top: 4px;
          margin-bottom: 0;
          line-height: 22px;
      }
  }
</style>
