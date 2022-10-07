<template>
  <div id="app">
    <lock-screen/>
    <router-view/>
    <stomp-mq/>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>删繁就简三秋树，领异标新二月花。如意Admin，为开源而生。</span>
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
