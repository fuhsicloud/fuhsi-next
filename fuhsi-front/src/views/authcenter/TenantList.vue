<template>
  <div>
    <a-card style="margin-top: 24px" :bordered="false" title>
      <div slot="extra">
        <a-radio-group v-model="tenantStatus" buttonStyle="solid">
          <a-radio-button value="">全部</a-radio-button>
          <a-radio-button value="1">通过</a-radio-button>
          <a-radio-button value="-1">不通过</a-radio-button>
        </a-radio-group>
        <a-input-search style="margin-left: 16px; width: 272px;"/>
      </div>

      <div class="operate" @click="showMaskHandler">
        <a-button type="dashed" style="width: 100%" icon="plus">添加</a-button>
      </div>

      <a-list
        size="large"
        :pagination="{showSizeChanger: true, showQuickJumper: true,current:pageNo, pageSize: pageSize, total: totalCount ,onChange:getPageTenantList, onShowSizeChange:changePageSize}"
      >
        <a-list-item :key="index" v-for="(item, index) in data">
          <a-list-item-meta :description="item.Address">
            <a-avatar slot="avatar" size="large" shape="square" :src="item.Logo"/>
            <a slot="title">{{ item.TenantName }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a href="javascript:void(0)" @click="showTenantDetail(item.TenantId)">详情</a>
          </div>
          <div slot="actions">
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:void(0)" @click="initTenantInfo(item.TenantId)">编辑</a>
                </a-menu-item>
                <a-menu-item v-show="item.Status===0">
                  <a href="javascript:void(0)" @click="reviewTenantConfirm(item.TenantId)">审核</a>
                </a-menu-item>
                <a-menu-item v-show="item.Status===1">
                  <a href="javascript:void(0)" @click="showTenantClients(item.TenantCode)">环境</a>
                </a-menu-item>
              </a-menu>
              <a>更多
                <a-icon type="down"/>
              </a>
            </a-dropdown>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>{{ item.TenantCode }}</span>
              <p v-if="item.Status===0">{{ item.Status | statusFilter }}</p>
              <p style="color:red" v-else-if="item.Status===-1">{{ item.Status | statusFilter }}</p>
              <p style="color:#52c41a;" v-else-if="item.Status===1">{{ item.Status | statusFilter }}</p>
            </div>
            <div class="list-content-item">
              <span>{{ item.Contactor }}</span>
              <p>{{ item.Telephone }}</p>
            </div>
            <div class="list-content-item">
              <span>{{ item.Country }}</span>
              <p>{{ item.City }}</p>
            </div>
            <div class="list-content-item">
              <span>创建时间</span>
              <p>{{ item.CreateTime }}</p>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
    <a-drawer
      title="租户管理"
      :width="720"
      @close="onClose"
      :visible="maskShow"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <a-form :form="form" layout="vertical" hideRequiredMark>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="名称">
              <a-input v-model="tenantName" v-if="tenantId!==''" disabled/>
              <a-input v-model="tenantName" v-else/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="logo">
              <a-upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                :fileList="fileList"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div v-if="fileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="国家">
              <a-input v-model="country" v-if="tenantId!==''" disabled/>
              <a-input v-model="country" v-else/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="省份">
              <a-input v-model="province" v-if="tenantId!==''" disabled/>
              <a-input v-model="province" v-else/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="市区">
              <a-input v-model="city" v-if="tenantId!==''" disabled/>
              <a-input v-model="city" v-else/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="联系人">
              <a-input v-model="contactor" v-if="isDetail===1" disabled/>
              <a-input v-model="contactor" v-else/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="联系电话">
              <a-input v-model="telephone" v-if="isDetail===1" disabled/>
              <a-input v-model="telephone" v-else/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="20">
            <a-form-item label="地址">
              <a-textarea v-model="address" v-if="isDetail===1" disabled/>
              <a-textarea v-model="address" v-else/>
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
        v-show="isDetail!==1"
      >
        <a-button :style="{marginRight: '8px'}" @click="onClose">取消</a-button>
        <a-button type="primary" @click="saveTenantHandler" :loading="btnLoading">保存</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import HeadInfo from '@/components/tools/HeadInfo'
import tenantFetch from '@/api/tenant.js'

export default {
  name: 'TenantList',
  components: {
    HeadInfo
  },
  data () {
    return {
      data: [],
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,

      form: this.$form.createForm(this),

      tenantName: '',
      tenantLogo: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
      address: '',
      country: '',
      province: '',
      city: '',
      contactor: '',
      telephone: '',
      tenantStatus: '',

      tenantId: '',

      btnLoading: false,
      maskShow: false,

      isDetail: 0,

      previewVisible: false,
      previewImage: '',
      fileList: [{
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png'
      }]
    }
  },
  created () {
    const self = this
    self.initTenantList()
  },
  methods: {
    initTenantList () {
      const self = this
      const params = {
        pageNo: self.pageNo,
        pageSize: self.pageSize
      }
      if (self.tenantStatus !== '') {
        params['Status'] = Number(self.tenantStatus)
      }
      tenantFetch.QueryTenantList(params)
        .then(res => {
          if (res.status === 200) {
            const result = res.result
            self.data = result.data
            self.totalCount = result.totalCount
          }
        })
    },
    getPageTenantList (page) {
      const self = this
      self.pageNo = page
      self.initTenantList()
    },
    changePageSize (page, size) {
      const self = this
      self.pageNo = 1
      self.pageSize = size
      self.initTenantList()
    },
    showMaskHandler () {
      const self = this
      self.maskShow = true
    },
    onClose () {
      const self = this
      self.maskShow = false
    },
    checkVerity () {
      const self = this
      if (self.tenantName === '') {
        self.$message.error('请输入租户名称')
        return 1
      }
      if (self.tenantLogo === '') {
        self.$message.error('请输入问卷Code')
        return 1
      }
      if (self.contactor === '') {
        self.$message.error('请输入联系人')
        return 1
      }
      if (self.telephone === '') {
        self.$message.error('请输入联系电话')
        return 1
      }
      if (self.address === '') {
        self.$message.error('请输入详细地址')
        return 1
      }
    },
    showTenantDetail (tenantId) {
      const self = this
      self.isDetail = 1
      self.initTenantInfo(tenantId)
    },
    initTenantInfo (tenantId) {
      const self = this
      self.tenantId = tenantId
      self.maskShow = true
      tenantFetch.QueryTenantInfo(self.tenantId)
        .then(res => {
          if (res.status === 200) {
            const result = res.result
            self.tenantName = result.TenantName
            self.tenantLogo = result.Logo
            self.province = result.Province
            self.country = result.Country
            self.city = result.City
            self.contactor = result.Contactor
            self.telephone = result.Telephone
            self.address = result.Address
          }
        })
    },
    saveTenantHandler () {
      const self = this
      self.btnLoading = true
      if (self.checkVerity() === 1) {
        self.btnLoading = false
        return false
      }
      if (self.tenantId === '') {
        self.addTenant()
      } else {
        self.modifyTenant()
      }
    },
    addTenant () {
      const self = this
      const param = {
        TenantName: self.tenantName,
        Country: self.country,
        Logo: self.tenantLogo,
        Province: self.province,
        City: self.city,
        Contactor: self.contactor,
        Telephone: self.telephone,
        Address: self.address,
        Status: 0
      }
      tenantFetch.AddTenant(param)
        .then(res => {
          if (res.status === 200) {
            self.maskShow = false
            self.$notification['success']({
              message: '成功通知',
              description: '租户创建成功'
            })
            self.initTenantList()
            self.btnLoading = false
          } else {
            self.maskShow = false
            self.$notification['error']({
              message: '错误通知',
              description: res.result
            })
            self.initTenantList()
            self.btnLoading = false
          }
        })
    },
    modifyTenant () {
      const self = this
      const param = {
        TenantId: self.TenantId,
        Contactor: self.contactor,
        Telephone: self.telephone,
        Address: self.address
      }
      tenantFetch.ModifyTenant(param)
        .then(res => {
          if (res.status === 200) {
            self.maskShow = false
            self.$notification['success']({
              message: '成功通知',
              description: '租户信息修改成功'
            })
            self.initTenantList()
            self.btnLoading = false
          } else {
            self.maskShow = false
            self.$notification['error']({
              message: '错误通知',
              description: res.result
            })
            self.initTenantList()
            self.btnLoading = false
          }
        })
    },
    reviewTenantConfirm (tenantId) {
      const self = this
      self.$confirm({
        title: '租户审核',
        content: '',
        okText: '通过',
        cancelText: '不通过',
        onOk () {
          self.reviewTenant(tenantId, 1)
        },
        onCancel () {
          self.reviewTenant(tenantId, -1)
        }
      })
    },
    reviewTenant (tenantId, status) {
      const self = this
      tenantFetch.TenantReview(tenantId, status)
        .then(res => {
          if (res.status === 200) {
            self.$notification['success']({
              message: '成功通知',
              description: '租户审核成功'
            })
          } else {
            self.$notification['error']({
              message: '结果通知',
              description: '租户审核成功'
            })
          }
          self.initTenantList()
        })
    },
    handleCancel () {
      const self = this
      self.previewVisible = false
    },
    handlePreview (file) {
      const self = this
      self.previewImage = file.url || file.thumbUrl
      self.previewVisible = true
    },
    handleChange ({ fileList }) {
      const self = this
      self.fileList = fileList
    },
    showTenantClients (tenantId) {
      const self = this
      self.$router.push({
        path: '/auth/tenants/clients',
        query: {
          code: tenantId
        }
      })
    }
  },
  watch: {
    maskShow (val) {
      const self = this
      if (!val) {
        self.tenantName = ''
        self.tenantLogo = ''
        self.telephone = ''
        self.contactor = ''
        self.country = ''
        self.province = ''
        self.city = ''
        self.address = ''
        self.tenantId = ''
        self.isDetail = 0
      }
    },
    tenantStatus (val) {
      const self = this
      self.pageNo = 1
      self.initTenantList()
    }
  },
  filters: {
    statusFilter (val) {
      if (val === 0) {
        return '未审核'
      } else if (val === -1) {
        return '不通过'
      } else if (val === 1) {
        return '通过'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ant-avatar-lg {
  width: 48px;
  height: 48px;
  line-height: 48px;
}

.list-content-item {
  color: rgba(0, 0, 0, 0.45);
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 48px;
  span {
    line-height: 20px;
  }
  p {
    margin-top: 4px;
    margin-bottom: 0;
    line-height: 22px;
  }
}
</style>
