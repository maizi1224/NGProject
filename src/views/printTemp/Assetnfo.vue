<!--
 * @Author: maizi 851620279@qq.com
 * @Date: 2023-11-19 19:22:36
 * @LastEditors: maizi 851620279@qq.com
 * @LastEditTime: 2023-11-19 19:42:43
 * @FilePath: \NGProject\src\views\printTemp\Assetnfo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="print-html" ref="PrintView">
    <table style="height: 358px; width: 95%; margin-left: auto; margin-right: auto;border-collapse: collapse;" border="1px" cellpadding="0" cellspacing="0" bordercolor="#000000" bordercolordark="#000000">
      <caption style="padding: 13px 0; font-size: 22px; font-weight: inherit;">资产档案</caption>
      <tbody>
        <tr style=" text-align: center;">
          <th style="text-align: center; vertical-align: middle;word-wrap:break-word;">档案号</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.createUserName?infoForm.createUserName:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">名称原用途</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.userDeptName?infoForm.userDeptName:'' }}</td>
          <th style="text-align: center; vertical-align: middle;">资产地址</th>
          <td style="text-align: center; vertical-align: middle;">{{ infoForm&&infoForm.timelen?infoForm.timelen:'' }}&nbsp;小时</td>

        </tr><tr style="">
          <th style="text-align: center; vertical-align: middle;">请假事由</th>
          <td style="text-align: center; vertical-align: middle;word-wrap:break-word;" colspan="7">{{ infoForm&&infoForm.content?infoForm.content:'' }}</td>
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
          <th style="text-align: center; vertical-align: middle;">备注</th>
          <td style="text-align: center; vertical-align: middle;word-wrap:break-word;" colspan="7" />
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
