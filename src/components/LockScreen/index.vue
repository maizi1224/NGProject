<template>
  <div class="screenBox" v-if="isCover">
    <div id="app">
      <vue-particles
        color="#dedede"
        :particle-opacity="0.7"
        :particles-number="80"
        shape-type="circle"
        :particle-size="4"
        lines-color="#dedede"
        :lines-width="1"
        :line-linked="true"
        :line-opacity="0.4"
        :lines-distance="150"
        :move-speed="3"
        :hover-effect="true"
        hover-mode="grab"
        :click-effect="true"
        click-mode="push"
      />
    </div>

    <div class="userInfo">
      <el-input
        v-model="userForm.password"
        placeholder="请输入登陆密码"
        style="width: 200px"
        type="password"
        @keyup.enter.native="unLock()"
      ></el-input>
      <div class="btn_class">
        <el-button
          type="primary"
          plain
          size="mini"
          icon="el-icon-unlock"
          @click="unLock"
        >解锁
        </el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LockScreen',
  data() {
    return {
      userForm: {
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters(['isCover', 'isLock'])
  },
  methods: {
    ...mapActions(['clearLock', 'logout']),
    unLock() {
      let oldAuct = localStorage.getItem('password')
      if (this.userForm.password === '' || this.userForm.password === undefined) {
        return
      } else if (this.userForm.password !== oldAuct) {
        this.userForm.password = ''
        this.$notify.error({ title: '错误', message: '解锁密码错误，请输入登陆密码解锁', duration: 1500 })
      } else {
        setTimeout(() => {
          this.userForm.password = ''
          this.$store.dispatch('lockScreen/clearLock', false)
        }, 500)
      }
    },
    preventRefresh() {
      let lockCOver = localStorage.getItem('HLT_LockCOver')
      this.$store.dispatch('lockScreen/preventRefresh', lockCOver)
    }
  },
  mounted() {
    this.preventRefresh()
  }
}
</script>

<style lang="scss" scoped>
.screenBox {
  width: 100%;
  height: 100%;
  //background: url("../../assets/lockscreent_imgs/img_1.jpg") no-repeat;
  background-color: #ffffff;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1500;

  .userInfo {
    display: flex;

    .btn_class {
      margin: 5px 0 0 10px;
    }
  }
}

#app {
  background-image: linear-gradient(-180deg, #1a1454 0%, #0e81a5 100%);
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  width: 100%;
  z-index: -1;
  position: absolute;
}
</style>

