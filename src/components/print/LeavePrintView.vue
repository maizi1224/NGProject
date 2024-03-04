<template>
  <div id="print-html" ref="PrintView">
    <table style="height: 358px; width: 95%; margin-left: auto; margin-right: auto;border-collapse: collapse;" border="1px" cellpadding="0" cellspacing="0" bordercolor="#000000" bordercolordark="#000000">
      <caption style="padding: 13px 0; font-size: 22px; font-weight: inherit;">资产档案</caption>
      <tbody>
        <tr style=" text-align: center;">
          <th style="text-align: center; vertical-align: middle;word-wrap:break-word;">档案号</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.assetsCode?infoForm.assetsCode:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">名称原用途</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.assetsName?infoForm.assetsName:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">资产地址</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.assetsAdress?infoForm.assetsAdress:'' }}</td>
        </tr>
        <tr style=" text-align: center;">
          <th style="text-align: center; vertical-align: middle;word-wrap:break-word;">不动产权号</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.landPropertyInfo?infoForm.landPropertyInfo:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">产权人</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.propertyOwner?infoForm.propertyOwner:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">共有情况</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.propertyOwner?infoForm.propertyOwner:'' }}</td>
        </tr>
        <tr style=" text-align: center;">
          <th style="text-align: center; vertical-align: middle;word-wrap:break-word;">不动单元号</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.bdcdyh?infoForm.bdcdyh:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">资产类型</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.assetsTypeId?infoForm.assetsTypeId:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">权利性质</th>
          <td style="text-align: center; vertical-align: middle;">{{ quanlixingzhi(infoForm.assetUseType) }}</td>
        </tr>
        <tr style=" text-align: center;">
          <th style="text-align: center; vertical-align: middle;word-wrap:break-word;">用途</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.yt?infoForm.yt:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">土地使用面积</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.tdsymj?infoForm.tdsymj:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">房屋建筑面积</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.fwjzmj?infoForm.fwjzmj:'' }}</td>
        </tr>
        <tr style=" text-align: center;">
          <th style="text-align: center; vertical-align: middle;word-wrap:break-word;">期限</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.yt?infoForm.yt:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">起始日期</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.assetDate[0]?momentObj(infoForm.assetDate[0]).format('YYYY-MM-DD'):'' }}</td>
          <th style="text-align: center; vertical-align: middle;">结束日期</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.assetDate[1]?momentObj(infoForm.assetDate[1]).format('YYYY-MM-DD'):'' }}</td>
        </tr>
        <tr style=" text-align: center;">
          <th style="text-align: center; vertical-align: middle;word-wrap:break-word;">层数</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.cs?infoForm.cs:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">房屋结构形式/分类情况</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.fwjg?infoForm.fwjg:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">建设年度</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.jsnd?infoForm.jsnd:'' }}</td>
        </tr>
        <tr style=" text-align: center;">
          <th style="text-align: center; vertical-align: middle;word-wrap:break-word;">资产价值</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.zcjz?infoForm.zcjz:'' }} 元</td>
          <th style="text-align: center; vertical-align: middle;">地图标注</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.fwjg?infoForm.fwjg:'' }}</td>
        </tr>
        <tr>
          <th style="text-align: center; vertical-align: middle;">申请时间</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.createTime?momentObj(infoForm.createTime).format('YYYY-MM-DD'):'' }}</td>
          <th style="text-align: center; vertical-align: middle;">开始时间</th>
          <td style="text-align: center; vertical-align: middle;" colspan="2">{{ infoForm&&infoForm.startTime?infoForm.startTime:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">结束时间</th>
          <td style="text-align: center; vertical-align: middle;" colspan="2">{{ infoForm&&infoForm.endTime?infoForm.endTime:'' }}</td>
        </tr>

        <tr>
          <td colspan="8" style="text-align: center; vertical-align: middle;">资产评估信息</td>
        </tr>
        <tr style=" text-align: center;">
          <th style="text-align: center; vertical-align: middle;word-wrap:break-word;">评估日期</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.assetsMent.buildDate?momentObj(infoForm.assetsMent.buildDate).format('YYYY-MM-DD'):'' }}</td>
          <th style="text-align: center; vertical-align: middle;">评估编号</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.assetsMent.assetCode?infoForm.assetsMent.assetCode:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">评估价值</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.assetsMent.assetPriceOneYear?infoForm.assetsMent.assetPriceOneYear:'' }}元</td>
        </tr>
        <tr style=" text-align: center;">
          <th style="text-align: center; vertical-align: middle;word-wrap:break-word;">土地面积</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.tdmj?infoForm.tdmj:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">土地评估价值</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.tdpgjz?infoForm.tdpgjz:'' }}</td>

        </tr>
        <tr style=" text-align: center;">
          <th style="text-align: center; vertical-align: middle;word-wrap:break-word;">房产面积</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.fwmj?infoForm.fwmj:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">房产评估价值</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.fwpgjz?infoForm.fwpgjz:'' }}</td>

        </tr>
        <tr>
          <td colspan="8" style="text-align: center; vertical-align: middle;word-wrap:break-word;font-weight: 800;">资产抵押情况</td>
        </tr>
        <tr style=" text-align: center;">
          <th style="text-align: center; vertical-align: middle;word-wrap:break-word;">抵押权人</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.dyqr?infoForm.dyqr:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">抵押金额</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.dyje?infoForm.dyje:'' }}元</td>
          <th style="text-align: center; vertical-align: middle;">抵押期限</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.dyqx?infoForm.dyqx:'' }}</td>
        </tr>
        <tr>
          <td colspan="8" style="text-align: center; vertical-align: middle;word-wrap:break-word;font-weight: 800;">资产日常巡查情况</td>
        </tr>
        <tr>
          <td colspan="8" style="text-align: center; vertical-align: middle;word-wrap:break-word;font-weight: 800;">结构安全</td>
        </tr>
        <tr style=" text-align: center;">
          <th colspan="1" style="text-align: center; vertical-align: middle;word-wrap:break-word;">巡查时间</th>
          <td colspan="2" style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.xcsj1?momentObj(infoForm.assetsMent.xcsj1).format('YYYY-MM-DD'):'' }}</td>
          <th colspan="1" style="text-align: center; vertical-align: middle;">巡查情况</th>
          <td colspan="2" style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.xcqk1?infoForm.xcqk1:'' }}</td>
        </tr>
        <tr>
          <td colspan="8" style="text-align: center; vertical-align: middle;word-wrap:break-word;font-weight: 800;">消防设施</td>
        </tr>
        <tr style=" text-align: center;">
          <th colspan="1" style="text-align: center; vertical-align: middle;word-wrap:break-word;">巡查时间</th>
          <td colspan="2" style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.xcsj2?momentObj(infoForm.assetsMent.xcsj1).format('YYYY-MM-DD'):'' }}</td>
          <th colspan="1" style="text-align: center; vertical-align: middle;">巡查情况</th>
          <td colspan="2" style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.xcqk2?infoForm.xcqk2:'' }}</td>
        </tr>
        <tr>
          <td colspan="8" style="text-align: center; vertical-align: middle;word-wrap:break-word;font-weight: 800;">资产使用情况</td>
        </tr>
        <tr style=" text-align: center;">
          <th colspan="1" style="text-align: center; vertical-align: middle;word-wrap:break-word;">巡查时间</th>
          <td colspan="2" style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.xcsj3?momentObj(infoForm.xcsj3).format('YYYY-MM-DD'):'' }}</td>
          <th colspan="1" style="text-align: center; vertical-align: middle;">巡查情况</th>
          <td colspan="2" style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.xcsj3?infoForm.xcsj3:'' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import moment from 'moment' // 日期格式化工具
import { mapState } from 'vuex'

export default {
  name: 'PrintView',
  props: {
    // 父组件传递 姓名字段
    name: {
      type: String,
      default: ''
    },
    // 父组件传递 部门字段
    deptName: {
      type: String,
      default: ''
    },
    // 父组件传递 时长字段
    duration: {
      type: String,
      default: ''
    },
    // 父组件传递对象参数
    infoForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      momentObj: null,
      checkUserIds: null,
      copyUserIds: null
    }
  },
  watch: {},
  created() {
    this.momentObj = moment
  },
  computed: {
    ...mapState(['allUserlist']) // 获取用户数据
  },
  /** 以下所有方法采用同步调用，防止打印时数据丢失**/
  methods: {
    quanlixingzhi(showid) {
      switch (showid) {
        case 0:
          return '出让/自建房'
        case 1:
          return '出让'
        case 2:
          return '划拨/自建房'
        default:
          return ''
      }
    },
    /** 数据进行封装，页面进行回显 **/
    async getCheckUser(checkUserId, copyUserId) {
      this.checkUserIds = await this.filterCheckedusers(checkUserId)
      this.copyUserIds = await this.filterCheckedusers(copyUserId)
    },
    /* 审批人 刷选 暴力方法，没做去重直接是清空在复制*/
    async filterCheckedusers(checkedIds) {
      checkedIds = checkedIds ? checkedIds.split(',') : []
      const checkedusers = []
      if (Array.isArray(checkedIds)) {
        checkedIds.forEach(item => {
          checkedusers.push(this.allUserlist.filter(i => (Boolean(item) && i.id === item))[0])
        })
      } else if (checkedIds) {
        checkedusers.push(this.allUserlist.filter(i => i.id === checkedIds)[0])
      }
      return checkedusers.filter(item => item !== undefined)
    }
  }
}
</script>
