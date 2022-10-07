<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryForm" label-width="100px" :inline="true" border>
      <el-form-item label="登录账号" prop="userLogonName">
        <el-input
          v-model="queryForm.userLogonName"
          placeholder="请输入登录账号"
          prefix-icon="el-icon-search"
          clearable
          size="small"
          @keyup.enter.native="searchData"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="ButtonPermission('user:nonmodule:list')"
          type="success"
          size="mini"
          icon="el-icon-search"
          plain
          @click="searchData"
        >查询
        </el-button>
        <el-button
          v-if="ButtonPermission('user:nonmodule:list')"
          type="warning"
          size="mini"
          icon="el-icon-refresh-left"
          plain
          @click="resetQueryFrom"
        >重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 5px">
      <el-col>
        <el-button
          v-if="ButtonPermission('user:nonmodule:grant')"
          :disabled="editDisabled"
          type="success"
          icon="el-icon-connection"
          plain
          size="mini"
          @click="grant"
        >
          授权
        </el-button>
        <el-button
          v-if="ButtonPermission('user:nonmodule:grant')"
          :disabled="editDisabled"
          icon="el-icon-edit"
          plain
          size="mini"
          type="warning"
          @click="disable"
        >
          禁用
        </el-button>
        <el-button
          v-if="ButtonPermission('user:nonmodule:grant')"
          :disabled="delDisabled"
          icon="el-icon-circle-close"
          plain
          size="mini"
          type="danger"
          @click="del"
        >删除
        </el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      stripe
      row-key="id"
      border
      :header-cell-style="{ textAlign: 'center' }"
      @selection-change="HandleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="65" />
      <el-table-column
        type="index"
        label="序号"
        width="60"
        :index="IndexMethod"
        align="center"
      />
      <el-table-column
        label="账号展示名"
        prop="userDisplayName"
      />
      <el-table-column
        label="登录账号"
        prop="userLogonName"
      />
      <el-table-column
        label="手机号"
        prop="mobilePhone"
      />
      <el-table-column
        label="座机号"
        prop="telephone"
      />
      <el-table-column
        label="电子邮件"
        prop="email"
      />
      <el-table-column
        prop="isEnabled"
        label="是否启用"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.isEnabled === 1"
            type="success"
          >启用
          </el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        :current-page="queryCondition.PageIndex"
        :page-sizes="[10, 15, 20, 40, 60, 80, 100]"
        :page-size="queryCondition.PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryCondition.TotalCount"
        @size-change="HandleSizeChange"
        @current-change="HandleCurrentChange"
      />
    </div>
    <el-dialog title="一对多访问授权" :visible.sync="grantFormVisible" class="demo-ruleForm">
      <el-card class="box-card">
        <el-form
          ref="grantForm"
          :model="grantForm"
          :rules="grantRules"
          label-width="100px"
          label-position="left"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="账号名称" prop="userDisplayName">
                <el-input
                  v-model="grantForm.userDisplayName"
                  prefix-icon="el-icon-search"
                  placeholder="请输入账号名称"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登录账号" prop="userLogonName">
                <el-input
                  v-model="grantForm.userLogonName"
                  prefix-icon="el-icon-search"
                  class="colWidth"
                  placeholder="请输入登录账号"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="模块账号" prop="userModuleLogonName">
                <el-input
                  v-model="grantForm.userModuleLogonName"
                  prefix-icon="el-icon-search"
                  class="colWidth"
                  placeholder="请输入模块账号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模块密码" prop="userModulePassword">
                <el-input
                  v-model="grantForm.userModulePassword"
                  prefix-icon="el-icon-search"
                  placeholder="请输入模块密码"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          v-loading="grantLoading"
          :data="data"
          style="width: 100%"
          stripe
          row-key="id"
          border
          :header-cell-style="{textAlign: 'center'}"
          @selection-change="handleGrantSelectionChange"
        >
          <el-table-column align="center" type="selection" width="65" />
          <el-table-column label="模块简称" prop="moduleShortName" />
          <el-table-column label="英文简称" prop="moduleShortNameEN" />
          <el-table-column prop="createTime" label="创建时间" width="160">
            <template slot-scope="scope">
              <span>{{ $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button
          icon="el-icon-circle-check"
          plain
          size="mini"
          type="success"
          @click="submitGrantForm"
        >确 定
        </el-button>
        <el-button
          icon="el-icon-close"
          plain
          size="mini"
          type="danger"
          @click="grantFormVisible = false"
        >取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'
import { generateQueryItem } from '@/utils/query-item'

export default {
  name: 'BizUserNonModule',
  extends: RuYiAdminBasePage,
  data() {
    return {
      queryForm: {
        userLogonName: null
      },
      data: null,
      grantFormVisible: false,
      grantForm: {
        id: null,
        moduleId: null,
        userId: null,
        userDisplayName: null,
        userLogonName: null,
        userModuleLogonName: null,
        userModulePassword: null,
        remark: null,
        isDel: null,
        creator: null,
        createTime: null,
        modifier: null,
        modifyTime: null
      },
      grantRules: {
        userModuleLogonName: [{ required: true, message: '模块账号不能为空', trigger: 'blur' }],
        userModulePassword: [{ required: true, message: '模块密码不能为空', trigger: 'blur' }]
      },
      grantLoading: false,
      grantSelection: null
    }
  },
  created() {
    this.url.queryList = 'BizUserManagement/Post'
    this.url.deleteEntities = 'BizUserModuleManagement/DeleteUser/'
    this.queryCondition.Sort = 'CREATE_TIME ASC'
  },
  mounted() {
    this.getModules()
  },
  destroyed() {
  },
  methods: {
    getModules: function() {
      this.RuYiAdmin.GetList('BizModuleManagement/Post', {
        PageIndex: 0,
        PageSize: 0,
        Sort: 'X.SERIAL_NUMBER ASC',
        TotalCount: 0,
        QueryItems: []
      }).then((response) => {
        this.data = response.list
      })
    },
    searchData: function() {
      this.addDisabled = false
      this.queryCondition.PageIndex = 0
      this.queryCondition.QueryItems = []
      if (this.queryForm.userLogonName) {
        this.queryCondition.QueryItems.push(
          generateQueryItem(
            'USER_LOGON_NAME',
            this.DataType.String,
            this.QueryMethod.Like,
            this.queryForm.userLogonName
          )
        )
        this.queryCondition.QueryItems.push(
          generateQueryItem(
            'USER_DISPLAY_NAME',
            this.DataType.String,
            this.QueryMethod.OrLike,
            this.queryForm.userLogonName
          )
        )
      }
      this.InitData()
    },
    resetQueryFrom: function() {
      this.$refs.queryForm.resetFields()
      this.queryCondition.QueryItems = []
      this.getModules()
      this.InitData()
    },
    disable: function() {
      this.$confirm('确定要禁用用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.multipleSelection.length === 1) {
          const url = 'BizUserModuleManagement/DisableUser/' + this.multipleSelection[0].id
          this.RuYiAdmin.Get(url, null).then((response) => {
            this.$message({ showClose: true, message: '禁用成功', type: 'error' })
            this.editDisabled = true
            this.delDisabled = true
            this.getModules()
            this.InitData()
          })
        }
      })
    },
    del: function() {
      this.$confirm('确定要将用户删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map((item) => {
          return item.id
        })
        this.DeleteEntities(ids.toString()).then((response) => {
          this.$message({ showClose: true, message: '删除成功', type: 'error' })
          this.editDisabled = true
          this.delDisabled = true
          this.getModules()
          this.InitData()
        })
      })
    },
    grant: function() {
      if (this.multipleSelection && this.multipleSelection.length === 1) {
        this.grantForm.userId = this.multipleSelection[0].id
        this.grantForm.userLogonName = this.multipleSelection[0].userLogonName
        this.grantForm.userDisplayName = this.multipleSelection[0].userDisplayName
        this.grantForm.userModuleLogonName = null
        this.grantForm.userModulePassword = null
        this.grantForm.id = this.Guid.Empty
        this.grantForm.isDel = this.DeletionType.Undeleted
        this.grantForm.creator = this.Guid.Empty
        this.grantForm.createTime = this.DateTime.Default
        this.grantForm.modifier = this.Guid.Empty
        this.grantForm.modifyTime = this.DateTime.Default
        this.grantFormVisible = true
      } else {
        this.$message({ showClose: true, message: '请选择一个用户', type: 'error' })
      }
    },
    submitGrantForm: function() {
      if (this.grantSelection && this.grantSelection.length === 1) {
        this.$refs.grantForm.validate((valid) => {
          if (valid) {
            this.grantForm.moduleId = this.grantSelection[0].id
            this.grantForm.userModulePassword = this.rsaEncrypt(this.grantForm.userModulePassword)
            this.RuYiAdmin.Post('/BizUserModuleManagement/Grant', this.grantForm).then(response => {
              this.grantSelection = null
              this.$message({ showClose: true, message: '授权成功', type: 'success' })
              this.grantFormVisible = false
              this.getModules()
              this.InitData()
            })
          }
        })
      } else {
        this.$message({ showClose: true, message: '请选择一个模块', type: 'error' })
      }
    },
    handleGrantSelectionChange: function(val) {
      this.grantSelection = val
    }
  }
}
</script>

<style scoped>

</style>
