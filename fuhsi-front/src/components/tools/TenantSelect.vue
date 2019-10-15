<template>
  <div class="tenant-select">
    <!-- <span style="font-family:bold">数据中心:</span> -->
    <a-select defaultValue="开发测试集群" style="width: 180px;color:#1890ff" @change="handleChange">
      <a-select-option v-for="item in clusters" :key="item.ClusterAlias" :value="item.ClusterAlias">{{ item.ClusterAlias }}</a-select-option>
      <a-select-option value="测试">测试</a-select-option>
    </a-select>
  </div>
</template>

<script>
import HeaderNotice from './HeaderNotice'
import { getClusterName } from '@/api/cluster'
// import { mapActions, mapGetters } from 'vuex'
// import { mapActions } from 'vuex'

export default {
  name: 'TenantSelect',
  components: {
    HeaderNotice
  },
  data () {
    return {
      clusters: []
    }
  },
  created () {
    // this.couponSelected = this.couponList[0].id
    this.getClusterName()
  },
  methods: {
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    getClusterName () {
      var that = this
      getClusterName()
        .then(res => {
          var cs = res.result
          console.log(cs)
          that.clusters = cs
        })
    }

  }
}
</script>

<style>
  .tenant-select {
    float: left;
    height: 100%;
  }
</style>
