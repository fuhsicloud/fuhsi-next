<template>
  <div class="card-list" ref="content">
    <a-list
      :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
      :dataSource="dataSource"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <template v-if="item === null">
          <a-button class="new-btn" type="dashed" @click="showDrawer">
            <a-icon type="plus"/>
            新增产品
          </a-button>
          <a-drawer
            title="Create a new account"
            :width="720"
            @close="onClose"
            :visible="visible"
            :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
          >
            <a-form :form="form" layout="vertical" hideRequiredMark>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Name">
                    <a-input
                      v-decorator="['name', {
                        rules: [{ required: true, message: 'Please enter user name' }]
                      }]"
                      placeholder="Please enter user name"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Url">
                    <a-input
                      v-decorator="['url', {
                        rules: [{ required: true, message: 'please enter url' }]
                      }]"
                      style="width: 100%"
                      addonBefore="http://"
                      addonAfter=".com"
                      placeholder="please enter url"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Owner">
                    <a-select
                      v-decorator="['owner', {
                        rules: [{ required: true, message: 'Please select an owner' }]
                      }]"
                      placeholder="Please a-s an owner"
                    >
                      <a-select-option value="xiao">Xiaoxiao Fu</a-select-option>
                      <a-select-option value="mao">Maomao Zhou</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Type">
                    <a-select
                      v-decorator="['type', {
                        rules: [{ required: true, message: 'Please choose the type' }]
                      }]"
                      placeholder="Please choose the type"
                    >
                      <a-select-option value="private">Private</a-select-option>
                      <a-select-option value="public">Public</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Approver">
                    <a-select
                      v-decorator="['approver', {
                        rules: [{ required: true, message: 'Please choose the approver' }]
                      }]"
                      placeholder="Please choose the approver"
                    >
                      <a-select-option value="jack">Jack Ma</a-select-option>
                      <a-select-option value="tom">Tom Liu</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="DateTime">
                    <a-date-picker
                      v-decorator="['dateTime', {
                        rules: [{ required: true, message: 'Please choose the dateTime' }]
                      }]"
                      style="width: 100%"
                      :getPopupContainer="trigger => trigger.parentNode"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item label="Description">
                    <a-textarea
                      v-decorator="['description', {
                        rules: [{ required: true, message: 'Please enter url description' }]
                      }]"
                      :rows="4"
                      placeholder="please enter url description"
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
              <div style="margin-bottom: 3px" slot="title">{{ item.title }}</div>
              <a-avatar class="card-avatar" slot="avatar" :src="item.avatar" size="large"/>
              <div class="meta-content" slot="description">{{ item.content }}</div>
            </a-card-meta>
            <template class="ant-card-actions" slot="actions">
              <a>操作一</a>
              <a>操作二</a>
            </template>
          </a-card>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>

const dataSource = []
dataSource.push(null)
for (let i = 0; i < 5; i++) {
  dataSource.push({
    title: 'Alipay',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
    content: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。'
  })
}

export default {
  name: 'CardList',
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
    height: 188px;
  }

  .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
</style>
