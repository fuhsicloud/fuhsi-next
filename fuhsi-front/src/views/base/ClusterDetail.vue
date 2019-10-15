<template>
  <page-layout :title="clusterDetail.ClusterAlias" logo="/clusterlogo.png">

    <detail-list slot="headerContent" size="small" :col="2" class="detail-layout">
      <detail-list-item term="群集类型">{{ clusterDetail.ClusterType }}
        <a-tooltip trigger="hover" placement="right">
          <template slot="title">
            <div style="color:lightgray;font-size:12px">
              <p><span style="color:white;font-size:12px">Standard：</span>基于开源Kubernetes构建</p>
              <p><span style="color:white;font-size:12px">AKS：</span>基于Azure PaaS Kubernetes构建</p>
              <p><span style="color:red;font-size:12px">ACK：</span>基于阿里云 PaaS Kubernetes构建</p>
              <p><span style="color:red;font-size:12px">TCE：</span>基于腾讯云 PaaS Kubernetes构建</p>
            </div>
          </template>
          <a-icon type="question-circle" ></a-icon>
        </a-tooltip>
      </detail-list-item>
      <detail-list-item term="集群标识"><a>{{ clusterDetail.ClusterName }}</a></detail-list-item>
      <detail-list-item term="创建时间">{{ clusterDetail.CreateTime }}</detail-list-item>
      <detail-list-item term="创建人">{{ clusterDetail.CreateUser }}</detail-list-item>
      <!-- <detail-list-item term="备注">{{ clusterDetail.CreateTime }}</detail-list-item> -->
    </detail-list>
    <a-row slot="extra" class="status-list">
      <a-col :xs="12" :sm="12">
        <div class="text">运行中</div>
        <div class="heading">
          <a-icon type="sync" :style="{ fontSize: '28px' }" spin class="running primary"></a-icon>
        </div>
      </a-col>
    </a-row>

    <!-- actions -->
    <template slot="action">
      <a-button-group style="margin-right: 4px;">
        <a-button>编辑</a-button>
        <a-button>删除</a-button>
        <!-- <a-button><a-icon type="ellipsis"/></a-button> -->
      </a-button-group>
      <!-- <a-button type="primary" >主操作</a-button> -->
    </template>

    <a-card >
      <a-row>
        <a-col :xs="8" :sm="8" v-if="showChart">
          <liquid name="liquid" :height="100" :width="100" :data="cpuAndMem" :scale="scale" ></liquid>
        </a-col>
        <a-col :xs="16" :sm="16">
        </a-col>
      </a-row>
    </a-card>

    <!-- 操作 -->
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      :tabList="tabList"
      :activeTabKey="activeTabKey"
      @tabChange="(key) => {this.activeTabKey = key}"
    >
      <a-row>
        <a-col :xs="24" :sm="24" v-if="activeTabKey === '1'">
          <a-button type="primary" icon="plus" @click="handleAddHost()">添加主机</a-button>
          <a-drawer
            title="添加主机"
            :width="720"
            @close="onAddHostPanelClose"
            :visible="showAddHostPanel"
            :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
          >
            <a-form :form="form" layout="vertical" >
              <a-row :gutter="12">
                <a-col :span="24">
                  <a-form-item label="群集">
                    <a-input
                      disabled
                      v-decorator="['clusterName', {
                        rules: [{ required: true, message: '请输入群集名称' }],
                        initialValue: clusterName
                      }]"
                      placeholder="必须为全英文"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="12">
                <a-col :span="24">
                  <a-form-item label="主机IP">
                    <a-input
                      v-decorator="['hostip', {
                        rules: [{ required: true, message: '请输入主机名' }]
                      }]"
                      placeholder="主机IP"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="12">
                <a-col :span="24">
                  <a-form-item label="主机类型">
                    <a-select
                      v-decorator="['hosttype', {
                        rules: [{ required: true, message: '请选择主机类型' }]
                      }]"
                      placeholder="请选择群集类型"
                    >
                      <a-select-option key="master" value="master">master</a-select-option>
                      <a-select-option key="slave" value="slave">slave</a-select-option>
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
              <a-button
                :style="{marginRight: '8px'}"
                @click="onAddHostPanelClose"
              >
                Cancel
              </a-button>
              <a-button @click="onAddHostPanelClose" type="primary">Submit</a-button>
            </div>
          </a-drawer>
          <a-table
            rowKey="HostId"
            :columns="operationColumns"
            :dataSource="operation1"
            :pagination="false"
          >
            <template
              slot="status"
              slot-scope="status">
              <a-badge :status="status | statusTypeFilter" :text="status | statusFilter"/>
            </template>
          </a-table>
        </a-col>
      </a-row>

      <a-table
        v-if="activeTabKey === '2'"
        rowKey="HostId"
        :columns="operationColumns"
        :dataSource="operation2"
        :pagination="false"
      >
        <template
          slot="status"
          slot-scope="status">
          <a-badge :status="status | statusTypeFilter" :text="status | statusFilter"/>
        </template>
      </a-table>
      <a-table
        v-if="activeTabKey === '3'"
        rowKey="HostId"
        :columns="operationColumns"
        :dataSource="operation3"
        :pagination="false"
      >
        <template
          slot="status"
          slot-scope="status">
          <a-badge :status="status | statusTypeFilter" :text="status | statusFilter"/>
        </template>
      </a-table>
      <a-table
        v-if="activeTabKey === '4'"
        rowKey="HostId"
        :columns="operationColumns"
        :dataSource="operation4"
        :pagination="false"
      >
        <template
          slot="status"
          slot-scope="status">
          <a-badge :status="status | statusTypeFilter" :text="status | statusFilter"/>
        </template>
      </a-table>
    </a-card>

  </page-layout>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import PageLayout from '@/components/page/PageLayout'
import DetailList from '@/components/tools/DetailList'
import Liquid from '@/components/chart/Liquid'
import { getClusterDetail, getClusterHosts } from '@/api/cluster'

const DetailListItem = DetailList.Item

export default {
  name: 'Advanced',
  components: {
    PageLayout,
    DetailList,
    DetailListItem,
    Liquid
  },
  mixins: [mixinDevice],
  data () {
    var name = this.$route.params.name
    console.log(name)
    return {
      clusterName: name,
      showAddHostPanel: false,
      showChart: false,
      clusterDetail: {},
      form: this.$form.createForm(this),
      scale: [{
        dataKey: 'value',
        min: 0,
        max: 100
      }],
      cpuAndMem: [],
      tabList: [
        {
          key: '1',
          tab: '主机'
        },
        {
          key: '2',
          tab: '插件信息'
        },
        {
          key: '3',
          tab: '监控'
        },
        {
          key: '4',
          tab: '日志'
        }
      ],
      activeTabKey: '1',

      operationColumns: [
        {
          title: '主机IP',
          dataIndex: 'HostIp',
          key: 'HostIp'
        },
        {
          title: '主机标签',
          dataIndex: 'HostLabel',
          key: 'HostLabel'
        },
        {
          title: '状态',
          dataIndex: 'Status',
          key: 'Status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: 'Pod',
          dataIndex: 'PodNum',
          key: 'PodNum'
        },
        {
          title: 'Cpu',
          dataIndex: 'CpuNum',
          key: 'CpuNum'
        },
        {
          title: '内存大小',
          dataIndex: 'MemSize',
          key: 'MemSize'
        },
        {
          title: 'Images',
          dataIndex: 'ImageNum',
          key: 'ImageNum'
        },
        {
          title: '版本',
          dataIndex: 'OsVersion',
          key: 'OsVersion'
        },
        {
          title: '主机类型',
          dataIndex: 'HostType',
          key: 'HostType'
        }
        // ,
        // {
        //   title: '创建时间',
        //   dataIndex: 'ImageNum',
        //   key: 'ImageNum'
        // }
      ],
      operation1: [],
      operation2: [],
      operation3: [],
      operation4: []
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        '运行中': status,
        '不可调度': status
      }
      return statusMap[status]
    },
    statusTypeFilter (type) {
      const statusTypeMap = {
        '运行中': 'success',
        '不可调度': 'error'
      }
      return statusTypeMap[type]
    }
  },
  created () {
    console.log('222')
    this.getClusterDetail()
    this.getClusterHosts()
  },
  mounted () {
    console.log(this.$route.params.name)
    this.$nextTick(() => { this.showChart = true })
  },
  methods: {
    handleAddHost () {
      this.showAddHostPanel = true
    },
    onAddHostPanelClose () {
      this.showAddHostPanel = false
    },
    getClusterDetail () {
      var that = this
      getClusterDetail(this.$route.params.name)
        .then(res => {
          var info = res.result
          console.log('1111')
          console.log(info)
          that.cpuAndMem.push({ name: 'CPU', transfer: 'CPU', value: info.CpuUsePercent })
          that.cpuAndMem.push({ name: '内存', transfer: '内存', value: info.MemUsePercent })

          that.clusterDetail = info
        })
    },
    getClusterHosts () {
      var that = this
      getClusterHosts('', this.$route.params.name)
        .then(res => {
          var info = res.result.data
          console.log('Hosts')
          console.log(info)
          that.operation1 = info
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
    text-align: center;
    color: #1a78c4;// rgba(0, 0, 0, .45);
  }

  .heading {
    text-align: center;
    color: #1a78c4;// rgba(0, 0, 0, .85);
    font-size: 20px;
  }

  .running {
    animation:rotating 1.2s linear infinite;
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
