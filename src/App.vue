<!--
 * @Author: maizi 851620279@qq.com
 * @Date: 2022-10-08 02:20:47
 * @LastEditors: maizi 851620279@qq.com
 * @LastEditTime: 2022-11-20 15:42:26
 * @FilePath: \NGProject\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="app">
    <lock-screen />
    <router-view />
    <stomp-mq />
    <!--  底部  -->
    <div class="el-login-footer">
      <span>宁国市乡村振兴投资集团有限公司</span>
      <!--<span>Copyright © 2021 RuYiAdmin All Rights Reserved.</span>-->
    </div>
  </div>
</template>

<script>
import StompMq from '@/views/components-demo/stomp-mq'
import LockScreen from '@/components/LockScreen/index'
import LockMixin from '@/components/LockScreen/lockMixin'

export default {
  name: 'App',
  components: { StompMq, LockScreen },
  mixins: [LockMixin],
  methods: {}
}
</script>
<style>
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  margin-top: 10px;
  width: 100%;
  text-align: center;
  color: #000000;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
