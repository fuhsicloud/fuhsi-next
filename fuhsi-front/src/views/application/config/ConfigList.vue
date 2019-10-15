<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :lg="5" :md="8" :sm="24">
            <a-form-item label="配置名称">
              <a-input v-model="queryParam.configName" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :lg="5" :md="8" :sm="24">
            <a-form-item label="所属集群">
              <a-select v-model="queryParam.clusterName" placeholder="请选择" default-value="0">
                <a-select-option value="DevCluster">开发测试集群</a-select-option>
                <a-select-option value="AKS">Azure East2 AKS 1</a-select-option>
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
      title="创建应用配置"
      :width="560"
      @close="onClose"
      :visible="visible"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <a-form :form="form" layout="vertical" >
        <a-row :gutter="12">
          <a-col :span="24">
            <a-form-item label="环境">
              <a-select
                v-decorator="['configInfo.Entname', {
                  rules: [{ required: true, message: '请选择环境' }],
                  initialValue: configInfo.Entname
                }]"
                placeholder="请选择环境"
              >
                <a-select-option value="dev">开发环境</a-select-option>
                <a-select-option value="test">测试环境</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="24">
            <a-form-item label="群集">
              <a-select
                v-decorator="['cluetertype', {
                  rules: [{ required: true, message: '请选择群集' }],
                  initialValue: configInfo.ClusterName
                }]"
                placeholder="请选择群集"
              >
                <a-select-option value="DevCluster">DevCluster</a-select-option>
                <a-select-option value="AKS">AKS</a-select-option>
                <!-- <a-select-option value="mao">Maomao Zhou</a-select-option> -->
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="24">
            <a-form-item label="显示名称">
              <a-input
                v-decorator="['ClusterName', {
                  rules: [{ required: true, message: '请输入配置名称' }],
                  initialValue: configInfo.ConfigureName
                }]"
                placeholder="配置名称"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="描述">
              <a-textarea
                v-decorator="['description', {
                  rules: [{ required: true, message: '请输入描述信息' }],
                  initialValue: configInfo.Description
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
      <a-button type="primary" icon="plus" @click="handleEdit()">添加配置</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="ConfigureId"
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
          <a @click="viewConfigItems(record)">{{ record.ConfigureName }}</a>
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

    <a-drawer
      :title="showConfigTitle"
      :width="680"
      @close="onItemClose"
      :closable="false"
      :visible="showConfigItems"
      :wrapStyle="{height: 'calc(100%)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <template>
        <a-table :columns="itemColumns" :dataSource="configItems" rowKey="DataId">
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <a slot="name" slot-scope="text" href="javascript:;">{{ text }}</a>
          <span slot="action" slot-scope="text, record">
            <a @click="viewItemData(record)">详情</a>
          </span>
        </a-table>

        <a-drawer
          :title="showItemTitle"
          :width="560"
          @close="onItemDataClose"
          :closable="false"
          :visible="showItemData"
          :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
        >
          <template>
            <a-textarea style="border: none;background-color: #333;width: 100%;color: #F0F0F0;overflow-y: scroll" v-model="configItemInfo.Data" rows="36">
            </a-textarea>
          </template>
        </a-drawer>
      </template>
    </a-drawer>

  </div>
</template>

<script>
import moment from 'moment'
import STable from '@/components/table/'
import ConfigureService from '@/api/configure'

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
      showConfigItems: false,
      showItemData: false,
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
          title: '环境名称',
          dataIndex: 'Entname'
        },
        {
          title: '配置',
          dataIndex: 'ConfigureName',
          scopedSlots: { customRender: 'name' }
          // needTotal: true
        },
        {
          title: '所属集群',
          dataIndex: 'ClusterName',
          sorter: true
          // customRender: (text) => text + ' 次'
        },
        {
          title: '描述信息',
          dataIndex: 'Description'
        },
        {
          title: '创建时间',
          dataIndex: 'CreateTime',
          sorter: true
        },
        {
          title: '更新时间',
          dataIndex: 'LastModifyTime',
          sorter: true
        },
        {
          table: '操作',
          dataIndex: 'ConfigureId',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return ConfigureService.getConfigures()
          .then(res => {
            console.log(res)
            return res.result
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      configInfo: {},
      configItemInfo: {},
      // custom table alert & rowSelection
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false,
      // items columns
      // items of config
      configItems: [],
      itemColumns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '配置项',
          dataIndex: 'DataName',
          scopedSlots: { customRender: 'name' },
          sorter: true
        },
        {
          title: '更新时间',
          dataIndex: 'LastModifyTime',
          sorter: true
        },
        {
          title: '',
          dataIndex: 'DataId',
          scopedSlots: { customRender: 'action' }
        }
      ]
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
          ClusterName: '', Description: '', ConfigureId: 0, ConfigureName: '', Entname: ''
        }
      }
      this.configInfo = record
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
      this.configInfo = {}
      this.visible = false
    },
    onItemClose () {
      this.configInfo = {}
      this.showConfigItems = false
    },
    onItemDataClose () {
      this.configItemInfo = {}
      this.showItemData = false
    },
    showConfigTitle () {
      return '配置项列表-' + this.configInfo.ConfigureName
    },
    showItemTitle () {
      return '配置项-' + this.configItemInfo.DataName
    },
    viewConfigItems (record) {
      var that = this
      this.configInfo = record
      ConfigureService.getConfigItems(record.ConfigureId)
        .then(res => {
          console.log(res)
          that.configItems = res.result
        })
      this.showConfigItems = true
    },
    viewItemData (record) {
      console.log(record)
      this.configItemInfo = record
      this.showItemData = true
    }
  }
}
</script>
