<template>
  <div class="card-list" ref="content">
    <a-list
      :grid="{gutter: 24, lg: 4, md: 2, sm: 1, xs: 1}"
      :dataSource="appList"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <template v-if="item === null">
          <a-button class="new-btn" type="dashed" @click="goCreateApp">
            <a-icon type="plus"/>
            新建应用
          </a-button>
          <a-drawer
            title="创建应用"
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
                      <a-select-option value="Kubernetes">Kubernetes</a-select-option>
                      <!-- <a-select-option value="mao">Maomao Zhou</a-select-option> -->
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
                        rules: [{ required: true, message: '请选择群集类型' }]
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
                        rules: [{ required: true, message: '请输入主节点IP' }]
                      }]"
                      placeholder="主节点IP"
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
              <div style="margin-bottom: 3px" slot="title">{{ item.AppName }}</div>
              <a-avatar class="card-avatar" slot="avatar" src="/app.png" size="large"/>
              <div class="meta-content" slot="description">
                <a-row>
                  <a-col :span="14"><a>{{ item.ClusterName }}</a></a-col>
                  <a-col :span="10">
                    {{ item.Entname }}
                  </a-col>
                </a-row>
              </div>
            </a-card-meta>
            <template class="ant-card-actions" slot="actions">
              <a @click="showDetail(item)">查看</a>
              <a type="danger">删除</a>
            </template>
            <div class="">
              <app-card-info :container-num="item.ContainerNumber" :service-num="(item.ServiceNumber - item.ServiceFail)+'/'+item.ServiceNumber" :status-str="item.Status" :create-time="item.CreateTime"></app-card-info>
            </div>
          </a-card>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { getAppList } from '@/api/application'
import AppCardInfo from './components/AppCardInfo'
export default {
  name: 'AppList',
  components: {
    AppCardInfo
  },
  data () {
    return {
      timer: null,
      form: this.$form.createForm(this),
      visible: false,
      appList: [null]
    }
  },
  created () {
    this.getAppList()
  },
  destroyed () {
    const self = this
    clearInterval(self.timer)
  },
  mounted () {
    const self = this
    self.addTimer()
  },
  methods: {
    showDetail (pam) {
      this.$router.push(`/application/appdetail/${pam.AppId}`)
    },
    goCreateApp () {
      this.$router.push(`/application/app/add`)
    },
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    getAppList () {
      var that = this
      getAppList()
        .then(res => {
          var cs = res.result
          that.appList = [null]
          for (let i = 0; i < cs.length; i++) {
            that.appList.push(cs[i])
          }
        })
    },
    addTimer () {
      const self = this
      if (self.timer) {
        clearInterval(self.timer)
      } else {
        self.timer = setInterval(() => {
          self.getAppList()
        }, 3000)
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
