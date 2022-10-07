<template>
  <div id="dataViewer">
    <dataview />
  </div>
</template>

<script>
import $ from 'jquery'
import dataview from '@/components/DataView/index.vue'

export default {
  name: 'DataViewer',
  components: {
    dataview
  },
  data() {
    return {}
  },
  mounted() {
    $('.sidebar-container').attr({ style: 'display:none;' })
    $('.handle-button').attr({ style: 'display:none;' })
  }
}
</script>

<style lang="less">

#dataViewer {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
