<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="ClientId">
              <a-input placeholder="" v-model="keywords"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary">查询</a-button>
            <a-button style="margin-left: 8px">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="showMask(0)">新建环境</a-button>
    </div>

    <a-table bordered :dataSource="dataSource" :columns="columns" rowKey="ID">
      <template slot="operation" slot-scope="text, record">
        <a href="javascript:;" @click="resetSecrectHandler(record.ID)">重置Secrect</a>
        &nbsp;
        <a href="javascript:;" @click="showAccountList(record.ID)">账号</a>
      </template>
    </a-table>
    <a-drawer
      title="环境管理"
      :width="720"
      @close="onClose"
      :visible="maskShow"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <a-form :form="form" layout="vertical" hideRequiredMark>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="ClientKey(租户唯一code_环境)">
              <a-input v-model="clientKey"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="回调域名">
              <a-input v-model="redirectUrl"/>
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
        <a-button type="primary" :loading="btnLoading" @click="saveTenantClientHandler">保存</a-button>
      </div>
    </a-drawer>
  </a-card>
</template>

<script>
import accountAxios from '@/api/account.js'
export default {
  data () {
    return {
      form: this.$form.createForm(this),
      dataSource: [],
      columns: [{
        title: '编号',
        dataIndex: 'ID',
        width: '25%',
        scopedSlots: { customRender: 'ID' }
      }, {
        title: 'ClientKey',
        dataIndex: 'ClientKey',
        width: '25%',
        scopedSlots: { customRender: 'ClientKey' }
      }, {
        title: '回调域名',
        dataIndex: 'RedirectURI.String',
        scopedSlots: { customRender: 'RedirectURI' }
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: '15%',
        scopedSlots: { customRender: 'operation' }
      }],
      btnLoading: false,
      maskShow: false,
      keywords: '',

      tenantCode: '',
      clientKey: '',
      redirectUrl: '',
      clientId: ''
    }
  },
  created () {
    const self = this
    if (self.$route.query.code) {
      self.tenantCode = self.$route.query.code
    }
    self.initClientList()
  },
  methods: {
    initClientList () {
      const self = this
      accountAxios.QueryTenantClientList(self.tenantCode)
        .then(res => {
          if (res.isSuccess) {
            self.dataSource = [...res.data]
          }
        })
    },
    showMask (clientId) {
      const self = this
      self.maskShow = true
      if (clientId === 0) {
        self.clientKey = self.tenantCode + '_'
      } else {

      }
    },
    saveTenantClientHandler () {
      const self = this
      self.btnLoading = true
      if (self.checkVerity() === 1) {
        self.btnLoading = false
        return false
      }
      if (self.clientId === '') {
        // add
        self.addTenantClient()
      } else {
        // update
      }
    },
    addTenantClient () {
      const self = this
      const param = {
        ClientKey: self.clientKey,
        RedirectURI: self.redirectUrl,
        TenantCode: self.tenantCode
      }
      accountAxios.AddTenantClient(param)
        .then(res => {
          if (res.isSuccess) {
            self.maskShow = false
            self.$notification['success']({
              message: '成功通知',
              description: '租户Client分配成功'
            })
            self.initClientList()
            self.btnLoading = false
          } else {
            self.maskShow = false
            self.$notification['error']({
              message: '错误通知',
              description: res.message
            })
            self.initClientList()
            self.btnLoading = false
          }
        })
    },
    checkVerity () {
      const self = this
      if (self.clientKey === '') {
        self.$message.error('请输入clientKey')
        return 1
      }
      if (self.redirectUrl === '') {
        self.$message.error('请输入回调域名')
        return 1
      }
    },
    onClose () {
      const self = this
      self.maskShow = false
    },
    clientDel () {
      const self = this
      self.$message.error('暂未开发删除功能')
    },
    showAccountList (clientId) {
      const self = this
      self.$router.push({
        path: '/auth/tenants/accounts',
        query: {
          code: clientId
        }
      })
    },
    resetSecrectHandler (id) {
      const self = this
      accountAxios.ResetTenantClientSecrect(id)
        .then(res => {
          if (res.isSuccess) {
            self.$notification['success']({
              message: '成功通知',
              description: '租户ClientSecrect重置成功'
            })
          } else {
            self.$notification['error']({
              message: '错误通知',
              description: res.message
            })
          }
        })
    }
  },
  watch: {
    maskShow (val) {
      const self = this
      if (!val) {
        self.clientId = ''
        self.clientKey = ''
        self.redirectUrl = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .search {
    margin-bottom: 54px;
  }

  .fold {
    width: calc(100% - 216px);
    display: inline-block
  }

  .operator {
    margin-bottom: 18px;
  }

  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }

  .dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #999;
    transition: all .3s;
  }

  .table-operator{
    margin-bottom:10px;
  }
</style>
