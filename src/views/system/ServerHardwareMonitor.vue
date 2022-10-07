<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.Title) }}</span>
      </div>
      <div>
        <el-row>
          <el-col :span="12">
            <div>
              <el-divider content-position="left">
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.HostName) }}
              </el-divider>
              <span class="el-span"><el-tag type="info" effect="dark">{{ hostName }}</el-tag></span>
              <el-divider content-position="left">
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.Windows) }}
              </el-divider>
              <span class="el-span"><el-tag type="info" effect="dark">{{ windows }}</el-tag></span>
              <el-divider content-position="left">
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.ComputerArchitecture) }}
              </el-divider>
              <span class="el-span"><el-tag type="info" effect="dark">{{ processArchitecture }}</el-tag></span>
              <el-divider content-position="left">
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.OSDescription) }}
              </el-divider>
              <span class="el-span"><el-tag type="info" effect="dark">{{ osDescription }}</el-tag></span>
              <el-divider content-position="left">
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.OSArchitecture) }}
              </el-divider>
              <span class="el-span"><el-tag type="info" effect="dark">{{ osArchitecture }}</el-tag></span>
              <el-divider content-position="left">
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.FrameworkDescription) }}
              </el-divider>
              <span class="el-span"><el-tag type="info" effect="dark">{{ frameworkDescription }}</el-tag></span>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-divider content-position="left">
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.CPUCount) }}
              </el-divider>
              <span class="el-span"><el-tag type="info" effect="dark">{{ cpuCount }}</el-tag></span>
              <el-divider content-position="left">
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.CPUCoreCount) }}
              </el-divider>
              <span class="el-span"><el-tag type="info" effect="dark">{{ cpuCore }}</el-tag></span>
              <el-divider content-position="left">
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.CPULoad) }}
              </el-divider>
              <span class="el-span"><el-tag type="info" effect="dark">{{ cpuLoad }}</el-tag></span>
              <el-divider content-position="left">
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.CPUTemperature) }}
              </el-divider>
              <span class="el-span"><el-tag type="info" effect="dark">{{ cpuTemperature }}</el-tag></span>
              <el-divider content-position="left">
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.CPUProcessBit) }}
              </el-divider>
              <span class="el-span"><el-tag type="info" effect="dark">{{ is64BitProcess }}</el-tag></span>
              <el-divider content-position="left">
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.CPUProcessArchitecture) }}
              </el-divider>
              <span class="el-span"><el-tag type="info" effect="dark">{{ processArchitecture }}</el-tag></span>
            </div>
          </el-col>
        </el-row>
        <br>
        <div id="line" :style="{width: '650px', height: '300px',float:'left'}" />
        <div id="pie" :style="{width: '300px', height: '300px',float:'left'}" />
        <div>
          <br>
          <br>
          <br>
          <br>
          <el-progress type="circle" :style="{paddingLeft:'50px'}" :percentage="this.ramInfo.memoryUsage" />
          <table>
            <tr align="center" style="height: 30px;">
              <td>{{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.MemorySize) }}：</td>
              <td>{{ ramInfo.physicalMemory }}GB，</td>
              <td>{{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.AvailableMemorySize) }}：</td>
              <td>{{ ramInfo.memoryAvailable }}GB</td>
            </tr>
          </table>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.Storage) }}</span>
      </div>
      <div>{{ BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.LogicalDrives) }}：
        {{ logicalDrives }}
      </div>
      <br>
      <div v-for="item in diskInfo" :key="item.serialNumber" class="text item">
        {{
          BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.SerialNumber) + '：' + item.serialNumber + '，' +
            BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.Model) + '：' + item.model + '，' +
            BusinessLanguage.GetMenuName(BusinessLanguage.ServerMonitor.StorageSize) + '：'
            + (item.total / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
        }}
      </div>
    </el-card>
  </div>
</template>

<script>

import * as echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme

export default {
  name: 'ServerHardwareMonitor',
  data() {
    return {
      timer: null,
      windows: null,
      hostName: null,
      osDescription: null,
      osArchitecture: null,
      is64BitOperatingSystem: null,
      frameworkDescription: null,
      processArchitecture: null,
      is64BitProcess: null,
      cpuCount: null,
      cpuCore: null,
      cpuLoad: null,
      cpuTemperature: null,
      ramInfo:
        {
          memoryAvailable: 0,
          memoryUsage: 0,
          physicalMemory: 0
        },
      logicalDrives: null,
      diskInfo: null,
      option: {
        title: {
          text: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.ServerMonitor.CPULoad),
          subtext: '',
          left: 'center'
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [0],
            type: 'line'
          }
        ]
      },
      line: null
    }
  },
  watch: {},
  created() {
  },
  mounted() {
    this.queryHardwareInfo()
    this.initLine()
    this.timer = window.setInterval(() => {
      setTimeout(() => {
        this.queryHardwareInfo()
      }, 0)
    }, 10000)
  },
  destroyed() {
    window.clearInterval(this.timer)
  },
  methods: {
    queryHardwareInfo: function() {
      const url = 'ServerHardwareMonitor/Get'
      this.RuYiAdmin.Get(url, null).then(response => {
        // console.log(response.object)
        this.windows = response.object.windows === true ? 'YES' : 'NO'
        this.hostName = response.object.hostName
        this.osDescription = response.object.osDescription
        this.osArchitecture = response.object.osArchitecture
        this.is64BitOperatingSystem = response.object.is64BitOperatingSystem
        this.frameworkDescription = response.object.frameworkDescription
        this.processArchitecture = response.object.processArchitecture
        this.is64BitProcess = response.object.is64BitProcess === true ? '64' : '32'
        this.cpuCount = response.object.cpuCount
        this.cpuCore = response.object.cpuCore
        this.cpuLoad = response.object.cpuLoad.toFixed(2) + '%'
        this.option.series[0].data.push(response.object.cpuLoad)
        this.line.setOption(this.option)
        this.cpuTemperature = response.object.cpuTemperature + '℃'
        this.ramInfo.memoryAvailable = (response.object.ramInfo.memoryAvailable / (1024 * 1024 * 1024)).toFixed(2)
        this.ramInfo.memoryUsage = parseFloat(response.object.ramInfo.memoryUsage.toFixed(2))
        this.ramInfo.physicalMemory = (response.object.ramInfo.physicalMemory / (1024 * 1024 * 1024)).toFixed(2)
        this.initPie(this.ramInfo.physicalMemory, this.ramInfo.memoryAvailable)
        this.logicalDrives = response.object.logicalDrives.toString()
        this.diskInfo = response.object.diskInfo
      })
    },
    initPie: function(physicalMemory, memoryAvailable) {
      const chartDom = document.getElementById('pie')
      const myChart = echarts.init(chartDom, 'macarons')
      const option = {
        title: {
          text: '',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.ServerMonitor.StorageSize),
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: physicalMemory,
                name: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.ServerMonitor.MemorySize)
              },
              {
                value: memoryAvailable,
                name: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.ServerMonitor.AvailableMemorySize)
              }
            ]
          }
        ]
      }
      option && myChart.setOption(option)
    },
    initLine: function() {
      const chartDom = document.getElementById('line')
      this.line = echarts.init(chartDom, 'macarons')
      const option = this.option
      option && this.line.setOption(option)
    }
  }
}
</script>

<style scoped>
.el-span {
  margin-left: 50px;
}
</style>
