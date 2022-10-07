<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">Page style setting</h3>

      <div class="drawer-item">
        <span>Theme Color</span>
        <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" @change="themeChange" />
      </div>

      <div class="drawer-item">
        <span>Open Tags-View</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>Fixed Header</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>Sidebar Logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <!--        <span>当前用户：</span>-->
        <!--        <el-input v-model="user" type="text" />-->
        <div id="message" v-html="remsg" />
        <div id="el-input">
          <el-input
            id="chatbox"
            v-model="msg"
            type="textarea"
            :rows="1"
            placeholder="请输入内容"
            @keyup.native.enter="handle"
          />
        </div>
        <el-button
          size="small"
          style="display:inline-block;"
          icon="el-icon-s-promotion"
          type="suceess"
          plain
          @click="handle"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'

import * as signalR from '@microsoft/signalr'
import { getToken } from '@/utils/auth'

const hubUrl = process.env.VUE_APP_BASE_API + '/ChatHub'
// .net core 版本中默认不会自动重连，需手动调用 withAutomaticReconnect


export default {
  components: { ThemePicker },
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem(getToken())).logonName,
      msg: '',
      remsg: ''
    }
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    }
  },
  mounted() {
    const _this = this
    // 实现Show方法
    // connection.on('Show', function(userName, message) {
    //   _this.remsg = _this.remsg + '<br>' + userName + ':' + message
    //   if (userName !== _this.user) {
    //     _this.$notify({
    //       title: '来自聊天室',
    //       type: 'success',
    //       message: userName + ':' + message,
    //       position: 'bottom-left'
    //     })
    //   }
    // })
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    },
    handle: function() {
      if (this.msg.trim() === '') {
        this.$message.error('不能发送空白消息')
        return
      }
      // 调用后端方法 SendMsg 传入参数
     // connection.invoke('SendMsg', this.user, this.msg)
      this.msg = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

#el-input {
  display: inline-block;
  width: 75%;
  float: left;
  padding-right: 2px;
}

#message {
  overflow-y: auto;
  text-align: left;
  border: #42b983 solid 1px;
  height: 400px;
  margin-top: 2px;
  margin-bottom: 2px;
  display: flex;
  flex-direction: column-reverse;
}

</style>
