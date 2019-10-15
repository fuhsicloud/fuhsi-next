<template>
  <div>
    <a-form style="margin: 40px auto 0;">
      <a-form-item
        label="服务类型"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-radio-group defaultValue="a" buttonStyle="solid">
          <a-radio-button value="a">无状态</a-radio-button>
          <a-radio-button value="b">有状态</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="调节模式"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-radio-group defaultValue="a" buttonStyle="solid">
          <a-radio-button value="a">手动</a-radio-button>
          <a-radio-button value="b">自动</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="容器实例数量"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input v-model="replicas"/>
      </a-form-item>
      <a-form-item
        label="实列最小值"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input v-model="replicasMin" />
      </a-form-item>
      <a-form-item
        label="实列最大值"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input v-model="replicasMax" />
      </a-form-item>
      <a-form-item
        label="配置文件"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-row>
          <a-col :span="6">容器路径</a-col>
          <a-col :span="6">配置项目</a-col>
          <a-col :span="5">操作</a-col>
        </a-row>
        <a-row v-for="(item,index) in configData" :key="index">
          <a-col :span="6">{{ item.ContainerPath }}</a-col>
          <a-col :span="6">{{ item.DataName }}</a-col>
          <a-col :span="5"><a-button class="editable-add-btn" @click="delConfigMap(index)">移除</a-button></a-col>
        </a-row>
        <a-row>
          <a-col :span="6"></a-col>
          <a-col :span="6"></a-col>
          <a-col :span="5"><a-button class="editable-add-btn" @click="showAddConfigMaps">添加</a-button></a-col>
        </a-row>
      </a-form-item>
      <a-form-item
        label="环境变量"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <template>
          <a-textarea
            placeholder="变量名=变量值
evn=prod"
            v-model="envs"
            :rows="5"/>
        </template>
      </a-form-item>
      <a-form-item
        label="日志路径"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <template>
          <a-textarea
            placeholder="/usr/local/tomcat/logs/
/var/log/yum.log
/var/log/messages
/tmp/gc.log
多个日志按换行填入,目录以/结尾,路径可以使用$item变量,$item为服务名称配置时需要先配置kfak地址信息,filebeat将日志输出到kafka中"
            v-model="logPath"
            :rows="8"/>
        </template>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 4}">
        <a-row>
          <a-col :span="18"><a-button style="margin-left: 8px" @click="prevStep">上一步</a-button></a-col>
          <a-col :span="6"><a-button :loading="loading" type="primary" @click="finish">提交</a-button></a-col>
        </a-row>
      </a-form-item>
    </a-form>
    <a-drawer
      title="选择配置文件"
      :width="720"
      @close="onClose"
      :visible="maskShow"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <a-form :form="form" layout="vertical" hideRequiredMark>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="容器文件路径">
              <a-input placeholder="配置文件挂载到容器的路径，比如/home/data/config" v-model="configRoot"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="配置文件组选择">
              <a-select showSearch v-model="configGroupId" allowClear @change="configGroupChange">
                <a-select-option v-for="item in configTypes" :key="item.ConfigureId" :value="item.ConfigureId">{{ item.ConfigureName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="配置文件选择">
              <a-select showSearch v-model="configMapData" allowClear>
                <a-select-option v-for="item in configMap" :key="item.DataId" :value="item.DataName">{{ item.DataName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <a-button :style="{marginRight: '8px'}" @click="onClose">取消</a-button>
        <a-button type="primary" :loading="btnLoading" @click="addConfigHandler">保存</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { Result } from '@/components'
import configFetch from '@/api/configure.js'

export default {
  name: 'Step4',
  props: {
    healthDataInfo: {
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
  components: {
    Result
  },
  data () {
    return {
      loading: false,
      serviceLabelTemp: { key: 'project', value: 'techsun', isReject: true },
      serviceLabels: [],
      replicas: '1',
      replicasMin: '1',
      replicasMax: '1',
      envs: '',
      logPath: '',
      configData: [],
      finishDataInfo: {},

      form: this.$form.createForm(this),
      configTypes: [],
      configGroupId: '',
      configGroupName: '',
      configMap: [],
      configMapData: '',
      configRoot: '',

      btnLoading: false,
      maskShow: false
    }
  },
  created () {
    var self = this
    if (self.preDataInfo.step4 !== null && self.preDataInfo.step4 !== undefined && JSON.stringify(self.preDataInfo.step4) !== '{}') {
      self.replicas = self.preDataInfo.step4.Replicas
      self.replicasMin = self.preDataInfo.step4.ReplicasMin
      self.replicasMax = self.preDataInfo.step4.ReplicasMax
      self.envs = self.preDataInfo.step4.Envs
      self.logPath = self.preDataInfo.step4.LogPath
      self.configData = self.preDataInfo.step4.ConfigData
    }
    self.queryConfigName()
  },
  methods: {
    finish () {
      var self = this
      self.finishDataInfo = {
        'Replicas': self.replicas,
        'ReplicasMin': self.replicasMin,
        'ReplicasMax': self.replicasMax,
        'Envs': self.envs,
        'LogPath': self.logPath,
        'ConfigData': self.configData
      }
      var outputObjJson = self.preDataInfo
      outputObjJson['step4'] = self.finishDataInfo
      self.$emit('finish', outputObjJson)
    },
    toOrderList () {
      this.$router.push('/list/query-list')
    },
    prevStep () {
      var self = this
      self.finishDataInfo = {
        'Replicas': self.replicas,
        'ReplicasMin': self.replicasMin,
        'ReplicasMax': self.replicasMax,
        'Envs': self.envs,
        'LogPath': self.logPath,
        'ConfigData': self.configData
      }
      var outputObjJson = self.preDataInfo
      outputObjJson['step4'] = self.finishDataInfo
      self.$emit('prevStep', outputObjJson)
    },
    queryConfigName () {
      const self = this
      configFetch.QueryConfigName(self.preDataInfo.step1.selectedcluster, self.preDataInfo.step1.selectEnt)
        .then(res => {
          if (res.status === 200) {
            self.configTypes = res.result
          }
        })
    },
    configGroupChange () {
      const self = this
      configFetch.getConfigItems(self.configGroupId)
        .then(res => {
          if (res.status === 200) {
            self.configMap = [...res.result]
          }
        })
    },
    onClose () {
      const self = this
      self.maskShow = false
    },
    showAddConfigMaps () {
      const self = this
      self.maskShow = true
    },
    addConfigHandler () {
      const self = this
      if (self.configRoot === '') {
        self.$message.error('请输入容器文件路径')
        return false
      }
      if (self.configGroupId === '') {
        self.$message.error('请选择配置文件组')
        return false
      }
      if (self.configGroupId === '') {
        self.$message.error('请选择配置文件')
        return false
      }
      const tempObj = {
        'ContainerPath': self.configRoot,
        'DataName': self.configGroupName,
        'DataId': self.configMapData
      }

      self.configData.push(tempObj)

      self.maskShow = false
    },
    delConfigMap (index) {
      var self = this
      self.configData.splice(index, 1)
    }
  },
  watch: {
    configGroupId (val) {
      const self = this
      if (val !== '') {
        var tempArra = self.configTypes.filter(t => t.ConfigureId === val)
        if (tempArra.length <= 0) {
          self.configGroupName = ''
        } else {
          self.configGroupName = tempArra[0].ConfigureName
        }
      }
    },
    maskShow (val) {
      const self = this
      if (!val) {
        self.configGroupId = ''
        self.configGroupName = ''
        self.configRoot = ''
        self.configMapData = ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .information {
    line-height: 22px;

    .ant-row:not(:last-child) {
      margin-bottom: 24px;
    }
  }
  .money {
    font-family: "Helvetica Neue",sans-serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 14px;
  }
</style>
