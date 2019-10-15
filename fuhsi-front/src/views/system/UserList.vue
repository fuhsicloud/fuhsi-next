<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户名">
              <a-input placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary">查询</a-button>
              <a-button style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleEdit()">新建</a-button>
    </div>

    <s-table
      size="default"
      rowKey="UserId"
      :columns="columns"
      :data="loadData"
    >
      <template
        slot="IsDel"
        slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
      </template>

      <div
        slot="expandedRowRender"
        slot-scope="record"
        style="margin: 0">
        <a-row
          :gutter="24"
          :style="{ marginBottom: '12px' }">
          <a-col :span="12" v-for="(role, index) in record.permissions" :key="index" :style="{ marginBottom: '12px' }">
            <a-col :lg="4" :md="24">
              <span>{{ role.permissionName }}：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="role.actionEntitySet.length > 0">
              <a-tag color="cyan" v-for="(action, k) in role.actionEntitySet" :key="k">{{ action.describe }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
        </a-row>
      </div>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">禁用</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

    <a-modal
      title="操作"
      style="top: 20px;"
      :width="800"
      v-model="visible"
      @ok="handleOk"
    >
      <a-form :autoFormCreate="(form)=>{this.form = form}">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="登录名"
          hasFeedback
        >
          <a-input placeholder="起一个名字" v-model="mdl.UserName" id="user_name" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="真实姓名"
          hasFeedback
        >
          <a-input placeholder="真实姓名" v-model="mdl.RealName" id="real_name" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态"
          hasFeedback
        >
          <a-select v-model="mdl.IsDel">
            <a-select-option value="0">正常</a-select-option>
            <a-select-option value="1">禁用</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="邮箱地址"
          hasFeedback
        >
          <a-input placeholder="邮箱" v-model="mdl.UserEmail" id="user_email" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="手机号"
          hasFeedback
        >
          <a-input placeholder="手机号" v-model="mdl.UserMobile" id="user_mobile" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="密码"
          hasFeedback
        >
          <a-input
            size="large"
            type="password"
            autocomplete="false"
            placeholder="密码"
            v-model="mdl.Pwd"
            id="pwd"
            v-decorator="[
              'password',
              {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
            ]"
          >
          </a-input>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述"
          hasFeedback
        >
          <a-textarea :rows="5" v-model="mdl.Description" placeholder="..." id="description"/>
        </a-form-item>

        <!-- <a-divider />

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="拥有权限"
          hasFeedback
        >
          <a-row :gutter="16" v-for="(permission, index) in mdl.permissions" :key="index">
            <a-col :span="4">
              {{ permission.permissionName }}：
            </a-col>
            <a-col :span="20">
              <a-checkbox-group :options="permission.actionsOptions"/>
            </a-col>
          </a-row>

        </a-form-item> -->

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import STable from '@/components/table/'
import { getServiceList, getUserList } from '@/api/manage'

export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: null,
      mdl: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '真实姓名',
          dataIndex: 'RealName'
        },
        {
          title: '登录名',
          dataIndex: 'UserName'
        },
        {
          title: '状态',
          dataIndex: 'IsDel',
          scopedSlots: { customRender: 'IsDel' }
        },
        {
          title: '描述信息',
          dataIndex: 'Description'
        },
        {
          title: '创建时间',
          dataIndex: 'CreateTime'
        },
        {
          title: '最近更新时间',
          dataIndex: 'LastModifyTime'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getUserList(parameter)
          .then(res => {
            return res.result
          })
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: '有效',
        1: '无效'
      }
      return statusMap[status]
    },
    statusTypeFilter (type) {
      const statusTypeMap = {
        0: 'success',
        1: 'error'
      }
      return statusTypeMap[type]
    }
  },
  created () {
    getServiceList().then(res => {
      console.log('getServiceList.call()', res)
    })

    getUserList().then(res => {
      console.log('getUserList.call()', res)
    })
  },
  methods: {
    handleEdit (record) {
      this.mdl = Object.assign({}, record)

      // this.mdl.permissions.forEach(permission => {
      //   permission.actionsOptions = permission.actionEntitySet.map(action => {
      //     return { label: action.describe, value: action.action, defaultCheck: action.defaultCheck }
      //   })
      // })

      this.visible = true
    },
    handleOk () {

    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
