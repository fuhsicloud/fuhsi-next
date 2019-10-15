<template>
  <page-layout title="基本信息">
    <detail-list slot="headerContent" size="small" :col="3" class="detail-layout">
      <detail-list-item term="配额名称">{{ quotaName }}</detail-list-item>
      <detail-list-item term="创建人">{{ createdUser }}</detail-list-item>
      <detail-list-item term="创建时间">{{ createdTime }}</detail-list-item>
      <detail-list-item term="描述信息">{{ quotaDesc }}</detail-list-item>
    </detail-list>
    <detail-list slot="headerContent" size="small" :col="3" class="detail-layout">
      <detail-list-item term="配额用户">{{ userName }}</detail-list-item>
      <detail-list-item term="配额组">{{ groupName }}</detail-list-item>
      <detail-list-item term="配额租户">{{ tenantName }}</detail-list-item>
    </detail-list>
    <detail-list slot="headerContent" size="small" :col="3" class="detail-layout">
      <detail-list-item term="内存">{{ quotaMemory }}M</detail-list-item>
      <detail-list-item term="Cpu">{{ quotaCpu }}核</detail-list-item>
      <detail-list-item term="镜像仓库">{{ quotaRegistryGroup }}个</detail-list-item>
      <detail-list-item term="应用数量">{{ quotaApp }}个</detail-list-item>
      <detail-list-item term="服务数量">{{ quotaService }}个</detail-list-item>
      <detail-list-item term="容器数量">{{ quotaPod }}个</detail-list-item>
      <detail-list-item term="构建任务数量">{{ quotaJob }}个</detail-list-item>
      <detail-list-item term="负载均衡数量">{{ quotaLb }}个</detail-list-item>
      <detail-list-item term="流水线数量">{{ quotaPipeline }}个</detail-list-item>
      <detail-list-item term="Dockerfile数量">{{ quotaDockerFile }}个</detail-list-item>
    </detail-list>
    <template slot="action">
      <a-button-group style="margin-right: 4px;">
        <a-button @click="backList">返回</a-button>
        <a-button @click="deleteQuotaHandler">删除</a-button>
        <a-button @click="showQuotaInfo">更新</a-button>
        <a-button @click="showDistribute" v-show="tenantName===''">分配租户</a-button>
      </a-button-group>
    </template>
    <a-list
      :grid="{ gutter: 16, column: 4 }"
      :dataSource="detailInfoData"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card
          :title="item.title"
          :bodyStyle="{display:'flex',alignItems:'center',justifyContent:'space-between'}">
          <liquid
            name="liquid"
            :height="200"
            :width="200"
            :data="item.dataArras"
            :forceFit="false"
            :color="item.color"
            :scale="scale" ></liquid>
          <div class="word-content">
            <div>
              <span style="font-weight:700;">{{ item.left }}</span>
              <span style="color:#ccc;">{{ item.leftWord }}</span>
            </div>
            <div>
              <span style="font-weight:700;">{{ item.total }} / {{ item.used }}</span>
              <span style="color:#ccc;">{{ item.totalWord }}/{{ item.usedWord }}</span>
            </div>
          </div>
        </a-card>
      </a-list-item>
    </a-list>
    <a-drawer
      title="资源配额管理"
      :width="720"
      :visible="maskShow"
      @close="onClose"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <a-form :form="form" hideRequiredMark>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item
              label="配额名称"
              :labelCol="{lg: {span: 3}, sm: {span: 3}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
              <a-input placeholder="请输入配额名称" v-model="quotaName" />
            </a-form-item>
          </a-col>
          <a-col :span="20">
            <a-form-item
              label="配额描述"
              :labelCol="{lg: {span: 3}, sm: {span: 3}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
              <a-textarea placeholder="请输入配额名称" v-model="quotaDesc"></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="20">
            <a-form-item
              label="选择用户"
              :labelCol="{lg: {span: 3}, sm: {span: 3}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
              <a-select showSearch v-model="userName" allowClear>
                <a-select-option v-for="(item,index) in userArra" :key="index" :value="item.UserName">{{ item.UserName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="20">
            <a-form-item
              label="选择组"
              :labelCol="{lg: {span: 3}, sm: {span: 3}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
              <a-select showSearch v-model="groupName" allowClear>
                <a-select-option v-for="item in groupArra" :key="item.GroupsId" :value="item.GroupsName">{{ item.GroupsName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="20" class="inlineform">
            <div class="left-inlineform">
              <a-form-item
                label="服务CPU使用量"
                :labelCol="{lg: {span: 9}, sm: {span: 9}}"
                :wrapperCol="{lg: {span: 9}, sm: {span: 9} }">
                <a-input addonAfter="核" v-model="quotaCpu"/>
              </a-form-item>
            </div>
            <div class="right-inlineform">
              <a-form-item
                label="服务内存使用量"
                :labelCol="{lg: {span: 9}, sm: {span: 9}}"
                :wrapperCol="{lg: {span: 9}, sm: {span: 9} }">
                <a-input addonAfter="M" v-model="quotaMemory"/>
              </a-form-item>
            </div>
          </a-col>
          <a-col :span="20" class="inlineform">
            <div class="left-inlineform">
              <a-form-item
                label="应用使用量"
                :labelCol="{lg: {span: 9}, sm: {span: 9}}"
                :wrapperCol="{lg: {span: 9}, sm: {span: 9} }">
                <a-input addonAfter="个" v-model="quotaApp"/>
              </a-form-item>
            </div>
            <div class="right-inlineform">
              <a-form-item
                label="服务使用量"
                :labelCol="{lg: {span: 9}, sm: {span: 9}}"
                :wrapperCol="{lg: {span: 9}, sm: {span: 9} }">
                <a-input addonAfter="个" v-model="quotaService"/>
              </a-form-item>
            </div>
          </a-col>
          <a-col :span="20" class="inlineform">
            <div class="left-inlineform">
              <a-form-item
                label="容器数量"
                :labelCol="{lg: {span: 9}, sm: {span: 9}}"
                :wrapperCol="{lg: {span: 9}, sm: {span: 9} }">
                <a-input addonAfter="个" v-model="quotaPod"/>
              </a-form-item>
            </div>
            <div class="right-inlineform">
              <a-form-item
                label="负载均衡数量"
                :labelCol="{lg: {span: 9}, sm: {span: 9}}"
                :wrapperCol="{lg: {span: 9}, sm: {span: 9} }">
                <a-input addonAfter="个" v-model="quotaLb"/>
              </a-form-item>
            </div>
          </a-col>
          <a-col :span="20" class="inlineform">
            <div class="left-inlineform">
              <a-form-item
                label="构建任务数量"
                :labelCol="{lg: {span: 9}, sm: {span: 9}}"
                :wrapperCol="{lg: {span: 9}, sm: {span: 9} }">
                <a-input addonAfter="个" v-model="quotaJob"/>
              </a-form-item>
            </div>
            <div class="right-inlineform">
              <a-form-item
                label="流水线数量"
                :labelCol="{lg: {span: 9}, sm: {span: 9}}"
                :wrapperCol="{lg: {span: 9}, sm: {span: 9} }">
                <a-input addonAfter="个" v-model="quotaPipeline"/>
              </a-form-item>
            </div>
          </a-col>
          <a-col :span="20" class="inlineform">
            <div class="left-inlineform">
              <a-form-item
                label="镜像仓库数量"
                :labelCol="{lg: {span: 9}, sm: {span: 9}}"
                :wrapperCol="{lg: {span: 9}, sm: {span: 9} }">
                <a-input addonAfter="个" v-model="quotaRegistryGroup"/>
              </a-form-item>
            </div>
            <div class="right-inlineform">
              <a-form-item
                label="Dockerfile数量"
                :labelCol="{lg: {span: 9}, sm: {span: 9}}"
                :wrapperCol="{lg: {span: 9}, sm: {span: 9} }">
                <a-input addonAfter="个" v-model="quotaDockerFile"/>
              </a-form-item>
            </div>
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
        <a-button type="primary" :loading="btnLoading" @click="saveQuota">保存</a-button>
      </div>
    </a-drawer>
    <a-drawer
      title="资源配额分配"
      :width="720"
      :visible="maskDistributeShow"
      @close="onDistributeClose"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <a-form :form="form" hideRequiredMark>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item
              label="选择租户"
              :labelCol="{lg: {span: 3}, sm: {span: 3}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
              <a-select showSearch v-model="distributeTenant" allowClear>
                <a-select-option v-for="(item,index) in tenantArras" :key="index" :value="item.TenantName">{{ item.TenantName }}</a-select-option>
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
        <a-button :style="{marginRight: '8px'}" @click="onDistributeClose">取消</a-button>
        <a-button type="primary" :loading="btnDistributeLoading" @click="distributeQuota">保存</a-button>
      </div>
    </a-drawer>
  </page-layout>
</template>

<script>
import quotaFetch from '@/api/quota.js'
import userFetch from '@/api/user.js'
import groupFetch from '@/api/group.js'
import tenantFetch from '@/api/tenant.js'
import PageLayout from '@/components/page/PageLayout'
import DetailList from '@/components/tools/DetailList'
import Liquid from '@/components/chart/Liquid'

const DetailListItem = DetailList.Item

export default {
  name: 'QuotaView',
  components: {
    PageLayout,
    DetailList,
    DetailListItem,
    Liquid
  },
  data () {
    return {
      detailInfoData: [
        {
          title: '服务CPU使用量',
          dataArras: [{ name: 'CPU', transfer: 'CPU', value: 0 }],
          color: '#1890ff'
        },
        {
          title: '服务内存使用量',
          dataArras: [{ name: '内存', transfer: '内存', value: 0 }],
          color: '#1890ff'
        },
        {
          title: '镜像仓库组使用量',
          dataArras: [{ name: '镜像仓库组', transfer: '镜像仓库组', value: 0 }],
          color: '#1890ff'
        },
        {
          title: '应用配额使用量',
          dataArras: [{ name: '应用', transfer: '应用', value: 0 }],
          color: '#1890ff'
        },
        {
          title: '服务配额使用量',
          dataArras: [{ name: '服务', transfer: '服务', value: 0 }],
          color: '#1890ff'
        },
        {
          title: '容器配额使用量',
          dataArras: [{ name: '容器', transfer: '容器', value: 0 }],
          color: '#1890ff'
        },
        {
          title: '负载均衡配额使用量',
          dataArras: [{ name: '负载均衡', transfer: '负载均衡', value: 0 }],
          color: '#1890ff'
        },
        {
          title: '构建任务使用量',
          dataArras: [{ name: '构建任务', transfer: '构建任务', value: 0 }],
          color: '#1890ff'
        },
        {
          title: '流水线使用量',
          dataArras: [{ name: '流水线', transfer: '流水线', value: 0 }],
          color: '#1890ff'
        },
        {
          title: 'Dockerfile使用量',
          dataArras: [{ name: 'Dockerfile', transfer: 'Dockerfile', value: 0 }],
          color: '#1890ff'
        }
      ],
      scale: [{
        dataKey: 'value',
        min: 0,
        max: 100
      }],
      quotaId: '',
      quotaName: '',
      quotaDesc: '',
      userName: '',
      groupName: '',
      quotaCpu: 1,
      quotaMemory: 512,
      quotaApp: 1,
      quotaService: 1,
      quotaPod: 1,
      quotaLb: 1,
      quotaJob: 1,
      quotaPipeline: 1,
      quotaRegistryGroup: 1,
      quotaDockerFile: 1,
      createdUser: '',
      createdTime: '',
      tenantName: '',

      maskShow: false,

      btnLoading: false,
      form: this.$form.createForm(this),
      userArra: [],
      groupArra: [],

      // 资源配额分配
      maskDistributeShow: false,
      btnDistributeLoading: false,
      distributeTenant: '',
      tenantArras: []
    }
  },
  async created () {
    const self = this
    if (self.$route.query.code) {
      self.quotaId = self.$route.query.code
      self.queryQuotaInfo()
      await self.initUsernames()
      await self.initGroups()
      await self.initTenantUsers()
    }
  },
  methods: {
    queryQuotaInfo () {
      const self = this
      quotaFetch.QueryQuotaInfo(self.quotaId)
        .then(res => {
          if (res.status === 200) {
            self.quotaName = res.result.QuotaName
            self.quotaDesc = res.result.Description
            self.userName = res.result.UserName
            self.groupName = res.result.GroupName
            self.quotaCpu = res.result.QuotaCpu
            self.quotaMemory = res.result.QuotaMemory
            self.quotaApp = res.result.AppNumber
            self.quotaService = res.result.ServiceNumber
            self.quotaPod = res.result.PodNumber
            self.quotaLb = res.result.LbNumber
            self.quotaJob = res.result.JobNumber
            self.quotaPipeline = res.result.PipelineNumber
            self.quotaRegistryGroup = res.result.RegistryGroupNumber
            self.quotaDockerFile = res.result.DockerFileNumber
            self.createdUser = res.result.CreateUser
            self.createdTime = res.result.CreateTime
            self.tenantName = res.result.TenantName

            self.initPercent(res.result)
          }
        })
    },
    showQuotaInfo () {
      const self = this
      self.maskShow = true
    },
    initUsernames () {
      const self = this
      return new Promise((resolve, reject) => {
        userFetch.QueryBaseUserList()
          .then(res => {
            if (res.status === 200) {
              self.userArra = [...res.result]
            }
            resolve(resolve)
          })
      })
    },
    initGroups () {
      const self = this
      return new Promise((resolve, reject) => {
        groupFetch.QueryBaseGroupList()
          .then(res => {
            if (res.status === 200) {
              self.groupArra = [...res.result]
            }
            resolve(resolve)
          })
      })
    },
    initTenantUsers () {
      const self = this
      return new Promise((resolve, reject) => {
        tenantFetch.AllTenantList()
          .then(res => {
            if (res.status === 200) {
              self.tenantArras = [...res.result]
            }
            resolve(res)
          })
      })
    },
    initPercent (quotaInfo) {
      const self = this
      self.detailInfoData[0] = self.getTempPercentObj(0, quotaInfo)
      self.detailInfoData[1] = self.getTempPercentObj(1, quotaInfo)
      self.detailInfoData[2] = self.getTempPercentObj(2, quotaInfo)
      self.detailInfoData[3] = self.getTempPercentObj(3, quotaInfo)
      self.detailInfoData[4] = self.getTempPercentObj(4, quotaInfo)
      self.detailInfoData[5] = self.getTempPercentObj(5, quotaInfo)
      self.detailInfoData[6] = self.getTempPercentObj(6, quotaInfo)
      self.detailInfoData[7] = self.getTempPercentObj(7, quotaInfo)
      self.detailInfoData[8] = self.getTempPercentObj(8, quotaInfo)
      self.detailInfoData[9] = self.getTempPercentObj(9, quotaInfo)
    },
    getTempPercentObj (type, quotaInfo) {
      const self = this
      let title = ''
      let name = ''
      let transfer = ''
      let percent = 0
      let total = 0
      let totalWord = ''
      let used = 0
      let usedWord = ''
      let left = 0
      let leftWord = ''
      let color = ''
      if (type === 0) {
        title = '服务CPU使用量'
        name = 'CPU'
        transfer = 'CPU'
        percent = quotaInfo.CpuPercent
        total = quotaInfo.QuotaCpu
        totalWord = 'CPU总数'
        used = quotaInfo.CpuUsed
        usedWord = '已使用(核)'
        left = quotaInfo.CpuFree
        leftWord = '剩余CPU'
        color = self.queryColorByCount(quotaInfo.CpuPercent)
      } else if (type === 1) {
        title = '服务内存使用量'
        name = '内存'
        transfer = '内存'
        percent = quotaInfo.MemoryPercent
        total = quotaInfo.QuotaMemory
        totalWord = '内存总量'
        used = quotaInfo.MemoryUsed
        usedWord = '已使用(GB)'
        left = quotaInfo.MemoryFree
        leftWord = '剩余内存'
        color = self.queryColorByCount(quotaInfo.MemoryPercent)
      } else if (type === 2) {
        title = '镜像仓库组使用量'
        name = '镜像仓库'
        transfer = '镜像仓库'
        percent = quotaInfo.RegistryGroupPercent
        total = quotaInfo.RegistryGroupNumber
        totalWord = '仓库组总量'
        used = quotaInfo.RegistryGroupUsed
        usedWord = '已使用(个)'
        left = quotaInfo.RegistryGroupFree
        leftWord = '剩余仓库组'
        color = self.queryColorByCount(quotaInfo.RegistryGroupPercent)
      } else if (type === 3) {
        title = '应用配额使用量'
        name = '应用'
        transfer = '应用'
        percent = quotaInfo.AppPercent
        total = quotaInfo.AppNumber
        totalWord = '应用总数'
        used = quotaInfo.AppUsed
        usedWord = '已使用(个)'
        left = quotaInfo.AppFree
        leftWord = '剩余应用'
        color = self.queryColorByCount(quotaInfo.AppPercent)
      } else if (type === 4) {
        title = '服务配额使用量'
        name = '服务'
        transfer = '服务'
        percent = quotaInfo.ServicePercent
        total = quotaInfo.ServiceNumber
        totalWord = '服务总数'
        used = quotaInfo.ServiceUsed
        usedWord = '已使用(个)'
        left = quotaInfo.ServiceFree
        leftWord = '剩余服务'
        color = self.queryColorByCount(quotaInfo.ServicePercent)
      } else if (type === 5) {
        title = '容器配额使用量'
        name = '容器'
        transfer = '容器'
        percent = quotaInfo.PodPercent
        total = quotaInfo.PodNumber
        totalWord = '容器总数'
        used = quotaInfo.PodUsed
        usedWord = '已使用(个)'
        left = quotaInfo.PodFree
        leftWord = '容器服务'
        color = self.queryColorByCount(quotaInfo.PodPercent)
      } else if (type === 6) {
        title = '负载均衡配额使用量'
        name = '负载均衡'
        transfer = '负载均衡'
        percent = quotaInfo.LbPercent
        total = quotaInfo.LbNumber
        totalWord = '负载均衡总数'
        used = quotaInfo.LbUsed
        usedWord = '已使用(个)'
        left = quotaInfo.LbFree
        leftWord = '负载均衡服务'
        color = self.queryColorByCount(quotaInfo.LbPercent)
      } else if (type === 7) {
        title = '构建任务使用量'
        name = '构建量'
        transfer = '构建量'
        percent = quotaInfo.JobPercent
        total = quotaInfo.JobNumber
        totalWord = '构建量总数'
        used = quotaInfo.JobUsed
        usedWord = '已使用(个)'
        left = quotaInfo.JobFree
        leftWord = '构建量服务'
        color = self.queryColorByCount(quotaInfo.JobPercent)
      } else if (type === 8) {
        title = '流水线使用量'
        name = '流水线'
        transfer = '流水线'
        percent = quotaInfo.PipelinePercent
        total = quotaInfo.PipelineNumber
        totalWord = '流水线总数'
        used = quotaInfo.PipelineUsed
        usedWord = '已使用(个)'
        left = quotaInfo.PipelineFree
        leftWord = '流水线服务'
        color = self.queryColorByCount(quotaInfo.PipelinePercent)
      } else if (type === 9) {
        title = 'Dockerfile使用量'
        name = 'Dockerfile'
        transfer = 'Dockerfile'
        percent = quotaInfo.DockerFilePercent
        total = quotaInfo.DockerFileNumber
        totalWord = 'Dockerfile总数'
        used = quotaInfo.DockerFileUsed
        usedWord = '已使用(个)'
        left = quotaInfo.DockerFileFree
        leftWord = 'Dockerfile服务'
        color = self.queryColorByCount(quotaInfo.DockerFilePercent)
      }

      const tempObj = {
        title: title,
        dataArras: [{ name: name, transfer: transfer, value: percent }],
        total: total,
        totalWord: totalWord,
        used: used,
        usedWord: usedWord,
        left: left,
        leftWord: leftWord,
        color: color
      }

      return tempObj
    },
    queryColorByCount (percent) {
      if (percent <= 40) {
        return '#1890ff'
      } else if (percent <= 80) {
        return 'rgb(201, 209, 7)'
      } else {
        return '#f96a74'
      }
    },
    checkVerity () {
      const self = this
      if (self.quotaName === '') {
        self.$message.error('请输入资源配额名称')
        return 1
      }
      if (self.userName === '') {
        self.$message.error('请选择用户')
        return 1
      }
      if (self.quotaCpu === '') {
        self.$message.error('请输入服务CPU使用量')
        return 1
      } else {
        if (!self.checkNum(self.quotaCpu)) {
          self.$message.error('服务CPU使用量必须为数字')
          return 1
        }
      }
      if (self.quotaMemory === '') {
        self.$message.error('请输入服务内存使用量')
        return 1
      } else {
        if (!self.checkNum(self.quotaMemory)) {
          self.$message.error('服务内存使用量必须为数字')
          return 1
        }
      }
      if (self.quotaApp === '') {
        self.$message.error('请输入应用使用量')
        return 1
      } else {
        if (!self.checkNum(self.quotaApp)) {
          self.$message.error('应用使用量必须为数字')
          return 1
        }
      }
      if (self.quotaService === '') {
        self.$message.error('请输入服务使用量')
        return 1
      } else {
        if (!self.checkNum(self.quotaService)) {
          self.$message.error('服务使用量必须为数字')
          return 1
        }
      }
      if (self.quotaPod === '') {
        self.$message.error('请输入容器数量')
        return 1
      } else {
        if (!self.checkNum(self.quotaPod)) {
          self.$message.error('容器数量必须为数字')
          return 1
        }
      }
      if (self.quotaLb === '') {
        self.$message.error('请输入负载均衡数量')
        return 1
      } else {
        if (!self.checkNum(self.quotaLb)) {
          self.$message.error('负载均衡数量必须为数字')
          return 1
        }
      }
      if (self.quotaJob === '') {
        self.$message.error('请输入构建任务数量')
        return 1
      } else {
        if (!self.checkNum(self.quotaJob)) {
          self.$message.error('构建任务数量必须为数字')
          return 1
        }
      }
      if (self.quotaPipeline === '') {
        self.$message.error('请输入流水线数量')
        return 1
      } else {
        if (!self.checkNum(self.quotaPipeline)) {
          self.$message.error('流水线数量必须为数字')
          return 1
        }
      }
      if (self.quotaRegistryGroup === '') {
        self.$message.error('请输入镜像仓库数量')
        return 1
      } else {
        if (!self.checkNum(self.quotaRegistryGroup)) {
          self.$message.error('镜像仓库数量必须为数字')
          return 1
        }
      }
      if (self.quotaDockerFile === '') {
        self.$message.error('请输入Dockerfile数量')
        return 1
      } else {
        if (!self.checkNum(self.quotaDockerFile)) {
          self.$message.error('Dockerfile数量必须为数字')
          return 1
        }
      }
    },
    checkNum (nubmer) {
      var re = /^[0-9]+.?[0-9]*/
      if (!re.test(nubmer)) {
        return false
      } else {
        return true
      }
    },
    saveQuota () {
      const self = this
      self.btnLoading = true
      if (self.checkVerity() === 1) {
        self.btnLoading = false
        return false
      }
      if (self.quotaId !== '') {
        self.modifyQuota()
      }
    },
    onClose () {
      const self = this
      self.maskShow = false
    },
    onDistributeClose () {
      const self = this
      self.maskDistributeShow = false
    },
    showDistribute () {
      const self = this
      self.maskDistributeShow = true
    },
    deleteQuotaHandler () {
      const self = this
      self.$confirm({
        title: '确定删除这条记录吗?',
        onOk () {
          self.deleteQuota(self.quotaId)
        },
        onCancel () {}
      })
    },
    modifyQuota () {
      const self = this
      const params = {
        'QuotaId': Number(self.quotaId),
        'Description': self.quotaDesc,
        'UserName': self.userName,
        'GroupName': self.groupName,
        'QuotaCpu': Number(self.quotaCpu),
        'QuotaMemory': Number(self.quotaMemory),
        'AppNumber': Number(self.quotaApp),
        'ServiceNumber': Number(self.quotaService),
        'PodNumber': Number(self.quotaPod),
        'LbNumber': Number(self.quotaLb),
        'JobNumber': Number(self.quotaJob),
        'PipelineNumber': Number(self.quotaPipeline),
        'RegistryGroupNumber': Number(self.quotaRegistryGroup),
        'DockerFileNumber': Number(self.quotaDockerFile)
      }
      quotaFetch.ModifyQuota(params)
        .then(res => {
          if (res.status === 200) {
            self.maskShow = false
            self.$notification['success']({
              message: '成功通知',
              description: '资源配置修改成功'
            })
            self.queryQuotaInfo()
            self.btnLoading = false
          } else {
            self.maskShow = false
            self.$notification['error']({
              message: '错误通知',
              description: res.result
            })
            self.queryQuotaInfo()
            self.btnLoading = false
          }
        })
    },
    deleteQuota (quotaId) {
      const self = this
      quotaFetch.DeleteQuotaInfo(quotaId)
        .then(res => {
          if (res.status === 200) {
            if (res.result.status) {
              self.$notification['success']({
                message: '成功通知',
                description: res.result.data
              })
              self.$router.push({
                path: '/base/quota-list'
              })
            } else {
              self.$notification['error']({
                message: '错误通知',
                description: res.result.data
              })
            }
          }
        })
    },
    distributeQuota () {
      const self = this
      if (self.distributeTenant === '') {
        self.$message.error('请选择租户')
        return false
      }
      self.btnDistributeLoading = true
      const params = {
        QuotaId: Number(self.quotaId),
        TenantName: self.distributeTenant
      }
      quotaFetch.DistributeQuota(params)
        .then(res => {
          self.btnDistributeLoading = false
          if (res.status === 200) {
            self.$notification['success']({
              message: '成功通知',
              description: '资源分配成功'
            })
            self.queryQuotaInfo()
            self.maskDistributeShow = false
          } else {
            self.$notification['error']({
              message: '错误通知',
              description: res.message
            })
          }
        })
    },
    backList () {
      const self = this
      self.$router.push({
        path: '/base/quota-list'
      })
    }
  }
}
</script>

<style lang="less" scoped>

  .detail-layout {
    margin-left: 44px;
  }
  .text {
    color: rgba(0, 0, 0, .45);
  }

  .heading {
    color: rgba(0, 0, 0, .85);
    font-size: 20px;
  }

  .no-data {
    color: rgba(0, 0, 0, .25);
    text-align: center;
    line-height: 64px;
    font-size: 16px;

    i {
      font-size: 24px;
      margin-right: 16px;
      position: relative;
      top: 3px;
    }
  }

  .mobile {
    .detail-layout {
      margin-left: unset;
    }
    .text {

    }
    .status-list {
      text-align: left;
    }
  }
</style>
<style scoped>
.word-content{
  display:flex;
  flex-direction:column;
  text-align:center;
}
.word-content span{
  display:flex;
  flex-direction:column;
}
.inlineform{
  display: flex;
}
.left-inlineform{
  flex:1;
}
.right-inlineform{
  flex: 1;
}
</style>
