<template>
  <page-layout :avatar="avatar">
    <div slot="headerContent">
      <div class="title">{{ timeFix }}，{{ user.name }}<span class="welcome-text">，{{ welcome() }}</span></div>
      <div>前端工程师 | 蚂蚁金服 - 某某某事业群 - VUE平台</div>
    </div>
    <div slot="extra">
      <a-row class="more-info">
        <a-col :span="8">
          <head-info title="节点数" content="3" :center="false" :bordered="false"/>
        </a-col>
        <a-col :span="8">
          <head-info title="服务数量" content="15" :center="false" :bordered="false"/>
        </a-col>
        <a-col :span="8">
          <head-info title="Pod数量" content="21" :center="false" />
        </a-col>
      </a-row>
    </div>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px;"
            :bordered="false"
            title="管理中的集群"
            :body-style="{ padding: 0 }">
            <a slot="extra">全部集群</a>
            <div>
              <a-card-grid class="project-card-grid" v-for="item in clusterData" :key="item.ClusterId">
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <a>{{ item.ClusterAlias }}</a>
                    </div>
                    <div slot="description" class="card-description">
                      <div>集群类型:&nbsp;{{ item.ClusterType }}</div>
                      <div class="card-description-service">
                        <span>节点数:&nbsp;{{ item.Nodes }}</span>
                        <span>服务数:&nbsp;{{ item.Services }}</span>
                      </div>
                      <div class="card-description-service">
                        <span>cpu:&nbsp;{{ item.CpuNum }}(核)</span>
                        <span>内存:&nbsp;{{ item.MemSize }}G</span>
                      </div>
                    </div>
                  </a-card-meta>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>

          <a-card :loading="loading" title="动态" :bordered="false">
            <a-list>
              <a-list-item>
                <a-list-item-meta>
                  <a-avatar slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png" />
                  <div slot="title">
                    <span>admin</span>&nbsp;
                    在&nbsp;<a href="#">测试</a>&nbsp;
                    <span>修改</span>&nbsp;
                    <a href="#">集群</a>
                  </div>
                  <div slot="description">2018-05-12</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
          <a-card title="快速开始 / 便捷导航" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <div class="item-group">
              <a>应用管理</a>
              <a>服务管理</a>
              <a>容器管理</a>
              <a>应用商店</a>
              <a>构建项目</a>
              <a>流水线项目</a>
              <a>资源配额</a>
              <a-button size="small" type="primary" ghost icon="plus">添加</a-button>
            </div>
          </a-card>
          <a-card :loading="loading" title="团队" :bordered="false">
            <div class="members">
              <a-row>
                <a-col :span="12">
                  <a>
                    <a-avatar size="small" src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png" />
                    <span class="member">天正</span>
                  </a>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-layout>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapGetters } from 'vuex'

import PageLayout from '@/components/page/PageLayout'
import HeadInfo from '@/components/tools/HeadInfo'
import Radar from '@/components/chart/Radar'
import { getClusterList } from '@/api/cluster.js'

export default {
  name: 'Workplace',
  components: {
    PageLayout,
    HeadInfo,
    Radar
  },
  data () {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},
      loading: true,
      clusterData: []
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    const self = this
    self.user = self.userInfo
    self.avatar = self.userInfo.avatar
    self.queryClusterList()
  },
  mounted () {
  },
  methods: {
    ...mapGetters(['nickname', 'welcome']),
    queryClusterList () {
      const self = this
      getClusterList().then(res => {
        if (res.status === 200) {
          self.clusterData = [...res.result]
          self.loading = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }
    .card-description {
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
      overflow: hidden;
    }
    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }
      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }
    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;
      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }
      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

</style>
<style scoped>
.card-description {
  display:flex;
  flex-direction: column;
}
.card-description-service{
  display:flex;
  justify-content: space-between;
}
</style>
