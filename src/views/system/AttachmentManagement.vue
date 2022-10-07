<template>
  <div v-if="ButtonPermission('attachment:query:list')" id="container" style="height: 620px;" />
</template>

<script>
import * as echarts from 'echarts'
import { btnPermission } from '@/utils/btn-permission'

require('echarts/theme/macarons') // echarts theme

export default {
  name: 'AttachmentManagement',
  data() {
    return {
      timer: null
    }
  },
  watch: {},
  created() {
  },
  mounted() {
    this.queryFileStatisticalInfo()
    this.timer = window.setInterval(() => {
      setTimeout(() => {
        this.queryFileStatisticalInfo()
      }, 0)
    }, 10000)
  },
  destroyed() {
    window.clearInterval(this.timer)
  },
  methods: {
    queryFileStatisticalInfo: function() {
      const url = 'AttachmentManagement/GetSysFileStatisticalInfo'
      this.RuYiAdmin.Get(url, null).then(response => {
        const dom = document.getElementById('container')
        const myChart = echarts.init(dom, 'macarons', {
          renderer: 'canvas',
          useDirtyRect: false
        })

        const option = {
          title: {
            text: '系统文件信息统计'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {},
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['临时文件', '审计日志', '业务附件', 'Debug文件', 'Error文件', 'Info文件', 'Warn文件', '总计']
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          series: [
            {
              name: '文件数量（个）',
              type: 'bar',
              data: [
                response.object.tempFilesLength,
                response.object.monitoringLogLength,
                response.object.businessAttachmentLength,
                response.object.debugLogLength,
                response.object.errorLogLength,
                response.object.infoLogLength,
                response.object.warnLogLength,
                response.object.tempFilesLength +
                response.object.monitoringLogLength +
                response.object.businessAttachmentLength +
                response.object.debugLogLength +
                response.object.errorLogLength +
                response.object.infoLogLength +
                response.object.warnLogLength
              ]
            },
            {
              name: '文件大小（MB）',
              type: 'bar',
              data: [
                response.object.tempFileSize.toFixed(2),
                response.object.monitoringLogSize.toFixed(2),
                response.object.businessAttachmentSize.toFixed(2),
                response.object.debugLogSize.toFixed(2),
                response.object.errorLogSize.toFixed(2),
                response.object.infoLogSize.toFixed(2),
                response.object.warnLogSize.toFixed(2),
                (response.object.tempFileSize +
                  response.object.monitoringLogSize +
                  response.object.businessAttachmentSize +
                  response.object.debugLogSize +
                  response.object.errorLogSize +
                  response.object.infoLogSize +
                  response.object.warnLogSize
                ).toFixed(2)
              ]
            }
          ]
        }

        if (option && typeof option === 'object') {
          myChart.setOption(option)
        }

        window.addEventListener('resize', myChart.resize)
      })
    },
    ButtonPermission: function(code) {
      return btnPermission(code)
    }
  }
}
</script>

<style scoped>

</style>
