<template>
  <div class="search-content">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'ServiceDetailLayout',
  data () {
    return {
      tabs: {
        items: [
          {
            key: '1',
            title: '文章'
          },
          {
            key: '2',
            title: '项目'
          },
          {
            key: '3',
            title: '应用'
          }
        ],
        active: () => {
          // switch (this.$route.path) {
          //   case '/application/service/servicedetail/22':
          //     return '1'
          //   case '/list/search/project':
          //     return '2'
          //   case '/list/search/application':
          //     return '3'
          //   default:
          //     return '1'
          // }
        },
        callback: (key) => {
          // switch (key) {
          //   case '1':
          //     this.$router.push('/application/servicedetail/22')
          //     break
          //   case '2':
          //     this.$router.push('/list/search/project')
          //     break
          //   case '3':
          //     this.$router.push('/list/search/application')
          //     break
          //   default:
          //     this.$router.push('/workplace')
          // }
        }
      },
      search: true
    }
  },
  computed: {

  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  .search-head{
    background-color: #fff;
    margin: -25px -24px -24px;
    .search-input{
      text-align: center;
      margin-bottom: 16px;
    }
  }
  .search-content{
    margin-top: 48px;
  }
</style>
