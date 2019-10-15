<template>
  <div class="card-list my-own-loading" ref="content">
    <a-list
      :grid="{gutter: 30, lg: 4, md: 2, sm: 1, xs: 1}"
      :dataSource="dataSource"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <template v-if="item === null">
          <a-button class="new-btn" type="dashed" @click="showQuotaMask">
            <a-icon type="plus"/>
            新增资源配额
          </a-button>
        </template>
        <template v-else>
          <a-card :hoverable="true">
            <a-card-meta @click="showQuotaView(item.QuotaId)">
              <div style="margin-bottom: 3px" slot="title">{{ item.QuotaName }}</div>
              <div class="meta-content" slot="description">
                <span style="display:block">创建用户：{{ item.CreateUser }}</span>
                <span style="display:block">状态：
                  <span v-if="item.Status==='1'" style="color:#f96a74">已使用</span>
                  <span v-else style="color:#33b867">未使用</span>
                </span>
                <span style="display:flex;flex-direction:row;justify-content:space-between;">
                  <span>CPU配额：{{ item.QuotaCpu }}</span>
                  <span>内存配额：{{ item.QuotaMemory }}</span>
                </span>
                <span style="display:block">创建时间：{{ item.CreateTime }}</span>
              </div>
            </a-card-meta>
            <template class="ant-card-actions" slot="actions">
              <a href="javascript:void(0)" @click="deleteQuotaHandler(item.QuotaId)">删除</a>
              <a href="javascript:void(0)" @click="showQuotaInfo(item.QuotaId)">修改</a>
            </template>
          </a-card>
        </template>
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
  </div>
</template>

<script>
import quotaFetch from '@/api/quota.js'
import userFetch from '@/api/user.js'
import groupFetch from '@/api/group.js'
export default {
  name: 'QuotaList',
  data () {
    return {
      dataSource: [null],
      form: this.$form.createForm(this),
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 }
        }
      },
      maskShow: false,

      btnLoading: false,

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

      userArra: [],
      groupArra: []
    }
  },
  async created () {
    const self = this
    self.queryQuotaList()
    await self.initUsernames()
    await self.initGroups()
  },
  methods: {
    queryQuotaList () {
      const self = this
      quotaFetch.QueryQuotaList('')
        .then(res => {
          if (res.status === 200) {
            self.dataSource = [null]
            res.result.forEach(item => {
              self.dataSource.push(item)
            })
          }
        })
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
    showQuotaView (quotaId) {
      const self = this
      self.$router.push({
        path: '/base/quota-view',
        query: {
          code: quotaId
        }
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
    queryQuotaInfo () {
      const self = this
      return new Promise((resolve, reject) => {
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
            }
            resolve(res)
          })
      })
    },
    showQuotaInfo (quotaId) {
      const self = this
      self.quotaId = quotaId
      self.queryQuotaInfo()
      self.maskShow = true
    },
    checkNum (nubmer) {
      var re = /^[0-9]+.?[0-9]*/
      if (!re.test(nubmer)) {
        return false
      } else {
        return true
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
    saveQuota () {
      const self = this
      self.btnLoading = true
      if (self.checkVerity() === 1) {
        self.btnLoading = false
        return false
      }
      if (self.quotaId !== '') {
        self.modifyQuota()
      } else {
        self.addQuota()
      }
    },
    addQuota () {
      const self = this
      const params = {
        'QuotaName': self.quotaName,
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
      quotaFetch.AddQuota(params)
        .then(res => {
          if (res.status === 200) {
            self.maskShow = false
            self.$notification['success']({
              message: '成功通知',
              description: '资源配置创建成功'
            })
            self.queryQuotaList()
            self.btnLoading = false
          } else {
            self.maskShow = false
            self.$notification['error']({
              message: '错误通知',
              description: res.result
            })
            self.queryQuotaList()
            self.btnLoading = false
          }
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
            self.queryQuotaList()
            self.btnLoading = false
          } else {
            self.maskShow = false
            self.$notification['error']({
              message: '错误通知',
              description: res.result
            })
            self.queryQuotaList()
            self.btnLoading = false
          }
        })
    },
    deleteQuotaHandler (quotaId) {
      const self = this
      self.$confirm({
        title: '确定删除这条记录吗?',
        onOk () {
          self.deleteQuota(quotaId)
        },
        onCancel () {}
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
              self.queryQuotaList()
            } else {
              self.$notification['error']({
                message: '错误通知',
                description: res.result.data
              })
            }
          }
        })
    },
    showQuotaMask () {
      const self = this
      self.maskShow = true
    },
    onClose () {
      const self = this
      self.maskShow = false
    }
  },
  watch: {
    maskShow (val) {
      const self = this
      if (!val) {
        self.quotaId = ''
        self.quotaName = ''
        self.quotaDesc = ''
        self.userName = ''
        self.groupName = ''
        self.quotaCpu = 1
        self.quotaMemory = 512
        self.quotaApp = 1
        self.quotaService = 1
        self.quotaPod = 1
        self.quotaLb = 1
        self.quotaJob = 1
        self.quotaPipeline = 1
        self.quotaRegistryGroup = 1
        self.quotaDockerFile = 1
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }

  .ant-card-actions {
    background: #f7f9fa;
    li {
      float: left;
      text-align: center;
      margin: 12px 0;
      color: rgba(0, 0, 0, 0.45);
      width: 50%;

      &:not(:last-child) {
        border-right: 1px solid #e8e8e8;
      }

      a {
        color: rgba(0, 0, 0, .45);
        line-height: 22px;
        display: inline-block;
        width: 100%;
        &:hover {
          color: #1890ff;
        }
      }
    }
  }

  .new-btn {
    background-color: #fff;
    border-radius: 2px;
    width: 100%;
    height: 188px;
  }

  .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #999;
    transition: all .3s;
  }
  .new-btn{
    height: 204px;
  }
  .meta-content{
    height: 80px;
    -webkit-line-clamp:4;
  }
</style>
<style scoped>
.ant-col-lg-3{
  width: 15.5% !important;
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
