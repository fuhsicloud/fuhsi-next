<template>
  <div>
    <v-chart
      :forceFit="forceFit"
      :height="height"
      :width="width"
      :data="data"
      :scale="scale"
      :padding="0">
      <v-tooltip />
      <v-interval
        :shape="['liquid-fill-gauge']"
        position="transfer*value"
        :color="color"
        :v-style="{
          lineWidth: 1,
          opacity: 0.75
        }"
        :tooltip="[
          'transfer*value',
          (transfer, value) => {
            return {
              name: transfer,
              value,
            };
          },
        ]"
      ></v-interval>
      <v-guide
        v-for="(row, index) in data"
        :key="index"
        type="text"
        :top="true"
        :position="{
          transfer: row.transfer,
          value: 45
        }"
        :content="row.value + '%'"
        :v-style="{
          fontSize: 28,
          textAlign: 'center',
          opacity: 0.75,
        }"
      />
    </v-chart>
  </div>
</template>

<script>
export default {
  name: 'Liquid',
  props: {
    forceFit: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: null
    },
    scale: {
      type: Array,
      default: null
    },
    color: {
      type: String,
      default: '#1890ff'
    }
  }
}
</script>

<style scoped>

</style>
