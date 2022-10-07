<template>
  <div>
    <iframe
      id="pdfIframe"
      src="/RuYiAdmin开源项目系统使用手册（企业版）.pdf"
      style="position: absolute; top: 0px; left: 0px"
      frameborder="0"
      scrolling="auto"
      width="100%"
      @load="adjustIframe"
    />
  </div>
</template>
<script>

export default {
  name: 'SysDocument',
  data() {
    return {
    }
  },
  methods: {
    adjustIframe() {
      const ifm = document.getElementById('pdfIframe')
      ifm.height = document.documentElement.clientHeight - 86
    }
  }
}
</script>

<style>
</style>
