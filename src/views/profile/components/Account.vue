<template>
  <el-form ref="form" :model="user" :rules="rules">
    <el-form-item label="姓名">
      <el-input v-model.trim="user.name" readonly="readonly" />
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model.trim="user.mobilePhone" readonly="readonly" />
    </el-form-item>
    <el-form-item label="座机号">
      <el-input v-model.trim="user.telephone" readonly="readonly" />
    </el-form-item>
    <el-form-item label="电子邮件地址">
      <el-input v-model.trim="user.email" readonly="readonly" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        v-model.trim="user.password"
        prefix-icon="el-icon-search"
        placeholder="请输入密码"
        type="password"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: '',
          name: '',
          telephone: '',
          mobilePhone: '',
          email: '',
          password: ''
        }
      }
    }
  },
  data() {
    return {
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const uuid = require('uuid')
          const salt = uuid.v4()
          const param = {
            UserId: this.rsaEncrypt(this.user.id),
            Password: this.rsaEncrypt(this.user.password + '_' + salt),
            Salt: this.rsaEncrypt(salt)
          }
          this.RuYiAdmin.Post('UserManagement/UpdatePassword', param).then(response => {
            this.$message({ showClose: true, message: '保存成功', type: 'success' })
          })
        }
      })
    }
  }
}
</script>
