<!--
 * @Author: maizi 851620279@qq.com
 * @Date: 2022-10-08 02:20:47
 * @LastEditors: maizi 851620279@qq.com
 * @LastEditTime: 2023-03-30 23:09:24
 * @FilePath: \NGProject\src\views\dashboard\admin\components\PieChart.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '460px'
    }
  },
  data() {
    return {
      chart: null,
      ytName: [],
      ytCount: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      var cuttentThis = this
      this.RuYiAdmin.PostData('Asset/GetAssetsYT').then(response => {
        this.chart = echarts.init(this.$el, 'macarons')
        Object.assign(cuttentThis, response.object)
        var yt = []
        for (var i = 0; i < cuttentThis.ytName.length; i++) {
          yt.push({ 'name': cuttentThis.ytName[i], 'value': cuttentThis.ytCount[i] })
        }
        cuttentThis.ytCount = yt
        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          title: {
            text: '资产用途分类',
            left: 'center'
          },

          legend: {
            left: 'center',
            bottom: '40',
            data: cuttentThis.ytCount
          },
          series: [
            {
              name: '资产用途分类',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '45%'],
              data: yt,
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      })
    }
  }
}
</script>
