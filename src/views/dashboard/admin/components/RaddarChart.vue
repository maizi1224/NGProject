<!--
 * @Author: maizi 851620279@qq.com
 * @Date: 2022-10-08 02:20:47
 * @LastEditors: maizi 851620279@qq.com
 * @LastEditTime: 2023-04-03 23:22:19
 * @FilePath: \NGProject\src\views\dashboard\admin\components\RaddarChart.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <ul v-infinite-scroll="initdata" infinite-scroll-distance="1" class="infinite-list" style="padding-left: 0px; overflow:auto;height: 420px;">
    <li v-for="i in msg" :key="i.Msg" class="infinite-list-item">
      <i class="el-icon-s-opportunity" style="color: #46a6ff;margin-left: 10px;" />
      <el-link type="primary" :title="i.placeholder" style="margin-left: 10px;">{{ i.Msg }}</el-link>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      count: 7,
      msg: []
    }
  },
  created() {

  },
  mounted() { this.initdata() },
  methods: {
    initdata() {
      this.RuYiAdmin.PostData('Asset/GetFeeinfoData', this.count).then(response => {
        this.msg = []
        response.object.forEach(element => {
          if (element.length > 71) {
            var Msg = element.slice(0, 70) + '···'
            var placeholder = element
            this.msg.push({ 'Msg': Msg, 'placeholder': placeholder })
          } else {
            this.msg.push({ 'Msg': Msg, 'placeholder': Msg })
          }
        })
      })
      this.count += 2
    }
  }
}
</script>
<style>
.infinite-list .infinite-list-item {
    display: flex;
    align-items: center;
    justify-content: left;
    height: 50px;
    background: #e8f3fe;
    margin: 10px;
    color: #070707;
    border-radius: 10px;
}
.infinite-list{
    overflow-y: auto;

    padding-right: 15px;
}
.infinite-list::-webkit-scrollbar
{
  height: 6px;
  width: 10px;
  margin-left: 10px;
}
.infinite-list::-webkit-scrollbar-thumb{
  background: rgb(224, 214, 235);
}
</style>
