<template>
  <div class="card-list" ref="content">
    <a-list
      :grid="{gutter: 24, lg: 4, md: 2, sm: 1, xs: 1}"
      :dataSource="dataSource"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <template v-if="item === null">
          <a-button class="new-btn" type="dashed" @click="showDrawer">
            <a-icon type="plus"/>
            新增集群
          </a-button>
          <a-drawer
            title="创建群集"
            :width="720"
            @close="onClose"
            :visible="visible"
            :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
          >
            <a-form :form="form" layout="vertical" >
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="群集名称">
                    <a-input
                      v-decorator="['name', {
                        rules: [{ required: true, message: '请输入群集名称' }]
                      }]"
                      placeholder="必须为全英文"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="类型">
                    <a-select
                      v-decorator="['cluetertype', {
                        rules: [{ required: true, message: '请选择群集类型' }]
                      }]"
                      placeholder="请选择群集类型"
                    >
                      <a-select-option key="Standard" value="Standard">Standard</a-select-option>
                      <a-select-option key="AKS" value="AKS">AKS</a-select-option>
                      <a-select-option key="ACK" disabled="true" value="ACK">ACK</a-select-option>
                      <a-select-option key="TKE" disabled="true" value="TKE">TKE</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="显示名称">
                    <a-input
                      v-decorator="['name', {
                        rules: [{ required: true, message: '请输入显示名称' }]
                      }]"
                      placeholder="集群描述"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="访问端口">
                    <a-input
                      v-decorator="['ApiPort', {
                        rules: [{ required: true, message: '请输入端口号' }]
                      }]"
                      placeholder="请选择群集类型"
                    />
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Master's IP">
                    <a-input
                      v-decorator="['masterip', {
                        rules: [{ required: true, message: '请输入主节点主机名或IP' }]
                      }]"
                      placeholder="主机名或IP"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="域名">
                    <a-input
                      v-decorator="['domainname', {
                        rules: [{ required: true, message: '请输入域名' }]
                      }]"
                      placeholder="集群访问域名"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item label="ca证书公钥文件">
                    <a-textarea
                      v-decorator="['capubkey', {
                        rules: [{ required: true, message: '请输入CA公钥内容' }]
                      }]"
                      :rows="4"
                      placeholder="CA 公钥文件,CA.pem,路径/etc/kubernetes/ssl"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item label="node证书私钥文件">
                    <a-textarea
                      v-decorator="['nodeprivkey', {
                        rules: [{ required: true, message: '请输入NODE公钥内容' }]
                      }]"
                      :rows="4"
                      placeholder="NODE 私钥文件,worker-key.pem或admin-key.pem,路径/etc/kubernetes/ssl"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item label="node证书公钥文件">
                    <a-textarea
                      v-decorator="['nodepubkey', {
                        rules: [{ required: true, message: '请输入NODE公钥内容' }]
                      }]"
                      :rows="4"
                      placeholder="NODE 公钥文件,worker.pem或admin.pem,路径/etc/kubernetes/ssl"
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
        </template>
        <template v-else>
          <a-card :hoverable="true">
            <a-card-meta>
              <div style="margin-bottom: 3px" slot="title">{{ item.ClusterAlias }}</div>
              <a-avatar class="card-avatar" slot="avatar" src="/clusterlogo.png" size="large"/>
              <div class="meta-content" slot="description">
                <a-row>
                  <a-col :span="12"><a>{{ item.ClusterName }}</a></a-col>
                  <a-col :span="12">
                    {{ item.ClusterType }}
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
                  </a-col>
                </a-row>
              </div>
            </a-card-meta>
            <template class="ant-card-actions" slot="actions">
              <a @click="showDetail(item)">查看</a>
              <a type="danger">删除</a>
            </template>
            <div class="">
              <cluster-card-info :node-num="item.Nodes" :service-num="item.Services" :cpu-num="item.CpuNum" :mem-num="item.MemSize"></cluster-card-info>
            </div>
          </a-card>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { getClusterList } from '@/api/cluster'
import ClusterCardInfo from './components/ClusterCardInfo'
const dataSource = []
dataSource.push(null)
getClusterList()
  .then(res => {
    var cs = res.result
    console.log(cs)
    for (let i = 0; i < cs.length; i++) {
      dataSource.push(cs[i])
    }
  })

export default {
  name: 'ClusterList',
  components: {
    ClusterCardInfo
  },
  data () {
    return {
      // description: '段落示意：蚂蚁金服务设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态， 提供跨越设计与开发的体验解决方案。',
      // linkList: [
      //   { icon: 'rocket', href: '#', title: '快速开始' },
      //   { icon: 'info-circle-o', href: '#', title: '产品简介' },
      //   { icon: 'file-text', href: '#', title: '产品文档' }
      // ],
      // extraImage: 'https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png',
      form: this.$form.createForm(this),
      visible: false,
      dataSource
    }
  },
  methods: {
    showDetail (pam) {
      this.$router.push('/base/clusterdetail/' + pam.ClusterName)
    },
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
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
    height: 217px;
  }

  .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    // height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
</style>
