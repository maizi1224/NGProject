<template>
  <div>
    <iframe
      id="mobsf"
      src=""
      style="overflow: auto;"
    />
  </div>
</template>

<script>
import defaultSettings from '@/settings'

export default {
  name: 'SystemWebAPI',
  data() {
    return {}
  },
  mounted() {
    /**
     * iframe-宽高自适应显示
     */
    function changeMobsfIframe() {
      const mobsf = document.getElementById('mobsf')
      mobsf.src = defaultSettings.apiBaseUrl + '/swagger/index.html'
      const deviceWidth = document.body.clientWidth
      const deviceHeight = document.body.clientHeight
      mobsf.style.width = (Number(deviceWidth) - 210) + 'px' // 数字是页面布局宽度差值
      mobsf.style.height = (Number(deviceHeight)) + 'px' // 数字是页面布局高度差
    }

    changeMobsfIframe()

    window.onresize = function() {
      changeMobsfIframe()
    }
  }
}
</script>

<style scoped>

</style>
