<template>
  <div class="clusterCardInfo">
    <div>
      <p>节点</p>
      <p>{{ nodeNum }}</p>
    </div>
    <div>
      <p>服务</p>
      <p>{{ serviceNum }}</p>
    </div>
    <div>
      <p>CPU</p>
      <p>{{ cpuNum }}</p>
    </div>
    <div>
      <p>内存</p>
      <p>{{ memNum }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClusterCardInfo',
  props: {
    nodeNum: {
      type: [String, Number],
      default: 0
    },
    serviceNum: {
      type: [String, Number],
      default: 0
    },
    cpuNum: {
      type: [String, Number],
      default: 0
    },
    memNum: {
      type: [String, Number],
      default: 0
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
@import "~@/utils/utils.less";
.clusterCardInfo {
  .clearfix();
  margin-top: 16px;
  margin-left: 40px;
  & > div {
    position: relative;
    float: left;
    width: 25%;
    text-align: left;
    p {
      margin: 0;
      font-size: 24px;
      line-height: 32px;
    }
    p:first-child {
      margin-bottom: 4px;
      color: @text-color-secondary;
      font-size: 12px;
      line-height: 20px;
    }
  }
}
</style>
