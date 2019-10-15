<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :lg="5" :md="8" :sm="24">
            <a-form-item label="仓库名称">
              <a-input v-model="queryParam.codeName" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :lg="5" :md="8" :sm="24">
            <a-form-item label="仓库类型">
              <a-select v-model="queryParam.codeSource" placeholder="请选择" default-value="0">
                <a-select-option value="gitlab">GitLab</a-select-option>
                <a-select-option value="github">GitHub</a-select-option>
                <a-select-option value="bitbucket">Bitbucket</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-drawer
      title="添加源码仓库"
      :width="560"
      @close="onClose"
      :visible="visible"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <a-form :form="form" layout="inline" >
        <a-row :gutter="12">
          <a-col :span="24">
            <a-form-item label="仓库类型">
              <a-select
                v-decorator="['codeRepInfo.CodeSource', {
                  rules: [{ required: true, message: '请选择类型' }],
                  initialValue: codeRepInfo.Entname
                }]"
                placeholder="请选择类型"
              >
                <a-select-option value="gitlab">GitLab</a-select-option>
                <a-select-option value="github">GitHub</a-select-option>
                <a-select-option value="bitbucket">Bitbucket</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="24">
            <a-form-item label="URL">
              <a-input
                v-decorator="['URL', {
                  rules: [{ required: true, message: '仓库路径为必须填写' }],
                  initialValue: codeRepInfo.CodeUrl
                }]"
                placeholder="代码仓库路径,参考：https://xxxx/xx/xx.git"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="用户名">
              <a-input
                v-decorator="['username', {
                  rules: [{ required: true, message: '请输入代码仓库登陆用户名' }],
                  initialValue: codeRepInfo.CodeUrl
                }]"
                placeholder="代码仓库登陆用户名"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="密码">
              <a-input
                v-decorator="['pwd', {
                  rules: [{ required: true, message: '请输入代码仓库登陆密码' }],
                  initialValue: codeRepInfo.Password
                }]"
                placeholder="如果为开放项目不用填写"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="Token">
              <a-textarea
                v-decorator="['username', {
                  rules: [{ required: true, message: '请输入代码仓库授权tokens' }],
                  initialValue: codeRepInfo.GitlabToken
                }]"
                :rows="4"
                placeholder="Token"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="是否公开">
              <a-checkbox >公开后其他人可以看到该项目</a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="描述">
              <a-textarea
                v-decorator="['description', {
                  rules: [{ required: true, message: '请输入描述信息' }],
                  initialValue: codeRepInfo.Description
                }]"
                :rows="4"
                placeholder="配置描述描述"
              />
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
        <a-button
          :style="{marginRight: '8px'}"
          @click="onClose"
        >
          Cancel
        </a-button>
        <a-button @click="onClose" type="primary">Submit</a-button>
      </div>
    </a-drawer>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleEdit()">添加仓库</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="RepostitoryId"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="name" slot-scope="text, record">
        <template>
          <a :href="record.CodeUrl" target="_blank">{{ record.CodeUrl }}</a>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
        </template>
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">详情</a>
            </a-menu-item>
            <a-menu-item v-if="$auth('table.disable')">
              <a href="javascript:;">禁用</a>
            </a-menu-item>
            <a-menu-item v-if="$auth('table.delete')">
              <a href="javascript:;">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

  </div>
</template>

<script>
import moment from 'moment'
import STable from '@/components/table/'
import CIService from '@/api/ci'

export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      mdl: {},
      form: this.$form.createForm(this),
      visible: false,
      showRepInfo: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '仓库名称',
          dataIndex: 'CodeUrl',
          sorter: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '仓库类型',
          dataIndex: 'CodeSource',
          sorter: true
          // scopedSlots: { customRender: 'name' }
          // needTotal: true
        },
        {
          title: '登陆用户',
          dataIndex: 'Username'
          // customRender: (text) => text + ' 次'
        },
        {
          title: '是否公开',
          dataIndex: 'Type',
          sorter: true
          // customRender: (text) => text + ' 次'
        },
        {
          title: 'Git Token',
          dataIndex: 'GitlabToken'
          // customRender: (text) => text + ' 次'
        },
        {
          title: '描述信息',
          dataIndex: 'Description'
        },
        {
          title: '更新时间',
          dataIndex: 'LastModifyTime',
          sorter: true
        },
        {
          table: '操作',
          dataIndex: 'RepostitoryId',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return CIService.getCodeReps()
          .then(res => {
            console.log(res)
            return res.result
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      codeRepInfo: {},
      // custom table alert & rowSelection
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false
    }
  },
  created () {
    this.tableOption()
    // getRoleList({ t: new Date() })
  },
  methods: {
    tableOption () {
      if (!this.optionAlertShow) {
        this.options = {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },
    handleEdit (record) {
      console.log(record)
      if (!record) {
        record = {
          CodeName: '', Description: '', RepositoryId: 0, CodeSource: '', UserName: ''
        }
      }
      this.codeRepInfo = record
      this.$emit('onEdit', record)
      this.visible = true
    },
    handleOk () {

    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },

    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    onClose () {
      this.codeRepInfo = {}
      this.visible = false
    },
    viewRepUrl (record) {
      console.log(record)
      this.codeRepInfo = record
      this.showRepInfo = true
    }
  }
}
</script>
