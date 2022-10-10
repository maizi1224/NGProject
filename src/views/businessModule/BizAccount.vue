<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--应用数据-->
      <el-col :span="4">
        <el-card class="box-card">
          <el-input
            v-model="filterText"
            placeholder="输入关键字过滤"
            clearable
            size="small"
            prefix-icon="el-icon-search"
          />
          <el-tree
            ref="tree"
            class="filter-tree"
            highlight-current
            :data="data"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
      <!--用户数据-->
      <el-col :span="20">
        <el-card class="box-card">
          <el-form
            ref="queryForm"
            :model="queryForm"
            label-width="100px"
            :inline="true"
            border
          >
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
                v-if="ButtonPermission('account:query:list')"
                type="success"
                size="mini"
                icon="el-icon-search"
                plain
                @click="searchData"
              >查询
              </el-button>
              <el-button
                v-if="ButtonPermission('account:query:list')"
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
                v-if="ButtonPermission('account:add:entity')"
                :disabled="addDisabled"
                icon="el-icon-circle-plus-outline"
                plain
                size="mini"
                type="primary"
                @click="add"
              >
                新增
              </el-button>
              <el-button
                v-if="ButtonPermission('account:edit:entity')"
                :disabled="editDisabled"
                icon="el-icon-edit"
                plain
                size="mini"
                type="success"
                @click="edit"
              >
                编辑
              </el-button>
              <el-button
                v-if="ButtonPermission('account:del:entities')"
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
              label="账号名称"
              prop="userDisplayName"
            />
            <el-table-column
              label="登录账号"
              prop="userLogonName"
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
                <span>{{
                  $moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss")
                }}</span>
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
                  <el-col :span="12">
                    <el-form-item label="账号名称" prop="userDisplayName">
                      <el-input
                        v-model="form.userDisplayName"
                        prefix-icon="el-icon-search"
                        placeholder="请输入账号名称"
                        class="colWidth"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="登录账号" prop="userLogonName">
                      <el-input
                        v-model="form.userLogonName"
                        prefix-icon="el-icon-search"
                        class="colWidth"
                        placeholder="请输入登录账号"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="账户密码" prop="userPassword">
                      <el-input
                        v-model="form.userPassword"
                        prefix-icon="el-icon-search"
                        class="colWidth"
                        placeholder="请输入账户密码"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="是否启用" prop="isEnabled">
                      <el-radio-group
                        v-model="form.isEnabled"
                        placeholder="请选择是否启用"
                        class="colWidth"
                      >
                        <el-radio :label="0">禁用</el-radio>
                        <el-radio :label="1">启用</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="座机号" prop="telephone">
                      <el-input
                        v-model="form.telephone"
                        prefix-icon="el-icon-search"
                        placeholder="请输入座机号"
                        class="colWidth"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="手机号" prop="mobilePhone">
                      <el-input
                        v-model="form.mobilePhone"
                        prefix-icon="el-icon-search"
                        placeholder="请输入手机号"
                        class="colWidth"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="电子邮件" prop="email">
                      <el-input
                        v-model="form.email"
                        prefix-icon="el-icon-search"
                        placeholder="请输入电子邮件"
                        class="colWidth"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="备注" prop="remark">
                      <el-input
                        v-model="form.remark"
                        prefix-icon="el-icon-search"
                        placeholder="请输入备注"
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
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'
import { generateQueryItem } from '@/utils/query-item'
import { validateEMail, validateMobilephone, validateTelephone } from '@/utils/validate'

export default {
  name: 'BizUserModule',
  extends: RuYiAdminBasePage,
  data() {
    return {
      queryForm: {
        userLogonName: null
      },
      filterText: '',
      data: null,
      currentNode: null,
      form: {
        id: '',
        moduleId: '',
        userLogonName: '',
        userDisplayName: '',
        userPassword: '',
        telephone: '',
        mobilePhone: '',
        email: '',
        remark: '',
        isEnabled: '',
        isDel: '',
        creator: '',
        createTime: '',
        modifier: '',
        modifyTime: ''
      },
      rules: {
        userDisplayName: [
          { required: true, message: '账户名称不能为空', trigger: 'blur' }
        ],
        userLogonName: [
          { required: true, message: '登录账户不能为空', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '登录密码不能为空', trigger: 'blur' }
        ],
        telephone: [
          { validator: validateTelephone, trigger: 'blur' }
        ],
        mobilePhone: [
          { validator: validateMobilephone, trigger: 'blur' }
        ],
        email: [
          { validator: validateEMail, trigger: 'blur' }
        ],
        isEnabled: [
          { required: true, message: '请选中是否启用', trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'moduleShortName'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.url.queryList = 'BizAccountManagement/Post'
    this.url.queryEntity = 'BizAccountManagement/GetById/'
    this.url.addEntity = 'BizAccountManagement/Add'
    this.url.editEntity = 'BizAccountManagement/Put'
    this.url.deleteEntities = 'BizAccountManagement/DeleteRange/'
    this.queryCondition.Sort = 'CREATE_TIME ASC'
  },
  mounted() {
    this.getTreeNodes()
  },
  destroyed() {
  },
  methods: {
    getTreeNodes: function() {
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
    filterNode: function(value, data) {
      if (!value) return true
      return data.moduleShortName.indexOf(value) !== -1
    },
    searchData: function() {
      this.addDisabled = false
      this.queryCondition.PageIndex = 0
      this.queryCondition.QueryItems = []
      if (this.currentNode != null) {
        this.queryCondition.QueryItems.push(
          generateQueryItem(
            'MODULE_ID',
            this.DataType.Guid,
            this.QueryMethod.Equal,
            this.currentNode.id
          )
        )
      }
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
      this.getTreeNodes()
      this.InitData()
    },
    handleNodeClick: function(data) {
      this.currentNode = data
      this.searchData()
    },
    add: function() {
      if (!this.currentNode) {
        this.$message({ showClose: true, message: '请选择模块', type: 'error' })
        return
      }
      this.resetForm()
      this.title = '新增同步用户'
      this.form.id = this.Guid.Empty
      this.form.moduleId = this.currentNode.id
      this.form.isDel = this.DeletionType.Undeleted
      this.form.creator = this.Guid.Empty
      this.form.createTime = this.DateTime.Default
      this.form.modifier = this.Guid.Empty
      this.form.modifyTime = this.DateTime.Default
      this.dialogFormVisible = true
    },
    edit: function() {
      this.loading = true
      this.resetForm()
      this.GetEntity(this.multipleSelection[0].id).then((response) => {
        this.title = '编辑同步用户'
        Object.assign(this.form, response.object)
        this.dialogFormVisible = true
        this.loading = false
      })
    },
    del: function() {
      this.$confirm('确定要将数据删除吗?', '提示', {
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
          this.getTreeNodes()
          this.InitData()
        })
      })
    },
    submitForm: function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id === null || this.form.id === this.Guid.Empty) {
            this.form.userPassword = this.rsaEncrypt(this.form.userPassword)
            this.AddEntity(this.form).then((response) => {
              this.$message({ showClose: true, message: '保存成功', type: 'success' })
              this.dialogFormVisible = false
              this.editDisabled = true
              this.delDisabled = true
              this.getTreeNodes()
              this.InitData()
            })
          } else {
            this.form.userPassword = this.rsaEncrypt(this.form.userPassword)
            this.EditEntity(this.form).then((response) => {
              this.$message({ showClose: true, message: '编辑成功', type: 'success' })
              this.dialogFormVisible = false
              this.editDisabled = true
              this.delDisabled = true
              this.getTreeNodes()
              this.InitData()
            })
          }
        }
      })
    },
    resetForm: function() {
      this.form.id = ''
      this.form.moduleId = ''
      this.form.userLogonName = ''
      this.form.userDisplayName = ''
      this.form.userPassword = ''
      this.form.telephone = ''
      this.form.mobilePhone = ''
      this.form.email = ''
      this.form.remark = ''
      this.form.isDel = ''
      this.form.creator = ''
      this.form.createTime = ''
      this.form.modifier = ''
      this.form.modifyTime = ''
    }
  }
}
</script>
<style>
.colWidth {
  width: 230px;
}
</style>
