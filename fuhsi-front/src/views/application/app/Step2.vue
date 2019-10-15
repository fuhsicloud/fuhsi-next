<template>
  <div>
    <a-form style="margin: 40px auto 0;">
      <a-form-item
        label="应用名称"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input v-model="appName" @blur="checkName" v-if="addServiceOnly" disabled />
        <a-input v-model="appName" @blur="checkName" v-else />
      </a-form-item>
      <a-form-item
        label="服务名称"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input v-model="serviceName"/>
      </a-form-item>
      <a-form-item
        label="资源空间"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-select v-model="resourceName">
          <a-select-option :value="item" v-for="item in resourceNameArra" :key="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="镜像名称"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input v-model="imageName" disabled />
      </a-form-item>
      <a-form-item
        label="版本号"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-select v-model="imageTag">
          <a-select-option v-for="item in imageTagArra" :key="item" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="部署类型"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-radio-group buttonStyle="solid" v-model="deployType">
          <a-radio-button value="Deployment">Deployment</a-radio-button>
          <a-radio-button value="DaemonSet">DaemonSet</a-radio-button>
          <a-radio-button value="StatefulSet">StatefulSet</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="实例配置"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-radio-group v-model="instanceConfig" buttonStyle="solid">
          <a-radio-button :value="item.id" v-for="item in instanceConfigArra" :key="item.id">{{ item.title }}-{{ item.cpu }}Core/{{ item.mem }}G</a-radio-button>
        </a-radio-group>
        <a-row v-if="instanceConfig==='g'">
          <a-col :span="3">CPU使用量:</a-col>
          <a-col :span="5"><a-input v-model="chooseCpu" /></a-col>
          <a-col :span="2" style="padding-left:1%">核</a-col>
        </a-row>
        <a-row v-if="instanceConfig==='g'">
          <a-col :span="3">服务内存使用量:</a-col>
          <a-col :span="5"><a-input v-model="chooseMem" /></a-col>
          <a-col :span="2" style="padding-left:1%">M</a-col>
        </a-row>
      </a-form-item>

      <a-form-item
        label="服务标签"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-row>
          <a-col :span="6">键</a-col>
          <a-col :span="6" style="padding-left:1%">值</a-col>
          <a-col :span="6" style="padding-left:1%">Kubernetes</a-col>
          <a-col :span="5" style="padding-left:1%">操作</a-col>
        </a-row>
        <a-row>
          <a-col :span="6"><a-input v-model="serviceLabelTemp.key" /></a-col>
          <a-col :span="6" style="padding-left:1%"><a-input v-model="serviceLabelTemp.value" /></a-col>
          <a-col :span="6" style="padding-left:1%"><a-checkbox :checked="serviceLabelTemp.isReject">注入</a-checkbox></a-col>
          <a-col :span="5" style="padding-left:1%"><a-button class="editable-add-btn" @click="handleAddLabel">添加</a-button></a-col>
        </a-row>
        <a-row :key="index" v-for="(lbl, index) in serviceLabels" >
          <a-col :span="6">{{ lbl.key }}</a-col>
          <a-col :span="6" style="padding-left:1%">{{ lbl.value }}</a-col>
          <a-col :span="6" style="padding-left:1%">{{ lbl.isReject }}</a-col>
          <a-col :span="5" style="padding-left:1%"><a-button class="editable-add-btn" @click="handleRemoveLabel(lbl.key)">移除</a-button></a-col>
        </a-row>
      </a-form-item>

      <a-form-item :wrapperCol="{span: 19, offset: 4}">
        <a-row>
          <a-col :span="18"><a-button style="margin-left: 8px" @click="prevStep">上一步</a-button></a-col>
          <a-col :span="6"><a-button :loading="loading" type="primary" @click="nextStep">下一步</a-button></a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { getResourceName } from '@/api/application'
import serviceFetch from '@/api/service'
export default {
  name: 'Step2',
  props: {
    flowDataInfo: {
      type: Object,
      default: function () {
        return {}
      }
    },
    preDataInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      loading: false,
      instanceConfig: 'a',
      serviceLabelTemp: { key: '', value: '', isReject: false },
      serviceLabels: [],

      appName: '',
      serviceName: '',
      resourceName: '',
      resourceNameArra: [],
      imageName: '',
      imageTag: '',
      imageTagArra: [],
      deployType: '',

      instanceConfigArra: [
        { id: 'a', title: 'S', cpu: 1, mem: 1 },
        { id: 'b', title: 'M', cpu: 1, mem: 2 },
        { id: 'c', title: 'L', cpu: 2, mem: 4 },
        { id: 'd', title: 'XL', cpu: 2, mem: 8 },
        { id: 'e', title: 'XXL', cpu: 4, mem: 8 },
        { id: 'f', title: 'XXXL', cpu: 4, mem: 16 },
        { id: 'g', title: '自定义', cpu: 4, mem: 16 }
      ],

      gCpu: '',
      gMem: '',

      chooseCpu: '1',
      chooseMem: '1024',

      basicDataInfo: {},

      addServiceOnly: false
    }
  },
  created () {
    var self = this
    if (self.preDataInfo.step2 !== null && self.preDataInfo.step2 !== undefined && JSON.stringify(self.preDataInfo.step2) !== '{}') {
      self.appName = self.preDataInfo.step2.AppName
      self.serviceName = self.preDataInfo.step2.ServiceName
      self.resourceName = self.preDataInfo.step2.ResourceName
      self.deployType = self.preDataInfo.step2.serviceType
      self.imageName = self.preDataInfo.step2.ImageRegistry
      self.chooseCpu = self.preDataInfo.step2.Cpu
      self.chooseMem = self.preDataInfo.step2.Memory
      self.serviceLabels = self.preDataInfo.step2.ServiceLablesData
      self.imageTag = self.preDataInfo.step2.Version
    }
    self.initResourceNameArra()

    if (self.flowDataInfo != null && self.flowDataInfo !== {}) {
      self.imageName = self.flowDataInfo.step1.Access + '/' + self.flowDataInfo.step1.Name
      var tempTags = self.flowDataInfo.step1.Tags
      self.imageTagArra = tempTags.split(',')
      if (self.imageTagArra.length > 0) {
        self.imageTag = self.imageTagArra[0]
      }
      if (self.flowDataInfo.step1.routeAppName) {
        self.appName = self.flowDataInfo.step1.routeAppName
        self.addServiceOnly = true
      }
    }
  },
  methods: {
    initResourceNameArra () {
      var self = this
      getResourceName('admin')
        .then(res => {
          self.resourceNameArra = res.result
          if (res.result.length > 0) {
            self.resourceName = res.result[0]
          }
        })
    },
    checkName () {
      serviceFetch.QueryServiceByName('', 'DevCluster', 'demo17')
        .then(res => {
          console.log(res)
        })
    },
    nextStep () {
      const self = this
      if (self.valid() === 0) {
        self.basicDataInfo = {
          'AppName': self.appName,
          'ServiceName': self.serviceName,
          'ResourceName': self.resourceName,
          'serviceType': self.deployType,
          'ImageRegistry': self.imageName,
          'ImageTag': self.imageName + ':' + self.imageTag,
          'Cpu': self.chooseCpu,
          'Memory': self.chooseMem,
          'ServiceLablesData': self.serviceLabels,
          'Version': self.imageTag
        }
        var outputObjJson = self.preDataInfo
        outputObjJson['step2'] = self.basicDataInfo
        self.$emit('nextStep', outputObjJson)
      }
    },
    prevStep () {
      this.$emit('prevStep')
    },
    handleAddLabel () {
      var l = this.serviceLabels.find(c => c.key === this.serviceLabelTemp.key)
      if (l) {
        this.$message.error(`不能输入重复的标签，标签：[${l.key}]`)
      } else {
        this.serviceLabels.push({ key: this.serviceLabelTemp.key, value: this.serviceLabelTemp.value, isReject: this.serviceLabelTemp.isReject })
        this.serviceLabelTemp = { key: '', value: '', isReject: false }
      }
    },
    handleRemoveLabel (k) {
      console.log(k)
      this.serviceLabels = this.serviceLabels.filter(t => t.key !== k)
    },
    valid () {
      var self = this
      var flag = 0
      if (self.appName === '') {
        self.$message.error(`请输入应用名称`)
        flag = 1
        return flag
      }
      if (self.serviceName === '') {
        self.$message.error(`请输入服务名称`)
        flag = 1
        return flag
      }
      if (self.deployType === '') {
        self.$message.error(`请选择部署类型`)
        flag = 1
        return flag
      }
      if (self.chooseCpu === '' || self.chooseMem === '') {
        self.$message.error(`请选择资源`)
        flag = 1
        return flag
      }
      return flag
    }
  },
  watch: {
    instanceConfig (val) {
      var self = this
      var tempConfigObj = self.instanceConfigArra.find(item => item.id === val)
      if (!tempConfigObj) {
        self.$message.error(`不存在该系统配置`)
      } else {
        if (val !== 'g') {
          self.chooseCpu = tempConfigObj.cpu
          self.chooseMem = tempConfigObj.mem * 1024
        }
      }
    },
    gCpu (val) {
      var self = this
      if (val) {
        self.chooseCpu = val
      } else {
        self.chooseCpu = 0
      }
    },
    gMem (val) {
      var self = this
      if (val) {
        self.chooseMem = val * 1024
      } else {
        self.chooseMem = 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }

</style>
