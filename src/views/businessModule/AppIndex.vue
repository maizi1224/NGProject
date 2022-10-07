<template>
  <div>
    <el-card shadow="hover" style="margin: 20px;border-radius: 20px;">
      <el-page-header :content="content" @back="goBack" />
      <el-tag type="success" style="margin-left: 90px;margin-right: 5px;">{{ userName }}</el-tag>
      <el-button
        icon="el-icon-circle-check"
        plain
        size="mini"
        type="success"
        @click="dialogFormVisible=true"
      >修改密码
      </el-button>
      <ul id="ul" class="mainmenu">
        <li><a href="#"><b>
          <el-button icon="el-icon-s-home" style="background-color: #36A1DB" />
        </b><span /></a></li>
        <li><a href="#"><b>
          <el-button icon="el-icon-copy-document" style="background-color: #678ce1" />
        </b><span /></a></li>
        <li><a href="#"><b>
          <el-button icon="el-icon-money" style="background-color: #8c67df;" />
        </b><span /></a></li>
        <li><a href="#"><b>
          <el-button icon="el-icon-files" style="background-color: #84d018" />
        </b><span /></a></li>
        <li><a href="#"><b>
          <el-button icon="el-icon-download" style="background-color: #14c760" />
        </b><span /></a></li>
        <li><a href="#"><b>
          <el-button icon="el-icon-s-custom" style="background-color: #f3b613" />
        </b><span /></a></li>
        <li><a href="#"><b>
          <el-button icon="el-icon-platform-eleme" style="background-color: #ff8a4a" />
        </b><span /></a></li>
        <li><a href="#"><b>
          <el-button icon="el-icon-phone-outline" style="background-color: #fc5366" />
        </b><span /></a></li>
        <li><a href="#"><b>
          <el-button icon="el-icon-chat-line-square" style="background-color: #36A1DB" />
        </b><span /></a></li>
      </ul>
    </el-card>
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      class="demo-ruleForm"
    >
      <el-card class="box-card">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="100px"
          label-position="left"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="账户密码" prop="userPassword">
                <el-input
                  v-model="form.userPassword"
                  prefix-icon="el-icon-search"
                  class="colWidth"
                  placeholder="请输入账户密码"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button
          icon="el-icon-circle-check"
          plain
          size="mini"
          type="success"
          @click="submitForm"
        >确 定
        </el-button>
        <el-button
          icon="el-icon-close"
          plain
          size="mini"
          type="danger"
          @click="dialogFormVisible = false"
        >取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $ from 'jquery'
import watermark from '@/utils/water-mark'

export default {
  name: 'AppIndex',
  data() {
    return {
      userName: null,
      content: '如意Admin统一身份认证系统欢迎您',
      dialogFormVisible: false,
      title: '修改密码',
      form: {
        userId: null,
        userPassword: null
      },
      rules: {
        userPassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {},
  mounted() {
    watermark.out()
    this.initPage()
  },
  methods: {
    goBack: function() {
      sessionStorage.removeItem('rz-user')
      sessionStorage.removeItem('rz-permissions')
      sessionStorage.removeItem('rz-token')
      history.go(-1)
    },
    initPage: function() {
      const user = JSON.parse(sessionStorage.getItem('rz-user'))
      const permissions = JSON.parse(sessionStorage.getItem('rz-permissions'))
      const token = sessionStorage.getItem('rz-token')

      if (!token) {
        this.$router.push({ path: '/appLogin' })
      } else {
        this.form.userId = user.id
        this.userName = user.userDisplayName
        const ul = $('#ul')[0]
        for (let i = 0; i < permissions.length; i++) {
          const item = permissions[i]
          const a = ul.children[i].getElementsByTagName('a')

          const span = $(a).children()[1]
          span.innerText = item.moduleShortName
          $(span).attr({ id: item.id })
          $(span).attr({ style: 'color:darkgray' })
          $(span).attr({ title: item.moduleName })

          // 拥有访问权限
          if (item.userModuleLogonName) {
            // 获取待办数量
            const baseAddress = item.moduleProtocol + '://' + item.moduleAddress + (item.modulePort ? (':' + item.modulePort) : '')
            if (item.moduleTodoAddress) {
              $.ajax({
                url: baseAddress + item.moduleTodoAddress + '?logonName=' + item.userModuleLogonName,
                success: function(result) {
                  span.innerText = item.moduleShortName + '（' + result + '）'
                }
              })
            }

            // 处理sso
            $(span).attr({ style: 'color:darkblue' })
            $(a).bind('click', function() {
              // 创建Form
              const form = $('<form></form>')
              $(document.body).append(form)

              // 设置属性
              form.attr('action', baseAddress + item.moduleSsoAddress)
              form.attr('method', 'post')

              // form的target属性决定form在哪个页面提交
              // _self -> 当前页面 _blank -> 新页面
              form.attr('target', '_blank')

              // 创建Input
              const name = $('<input type="text" name="userName" />')
              const password = $('<input type="text" name="password" />')
              const salt = $('<input type="text" name="salt" />')

              // 赋值
              name.attr('value', item.userModuleLogonName)
              password.attr('value', item.userModulePassword)
              salt.attr('value', token)

              // 附加到Form
              form.append(name)
              form.append(password)
              form.append(salt)

              // 提交表单
              form.submit()
              form.remove()

              // 注意return false取消链接的默认动作
              return false
            })
          }
        }
      }
    },
    submitForm: function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            token: this.rsaEncrypt(sessionStorage.getItem('rz-token')),
            userPassword: this.rsaEncrypt(this.form.userPassword + '_' + this.form.userId)
          }
          this.RuYiAdmin.Post('BizUserModuleManagement/UpdatePassword', data).then((response) => {
            this.form.userPassword = null
            this.$message({ showClose: true, message: '编辑成功', type: 'success' })
            this.dialogFormVisible = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>
html, body {
  color: #222;
  font-family: Microsoft YaHei, Helvitica, Verdana, Tohoma, Arial, san-serif;
  margin: 0;
  padding: 0;
  text-decoration: none;
  background-color: #8cc8ff;
}

ul {
  list-style: none outside none;
  margin: 10px 0px 0 0;
  padding: 0;
}

body .mainmenu:after {
  clear: both;
  content: " ";
  display: block;
}

body .mainmenu li {
  float: left;
  margin-left: 2.5%;
  margin-top: 2.5%;
  width: 30%;
  border-radius: 5px 5px 5px 5px;
  height: 150px;
  overflow: hidden;
}

body .mainmenu li a {
  display: block;
  color: #FFF;
  text-align: center
}

body .mainmenu li a b {
  display: block;
  height: 80px;
}

body .mainmenu li a button {
  margin: 30px auto 0px;
  border: 0px;
  width: 70px;
  height: 50px;
  font-size: 50px;
}

body .mainmenu li a span {
  margin: 15px 0px 0px 20px;
  display: block;
  height: 30px;
  line-height: 30px;
  color: #000000;
  font-size: 14px;
}

body .mainmenu li:nth-child(8n+1) {
  background-color: #36A1DB
}

body .mainmenu li:nth-child(8n+2) {
  background-color: #678ce1
}

body .mainmenu li:nth-child(8n+3) {
  background-color: #8c67df
}

body .mainmenu li:nth-child(8n+4) {
  background-color: #84d018
}

body .mainmenu li:nth-child(8n+5) {
  background-color: #14c760
}

body .mainmenu li:nth-child(8n+6) {
  background-color: #f3b613
}

body .mainmenu li:nth-child(8n+7) {
  background-color: #ff8a4a
}

body .mainmenu li:nth-child(8n+8) {
  background-color: #fc5366
}

</style>
