<template>
  <div class="login-container">
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

    <div class="content">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >

        <div class="title-container">
          <h3 class="title">宁国市乡村振兴投资集团有限公司</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>
        <el-form-item prop="code">
          <span class="svg-container">
            <svg-icon icon-class="example" />
          </span>
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="请输入验证码"
            style="width: 50%;"
            tabindex="3"
            type="text"
            @keyup.enter.native="handleLogin"
          />
          <div class="login-code">
            <img :src="codeUrl" class="login-code-img" @click="getCode">
          </div>
        </el-form-item>
        <el-form-item prop="language">
          <span class="svg-container">
            <svg-icon icon-class="international" />
          </span>
          <el-select
            v-model="loginForm.language"
            style="width: 300px;"
            placeholder="请选择语言"
            @change="changeLanguage"
          >
            <el-option
              v-for="item in options"
              :key="item.languageName"
              :label="item.languageName"
              :value="item.languageName"
            />
          </el-select>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" tabindex="4" style="margin:0px 0px 20px 0px;">记住密码</el-checkbox>
        <el-button
          :loading="loading"
          type="info"
          style="width:100%;margin-bottom:30px;background: red;color:white;"
          tabindex="5"
          @click.native.prevent="handleLogin"
        ><span>登 录</span>
        </el-button>
      </el-form>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>宁国市乡村振兴投资集团有限公司</span>
    </div>
  </div>
</template>

<script>
import watermark from '@/utils/water-mark'
import img1 from '@/assets/images/nggk.jpg'

export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入至少6位密码'))
      } else {
        callback()
      }
    }
    return {
      img1: img1,
      codeUrl: '',
      options: null,
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        language: null,
        code: '',
        guid: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }], //, validator: validateUsername
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    watermark.out()

    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }

    const rememberMe = localStorage.getItem('RememberMe')
    if (rememberMe) {
      this.loginForm.username = localStorage.getItem('username')
      this.loginForm.password = localStorage.getItem('password')
      this.loginForm.rememberMe = true
    }

    this.RuYiAdmin.GetSalt({ userName: this.JWT_USER_NAME }).then(response => {
      const password = this.CryptoJS.SHA512(this.JWT_PASSWORD + response.object).toString()
      const param = {
        UserName: this.JWT_USER_NAME,
        Password: password,
        Salt: response.object
      }
      this.RuYiAdmin.GetJwtToken(param).then(res => {
        sessionStorage.setItem('access-token', res.object.accessToken)
        sessionStorage.setItem('refresh-token', res.object.refreshToken)
        this.getCode()
      })
    })

    this.getLanguages()
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getCode: function() {
      this.loginForm.code = null
      this.RuYiAdmin.GetCaptcha().then(response => {
        this.codeUrl = response.object.captchaPicture
        this.loginForm.guid = response.object.id
      })
    },
    checkCapslock: function(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd: function() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin: function() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const form = {
            UserName: this.rsaEncrypt(this.loginForm.username + '_' + this.loginForm.guid),
            Password: this.rsaEncrypt(this.loginForm.password + '_' + this.loginForm.guid),
            CaptchaId: this.rsaEncrypt(this.loginForm.guid),
            Captcha: this.rsaEncrypt(this.loginForm.code)
          }
          this.$store.dispatch('user/login', JSON.stringify(form)).then(response => {
            if (this.loginForm.rememberMe) {
              localStorage.setItem('RememberMe', '1')
              localStorage.setItem('username', this.loginForm.username)
              localStorage.setItem('password', this.loginForm.password)
            }
            // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            this.$router.push({ path: '/', query: this.otherQuery })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery: function(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    getLanguages: function() {
      const url = 'LanguageManagement/Post'
      const queryCondition = {
        PageIndex: 0,
        PageSize: 10,
        Sort: 'OrderNumber ASC',
        QueryItems: []
      }
      this.RuYiAdmin.GetList(url, queryCondition).then(response => {
        this.options = response.list
        const language = localStorage.getItem('language')
        if (language) {
          this.loginForm.language = language
        }
      })
    },
    changeLanguage: function() {
      localStorage.setItem('language', this.loginForm.language)
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: rgb(12, 1, 1);
$cursor: black;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 90%;

    input {
      background: transparent;
      border: 0px;

      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 40px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgb(83, 74, 74);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: rgb(12, 1, 1);

.login-container {
  z-index: 999;
  position: absolute;
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 10px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 20px;
      color: $light_gray;
      margin: 10px auto 10px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 40px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 47px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  float: right;
  height: 47px;
  width: 110px;
}

.content {
  width: 430px;
  height: 450px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto; /* 有了这个就自动居中了 */
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgb(255, 255, 255);
  border-radius: 5px;
}

#app {
  background-image: url("/background_image/bg.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
  z-index: -1;
  position: absolute;
}

#nggk
{
  src: url("/background_image/nggk.jpg");
}
</style>
