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
                v-if="ButtonPermission('user:module:list')"
                type="success"
                size="mini"
                icon="el-icon-search"
                plain
                @click="searchData"
              >查询
              </el-button>
              <el-button
                v-if="ButtonPermission('user:module:list')"
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
                v-if="ButtonPermission('user:module:add')"
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
                v-if="ButtonPermission('user:module:edit')"
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
                v-if="ButtonPermission('user:module:del')"
                :disabled="delDisabled"
                icon="el-icon-circle-close"
                plain
                size="mini"
                type="danger"
                @click="del"
              >删除
              </el-button>
              <el-button
                v-if="ButtonPermission('user:module:import')"
                type="info"
                icon="el-icon-upload"
                plain
                size="mini"
                @click="uploadFile"
              >
                导入
              </el-button>
              <el-button
                v-if="ButtonPermission('user:module:grant')"
                :disabled="editDisabled"
                type="warning"
                icon="el-icon-connection"
                plain
                size="mini"
                @click="grant"
              >
                授权
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
              label="模块账号"
              prop="userModuleLogonName"
            />
            <el-table-column prop="sex" :label="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Field.Sex)" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.sex === 0">
                  {{ BusinessLanguage.GetMenuName(BusinessLanguage.User.Grid.Male) }}
                </el-tag>
                <el-tag v-else-if="scope.row.sex === 1">
                  {{ BusinessLanguage.GetMenuName(BusinessLanguage.User.Grid.Female) }}
                </el-tag>
                <el-tag v-else type="danger">{{
                  BusinessLanguage.GetMenuName(BusinessLanguage.User.Grid.SexOther)
                }}
                </el-tag>
              </template>
            </el-table-column>
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
            <el-table-column label="创建时间" align="center" prop="createTime" width="160">
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
                    <el-form-item
                      :label="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Field.Sex)"
                      prop="sex"
                    >
                      <el-select
                        v-model="form.sex"
                        class="colWidth"
                        clearable
                        :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Placeholder.Sex)"
                      >
                        <el-option
                          v-for="item in sexOptions"
                          :key="item.value"
                          :label="item.codeName"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="模块账号" prop="userModuleLogonName">
                      <el-input
                        v-model="form.userModuleLogonName"
                        prefix-icon="el-icon-search"
                        class="colWidth"
                        placeholder="请输入模块账号"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="模块密码" prop="userModulePassword">
                      <el-input
                        v-model="form.userModulePassword"
                        prefix-icon="el-icon-search"
                        placeholder="请输入模块密码"
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
          <el-dialog title="导入授权信息" :visible.sync="uploadDialogVisible">
            <el-upload
              class="upload-demo"
              :action="importUrl"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :limit="1"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :file-list="fileList"
              accept=".xls"
            >
              <el-button size="small" type="primary" plain>点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传excel/xls文件，且不超过500kb</div>
            </el-upload>
            <br>
            <el-button
              plain
              size="mini"
              type="success"
              @click="downLoadTemplate"
            >
              下载模板
            </el-button>
            &nbsp;&nbsp;
            <el-badge v-show="badgeVisible" :value="badgeValue" :max="99" class="item">
              <el-button size="small" type="warning" plain @click="downLoadExcel">查看错误</el-button>
            </el-badge>
          </el-dialog>
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
                        class="colWidth"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-table
                v-loading="grantLoading"
                :data="grantData"
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
        id: null,
        moduleId: null,
        userId: null,
        userModuleLogonName: null,
        userModulePassword: null,
        userLogonName: null,
        userDisplayName: null,
        userPassword: null,
        telephone: null,
        mobilePhone: null,
        email: null,
        sex: null,
        remark: null,
        isEnabled: null,
        isDel: null,
        creator: null,
        createTime: null,
        modifier: null,
        modifyTime: null
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
        userModuleLogonName: [
          { required: true, message: '模块账号不能为空', trigger: 'blur' }
        ],
        userModulePassword: [
          { required: true, message: '模块密码不能为空', trigger: 'blur' }
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
        ],
        sex: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.User.Form.Placeholder.Sex),
            trigger: 'blur'
          }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'moduleShortName'
      },
      sexOptions: null,
      uploadDialogVisible: false,
      fileList: [],
      importUrl: null,
      headers: null,
      badgeValue: null,
      badgeVisible: false,
      excelId: null,
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
      grantSelection: null,
      grantData: null
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.url.queryList = 'BizUserModuleManagement/Post'
    this.url.queryEntity = 'BizUserModuleManagement/GetById/'
    this.url.addEntity = 'BizUserModuleManagement/Add'
    this.url.editEntity = 'BizUserModuleManagement/Put'
    this.url.deleteEntity = 'BizUserModuleManagement/Delete/'
    this.url.deleteEntities = 'BizUserModuleManagement/DeleteRange/'
    this.queryCondition.Sort = 'CREATE_TIME ASC'
  },
  mounted() {
    this.getCodes('Sex').then(response => {
      this.sexOptions = response.object
    })
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
        this.queryCondition.QueryItems.push(
          generateQueryItem(
            'USER_MODULE_LOGON_NAME',
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
      this.title = '新增用户'
      this.form.id = this.Guid.Empty
      this.form.moduleId = this.currentNode.id
      this.form.userId = this.Guid.Empty
      this.form.userPassword = '******'
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
        this.title = '编辑用户'
        Object.assign(this.form, response.object)
        this.form.sex = response.object.sex.toString()
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
        if (this.multipleSelection.length === 1) {
          this.DeleteEntity(this.multipleSelection[0].id).then((response) => {
            this.$message({ showClose: true, message: '删除成功', type: 'error' })
            this.editDisabled = true
            this.delDisabled = true
            this.getTreeNodes()
            this.InitData()
          })
        } else {
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
        }
      })
    },
    submitForm: function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id === null || this.form.id === this.Guid.Empty) {
            this.form.userModulePassword = this.rsaEncrypt(
              this.form.userModulePassword
            )
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
            this.form.userModulePassword = this.rsaEncrypt(
              this.form.userModulePassword
            )
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
      this.form.id = null
      this.form.moduleId = null
      this.form.userId = null
      this.form.userModuleLogonName = null
      this.form.userModulePassword = null
      this.form.userLogonName = null
      this.form.userDisplayName = null
      this.form.userPassword = null
      this.form.telephone = null
      this.form.mobilePhone = null
      this.form.email = null
      this.form.sex = null
      this.form.remark = null
      this.form.isDel = null
      this.form.creator = null
      this.form.createTime = null
      this.form.modifier = null
      this.form.modifyTime = null
    },
    uploadFile: function() {
      if (!this.currentNode) {
        this.$message({ showClose: true, message: '请选择模块', type: 'error' })
        return false
      }
      this.refreshLocalToken()
      this.importUrl = process.env.VUE_APP_BASE_API + '/BizUserModuleManagement/Import?moduleId=' + this.currentNode.id
      this.badgeValue = null
      this.excelId = null
      this.badgeVisible = false
      this.uploadDialogVisible = true
    },
    handleRemove: function(file, fileList) {
      this.badgeValue = null
      this.excelId = null
      this.badgeVisible = false
      console.log(file, fileList)
    },
    handlePreview: function(file) {
      console.log(file)
    },
    handleExceed: function(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove: function(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    beforeUpload: function(file) {
      this.refreshLocalToken()
      const size = file.size / 1024
      if (size > 500) {
        this.$message.warning('文件不能大于500k')
        return false
      }
      return true
    },
    handleSuccess: function(response, file, fileList) {
      if (response.object > 0) {
        this.badgeValue = response.object
        this.excelId = response.message
        this.badgeVisible = true
      } else {
        this.$message({ showClose: true, message: '导入成功', type: 'success' })
        this.badgeValue = null
        this.excelId = null
        this.badgeVisible = false
        this.uploadDialogVisible = false
        this.getTreeNodes()
        this.InitData()
      }
    },
    downLoadExcel: function() {
      this.DownloadFile('BizUserModuleManagement/DownloadExcel/' + this.excelId, null, '错误信息.xls')
    },
    downLoadTemplate: function() {
      this.DownloadFile('BizUserModuleManagement/DownloadTemplate/BizUserTemplate', null, '授权导入模板.xls')
    },
    grant: function() {
      if (this.multipleSelection && this.multipleSelection.length === 1) {
        this.grantForm.userId = this.multipleSelection[0].userId
        this.grantFormVisible = true
        this.grantLoading = true
        this.RuYiAdmin.Get('BizModuleManagement/GetUserNonModules/' + this.grantForm.userId, null).then(response => {
          this.grantLoading = false
          this.grantData = response.list
          this.grantForm.userLogonName = this.multipleSelection[0].userLogonName
          this.grantForm.userDisplayName = this.multipleSelection[0].userDisplayName
          this.grantForm.id = this.Guid.Empty
          this.grantForm.isDel = this.DeletionType.Undeleted
          this.grantForm.creator = this.Guid.Empty
          this.grantForm.createTime = this.DateTime.Default
          this.grantForm.modifier = this.Guid.Empty
          this.grantForm.modifyTime = this.DateTime.Default
        })
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
              this.getTreeNodes()
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
    },
    refreshLocalToken: function() {
      this.RuYiAdmin.RefreshLocalToken()
      this.headers = {
        'Authorization': 'Bearer ' + sessionStorage.getItem('access-token'),
        'RefreshToken': sessionStorage.getItem('refresh-token'),
        'token': sessionStorage.getItem('EncryptUserToken'),
        'ts': sessionStorage.getItem('ts')
      }
    }
  }
}
</script>
<style>
.colWidth {
  width: 230px;
}
</style>
