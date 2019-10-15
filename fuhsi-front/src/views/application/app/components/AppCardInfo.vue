<template>
  <div class="appCardInfo">
    <div>
      <p>节点</p>
      <p>{{ containerNum }}</p>
    </div>
    <div>
      <p>服务</p>
      <p>{{ serviceNum }}</p>
    </div>
    <div>
      <p>状态</p>
      <p>{{ statusStr }}</p>
    </div>
    <div>
      <p>创建于</p>
      <p>{{ createTime }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppCardInfo',
  props: {
    containerNum: {
      type: [String, Number],
      default: 0
    },
    serviceNum: {
      type: [String, Number],
      default: 0
    },
    statusStr: {
      type: [String, Number],
      default: 0
    },
    createTime: {
      type: [String, Number],
      default: 0
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
@import "~@/utils/utils.less";
.appCardInfo {
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
      font-size: 16px;
      color:#1a78c4;
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
