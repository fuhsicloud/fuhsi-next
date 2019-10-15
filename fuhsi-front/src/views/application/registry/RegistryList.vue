<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :lg="5" :md="8" :sm="24">
            <a-form-item label="镜像仓库名称">
              <a-input v-model="keywords" placeholder="镜像仓库名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary">查询</a-button>
              <a-button style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus">添加仓库</a-button>
    </div>

    <a-table bordered :dataSource="registryServerData" :columns="columns" rowKey="ServerId">
      <span slot="name" slot-scope="text, record">
        <template>
          <a href="javascript:void(0)" @click="initRegistryGroup">{{ record.Name }}</a>
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
            <a-menu-item >
              <a href="javascript:;">禁用</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </a-table>
    <a-drawer
      title="镜像组管理"
      :width="1280"
      @close="onRegistryGroupClose"
      :visible="showRegistryGroup"
      :wrapStyle="{height: 'calc(100%)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <template>
        <div class="table-operator">
          <a-button type="primary" icon="plus">添加仓库组</a-button>
        </div>
        <a-table
          bordered
          :columns="groupColumns"
          :dataSource="registryGroupData"
          rowKey="GroupId"
          :pagination="{showSizeChanger: true, showQuickJumper: true,current:groupPageIndex, pageSize: groupPageSize, total: groupTotalCount ,onChange:getRegistryGroupPageList, onShowSizeChange:changeRegistryGroupPageSize}">
          <a slot="name" slot-scope="text,record" href="javascript:;" @click="asyncHarborList(record)">{{ text }}</a>
          <span slot="action" slot-scope="text, record">
            <a @click="viewItemData(record)">详情</a>
          </span>
        </a-table>
        <a-drawer
          title="远程镜像仓库列表"
          :width="980"
          @close="onRegistryClose"
          :visible="showRegistry"
          :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
        >
          <template>
            <a-table
              bordered
              :columns="registryColumns"
              :dataSource="registryData"
              rowKey="ImageId"
              :pagination="{showSizeChanger: true, showQuickJumper: true,current:registryPageIndex, pageSize: registryPageSize, total: registryTotalCount ,onChange:getRegistryPageList, onShowSizeChange:changeRegistryPageSize}">
              <a slot="name" slot-scope="text" href="javascript:;">{{ text }}</a>
              <a slot="regirtryUrl" slot-scope="text,record" href="javascript:;">{{ record.Access }}/{{ record.Name }}</a>
              <span slot="action" slot-scope="text, record">
                <a @click="viewItemData(record)">删除</a>
              </span>
            </a-table>
          </template>
        </a-drawer>
      </template>
    </a-drawer>
  </a-card>
</template>

<script>
import STable from '@/components/table/'
import registryFetch from '@/api/registry'

export default {
  name: 'RegistryList',
  components: {
    STable
  },
  data () {
    return {
      form: this.$form.createForm(this),
      keywords: '',
      advanced: false,
      // 表头
      columns: [
        {
          title: '环境名称',
          dataIndex: 'Entname'
        },
        {
          title: '仓库名称',
          dataIndex: 'Name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '域名',
          dataIndex: 'ServerDomain'
        },
        {
          title: '所属集群',
          dataIndex: 'ClusterName'
        },
        {
          title: '创建时间',
          dataIndex: 'CreateTime'
        },
        {
          title: '访问方式',
          dataIndex: 'Access'
        },
        {
          title: '状态',
          dataIndex: 'Status'
        },
        {
          title: '操作',
          dataIndex: 'ServerId',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      registryServerData: [],

      // 镜像组
      groupColumns: [
        {
          title: '仓库组名称',
          dataIndex: 'GroupName',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '所属集群',
          dataIndex: 'ClusterName'
        },
        {
          title: '所属仓库',
          dataIndex: 'ServerDomain'
        },
        {
          title: '镜像数量',
          dataIndex: 'ImageNumber'
        },
        {
          title: 'tag数量',
          dataIndex: 'TagNumber'
        },
        {
          title: '总大小',
          dataIndex: 'SizeTotle'
        },
        {
          title: '访问级别',
          dataIndex: 'GroupType'
        },
        {
          title: '更新时间',
          dataIndex: 'LastModifyTime'
        },
        {
          title: '操作',
          dataIndex: 'GroupId',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      registryGroupData: [],
      showRegistryGroup: false,
      groupPageSize: 10,
      groupPageIndex: 1,
      groupTotalCount: 0,

      registryColumns: [
        {
          title: '名称',
          dataIndex: 'Name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '下载量',
          dataIndex: 'Download'
        },
        {
          title: '标签数',
          dataIndex: 'TagNumber'
        },
        {
          title: '镜像层数',
          dataIndex: 'LayersNumber'
        },
        {
          title: '镜像大小',
          dataIndex: 'Size'
        },
        {
          title: '镜像地址',
          dataIndex: 'LastModifyTime',
          scopedSlots: { customRender: 'regirtryUrl' }
        },
        {
          title: '操作',
          dataIndex: 'ImageId',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      registryData: [],
      showRegistry: false,
      registryPageSize: 10,
      registryPageIndex: 1,
      registryTotalCount: 0,

      chooseClusterName: '',
      chooseGroupName: ''
    }
  },
  created () {
    const self = this
    self.initRegistryServer()
  },
  methods: {
    initRegistryServer () {
      const self = this
      registryFetch.getRegistryServer(self.keywords)
        .then(res => {
          if (res.status === 200) {
            self.registryServerData = [...res.result]
          }
        })
    },
    initRegistryGroup () {
      const self = this
      registryFetch.getRegistryGroupList(self.groupPageIndex, self.groupPageSize)
        .then(res => {
          if (res.status === 200) {
            const result = res.result
            self.registryGroupData = [...result.data]
            self.groupTotalCount = result.totalCount
            self.showRegistryGroup = true
          }
        })
    },
    onRegistryGroupClose () {
      const self = this
      self.showRegistryGroup = false
    },
    getRegistryGroupPageList (page) {
      const self = this
      self.groupPageIndex = page
      self.initRegistryGroup()
    },
    changeRegistryGroupPageSize (page, size) {
      const self = this
      self.groupPageIndex = 1
      self.groupPageSize = size
      self.initRegistryGroup()
    },
    asyncHarborList (record) {
      const self = this
      self.chooseClusterName = record.ClusterName
      self.chooseGroupName = record.GroupName
      self.initHarborRegistryList()
    },
    initHarborRegistryList () {
      const self = this
      registryFetch.getHarborRegistryList(self.registryPageIndex, self.registryPageSize, self.chooseGroupName, self.chooseClusterName)
        .then(res => {
          if (res.status === 200) {
            const result = res.result
            self.registryData = [...result.data]
            self.registryTotalCount = result.totalCount
            self.showRegistry = true
          }
        })
    },
    getRegistryPageList (page) {
      const self = this
      self.registryPageIndex = page
      self.initHarborRegistryList()
    },
    changeRegistryPageSize (page, size) {
      const self = this
      self.registryPageIndex = 1
      self.registryPageSize = size
      self.initHarborRegistryList()
    },
    onRegistryClose () {
      const self = this
      self.showRegistry = false
    }
  }
}
</script>
<style scoped>
.table-operator{
  margin-bottom:10px;
}
</style>
