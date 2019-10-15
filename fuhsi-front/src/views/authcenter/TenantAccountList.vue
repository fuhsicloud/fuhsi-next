<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户名">
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
      <a-button type="primary" icon="plus" @click="showMask(0)">新建账号</a-button>
    </div>

    <a-table bordered :dataSource="dataSource" :columns="columns" rowKey="ID">
      <template slot="operation" slot-scope="text, record">
        <a href="javascript:;" @click="clientDel(record.ID)">删除</a>
      </template>
    </a-table>
    <a-drawer
      title="账号管理"
      :width="720"
      @close="onClose"
      :visible="maskShow"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <a-form :form="form" layout="vertical" hideRequiredMark>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="用户名">
              <a-input v-model="username"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="角色">
              <a-input v-model="roleId" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="密码">
              <a-input type="password" v-model="password"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="再次输入密码">
              <a-input type="password" v-model="rePassword"/>
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
        <a-button type="primary" :loading="btnLoading" @click="saveTenantAccountHandler">保存</a-button>
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
        title: '用户名',
        dataIndex: 'Username',
        width: '25%',
        scopedSlots: { customRender: 'Username' }
      }, {
        title: '角色',
        dataIndex: 'RoleID.String',
        scopedSlots: { customRender: 'RoleID' }
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: '15%',
        scopedSlots: { customRender: 'operation' }
      }],
      btnLoading: false,
      maskShow: false,
      keywords: '',

      clientId: '',
      username: '',
      roleId: 'superuser',
      password: '',
      rePassword: '',
      accountId: ''
    }
  },
  created () {
    const self = this
    if (self.$route.query.code) {
      self.clientId = self.$route.query.code
    }
    self.initAccountList()
  },
  methods: {
    initAccountList () {
      const self = this
      accountAxios.QueryTenantAccountList(self.clientId)
        .then(res => {
          console.log(res)
          if (res.isSuccess) {
            self.dataSource = [...res.data]
          }
        })
    },
    showMask (clientId) {
      const self = this
      self.maskShow = true
    },
    saveTenantAccountHandler () {
      const self = this
      self.btnLoading = true
      if (self.checkVerity() === 1) {
        self.btnLoading = false
        return false
      }
      if (self.accountId === '') {
        // add
        self.addTenantAccount()
      } else {
        // update
      }
    },
    addTenantAccount () {
      const self = this
      const param = {
        Username: self.username,
        ClientId: self.clientId,
        RoleID: self.roleId,
        Password: self.password,
        SecondPassword: self.rePassword
      }
      accountAxios.AddTenantAccount(param)
        .then(res => {
          if (res.isSuccess) {
            self.maskShow = false
            self.$notification['success']({
              message: '成功通知',
              description: '租户账号创建成功'
            })
            self.initAccountList()
            self.btnLoading = false
          } else {
            self.maskShow = false
            self.$notification['error']({
              message: '错误通知',
              description: res.message
            })
            self.initAccountList()
            self.btnLoading = false
          }
        })
    },
    checkVerity () {
      const self = this
      if (self.username === '') {
        self.$message.error('请输入用户名')
        return 1
      }
      if (self.password === '') {
        self.$message.error('请输入密码')
        return 1
      }
      if (self.rePassword === '') {
        self.$message.error('请再次输入密码')
        return 1
      }
      if (self.password !== self.rePassword) {
        self.$message.error('俩次输入的密码不一致，请重新输入')
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
    }
  },
  watch: {
    maskShow (val) {
      const self = this
      if (!val) {
        self.username = ''
        self.password = ''
        self.rePassword = ''
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
