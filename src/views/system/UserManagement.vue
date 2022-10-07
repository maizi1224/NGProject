<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <el-input
            v-model="filterText"
            :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Form.Placeholder.KeywordsFilter)"
            clearable
          />
          <el-tree
            ref="tree"
            class="filter-tree"
            :data="data"
            :props="defaultProps"
            highlight-current
            default-expand-all
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card">
          <el-form ref="queryForm" :model="queryForm" label-width="100px" :inline="true" border>
            <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Query.Search)" prop="userName">
              <el-input
                v-model="queryForm.userName"
                :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Form.Placeholder.Keywords)"
                prefix-icon="el-icon-search"
                clearable
                @keyup.enter.native="searchData"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                v-if="ButtonPermission('user:query:list')"
                type="success"
                size="mini"
                icon="el-icon-search"
                plain
                @click="searchData"
              >{{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Search) }}
              </el-button>
              <el-button
                v-if="ButtonPermission('user:query:list')"
                type="warning"
                size="mini"
                icon="el-icon-refresh-left"
                plain
                @click="resetQueryFrom"
              >{{
                BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Reset) }}
              </el-button>
            </el-form-item>
          </el-form>
          <el-row style="margin-bottom: 5px;">
            <el-col>
              <el-button
                v-if="ButtonPermission('user:add:entity')"
                :disabled="addDisabled"
                icon="el-icon-circle-plus-outline"
                plain
                size="mini"
                type="primary"
                @click="add"
              >
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Add) }}
              </el-button>
              <el-button
                v-if="ButtonPermission('user:edit:entity')"
                :disabled="editDisabled"
                icon="el-icon-edit"
                plain
                size="mini"
                type="success"
                @click="edit"
              >
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Edit) }}
              </el-button>
              <el-button
                v-if="ButtonPermission('user:del:entities')"
                :disabled="delDisabled"
                icon="el-icon-circle-close"
                plain
                size="mini"
                type="danger"
                @click="del"
              >
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Delete) }}
              </el-button>
              <el-button
                v-if="ButtonPermission('user:import:entities')"
                type="info"
                icon="el-icon-bottom"
                plain
                size="mini"
                @click="DownloadFile('UserManagement/ExportExcel',null,'用户信息.xls')"
              >
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Export) }}
              </el-button>
              <el-button
                v-if="ButtonPermission('user:import:entities')"
                type="info"
                icon="el-icon-upload"
                plain
                size="mini"
                @click="uploadFile"
              >
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Import) }}
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
            :header-cell-style="{textAlign: 'center'}"
            @selection-change="HandleSelectionChange"
          >
            <el-table-column align="center" type="selection" />
            <el-table-column
              type="index"
              :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Index)"
              width="60"
              :index="IndexMethod"
              align="center"
            />
            <el-table-column
              prop="logonName"
              :label="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Field.LogonName)"
            />
            <el-table-column
              prop="displayName"
              :label="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Field.DisplayName)"
            />
            <el-table-column
              prop="sex"
              :label="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Field.Sex)"
              align="center"
            >
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
              prop="serialNumber"
              :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.SerialNumber)"
              align="center"
            />
            <el-table-column
              prop="createTime"
              :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.CreateTime)"
              width="160"
            >
              <template slot-scope="scope">
                <span>{{ $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="isEnabled"
              :label="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Field.IsEnabled)"
              align="center"
              @change="change"
            >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.isEnabled === 1" type="success">
                  {{ BusinessLanguage.GetMenuName(BusinessLanguage.User.Grid.Enabled) }}
                </el-tag>
                <el-tag v-else type="danger">{{
                  BusinessLanguage.GetMenuName(BusinessLanguage.User.Grid.Disabled)
                }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Remark)" />
          </el-table>
          <div class="pagination">
            <el-pagination
              :current-page="queryCondition.PageIndex"
              :page-sizes="[10,15,20,40,60,80,100]"
              :page-size="queryCondition.PageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="queryCondition.TotalCount"
              @size-change="HandleSizeChange"
              @current-change="HandleCurrentChange"
            />
          </div>
          <el-dialog :title="title" :visible.sync="dialogFormVisible" class="demo-ruleForm">
            <el-card class="box-card">
              <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Field.LogonName)"
                      prop="logonName"
                    >
                      <el-input
                        v-model="form.logonName"
                        prefix-icon="el-icon-search"
                        :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Placeholder.LogonName)"
                        class="colWidth"
                        @blur="userCheck"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Field.DisplayName)"
                      prop="displayName"
                    >
                      <el-input
                        v-model="form.displayName"
                        prefix-icon="el-icon-search"
                        :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Placeholder.DisplayName)"
                        class="colWidth"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Field.Password)"
                      prop="password"
                    >
                      <el-input
                        v-model="form.password"
                        prefix-icon="el-icon-search"
                        class="colWidth"
                        :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Placeholder.Password)"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Field.Telephone)"
                      prop="telephone"
                    >
                      <el-input
                        v-model="form.telephone"
                        prefix-icon="el-icon-search"
                        :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Placeholder.Telephone)"
                        class="colWidth"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Field.MobilePhone)"
                      prop="mobilePhone"
                    >
                      <el-input
                        v-model="form.mobilePhone"
                        prefix-icon="el-icon-search"
                        :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Placeholder.MobilePhone)"
                        class="colWidth"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Field.Email)"
                      prop="email"
                    >
                      <el-input
                        v-model="form.email"
                        prefix-icon="el-icon-search"
                        :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Placeholder.Email)"
                        class="colWidth"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Index)"
                      prop="SerialNumber"
                    >
                      <el-input-number
                        v-model="form.serialNumber"
                        :min="0"
                        :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Form.Placeholder.SerialNumber)"
                        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Form.Placeholder.SerialNumber)"
                        class="colWidth"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Field.IsEnabled)"
                      prop="isEnabled"
                    >
                      <el-radio-group
                        v-model="form.isEnabled"
                        :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.User.Form.Placeholder.IsEnabled)"
                        class="colWidth"
                      >
                        <el-radio :label="0">{{
                          BusinessLanguage.GetMenuName(BusinessLanguage.User.Grid.Disabled)
                        }}
                        </el-radio>
                        <el-radio :label="1">{{
                          BusinessLanguage.GetMenuName(BusinessLanguage.User.Grid.Enabled)
                        }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
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
                  <el-col :span="12">
                    <el-form-item
                      :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Remark)"
                      prop="Remark"
                    >
                      <el-input
                        v-model="form.remark"
                        prefix-icon="el-icon-search"
                        :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Form.Placeholder.Remark)"
                        class="colWidth"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-card>
            <div slot="footer" class="dialog-footer">
              <el-button icon="el-icon-circle-check" plain size="mini" type="success" @click="submitForm">
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Dialog.Sure) }}
              </el-button>
              <el-button icon="el-icon-close" plain size="mini" type="danger" @click="dialogFormVisible = false">
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Dialog.Cancel) }}
              </el-button>
            </div>
          </el-dialog>
          <el-dialog
            :title="BusinessLanguage.GetMenuName(BusinessLanguage.User.DialogTitle.Import)"
            :visible.sync="uploadDialogVisible"
          >
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
              <el-button size="small" type="primary" plain>
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Upload) }}
              </el-button>
              <div slot="tip" class="el-upload__tip">
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Message.FileSizeLimited) }}
              </div>
            </el-upload>
            <br>
            <el-button plain size="mini" type="success" @click="downLoadTemplate">
              {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.DownLoadTemplate) }}
            </el-button>
            &nbsp;&nbsp;
            <el-badge v-show="badgeVisible" :value="badgeValue" :max="99" class="item">
              <el-button size="small" type="warning" plain @click="downLoadExcel">
                {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.DownLoadExcel) }}
              </el-button>
            </el-badge>
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
  name: 'UserManagement',
  extends: RuYiAdminBasePage,
  data() {
    return {
      queryForm: {
        userName: null
      },
      filterText: '',
      data: null,
      defaultProps: {
        children: 'children',
        label: 'orgName'
      },
      currentNode: null,
      form: {
        id: null,
        orgId: null,
        orgName: null,
        logonName: null,
        displayName: null,
        password: null,
        telephone: null,
        mobilePhone: null,
        email: null,
        isSupperAdmin: null,
        serialNumber: null,
        remark: null,
        isEnabled: null,
        sex: null,
        isDel: null,
        creator: null,
        createTime: null,
        modifier: null,
        modifyTime: null
      },
      rules: {
        logonName: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.User.Form.Placeholder.LogonName),
            trigger: 'blur'
          },
          {
            min: 0,
            max: 128,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.ScheduleJob.Form.Rule.MinLength128),
            trigger: 'blur'
          }
        ],
        displayName: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.User.Form.Placeholder.DisplayName),
            trigger: 'blur'
          },
          {
            min: 0,
            max: 128,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.ScheduleJob.Form.Rule.MinLength128),
            trigger: 'blur'
          }
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
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.User.Form.Placeholder.IsEnabled),
            trigger: 'blur'
          }
        ],
        sex: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.User.Form.Placeholder.Sex),
            trigger: 'blur'
          }
        ]
      },
      sexOptions: null,
      uploadDialogVisible: false,
      fileList: [],
      importUrl: null,
      headers: null,
      badgeValue: null,
      badgeVisible: false,
      excelId: null
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.url.queryList = 'UserManagement/Post'
    this.url.queryEntity = 'UserManagement/GetById/'
    this.url.addEntity = 'UserManagement/Add'
    this.url.editEntity = 'UserManagement/Put'
    this.url.deleteEntity = 'UserManagement/Delete/'
    this.url.deleteEntities = 'UserManagement/DeleteRange/'
    this.queryCondition.Sort = 'SerialNumber ASC'
  },
  mounted() {
    this.getCodes('Sex').then(response => {
      this.sexOptions = response.object
    })
    this.getTreeNodes()
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getTreeNodes: function() {
      this.RuYiAdmin.GetList('OrganizationManagement/Post', {
        PageIndex: 0, PageSize: 0, Sort: 'CreateTime DESC', TotalCount: 0, QueryItems: []
      }).then(response => {
        this.data = response.list
      })
    },
    filterNode: function(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    searchData: function() {
      this.addDisabled = false
      this.queryCondition.PageIndex = 0
      this.queryCondition.QueryItems = []
      if (this.currentNode != null) {
        this.queryCondition.QueryItems.push(generateQueryItem(
          'OrgId',
          this.DataType.Guid,
          this.QueryMethod.Equal,
          this.currentNode.id))
      }
      if (this.queryForm.userName) {
        this.queryCondition.QueryItems.push(
          generateQueryItem('LogonName', this.DataType.String, this.QueryMethod.Like, this.queryForm.userName)
        )
        this.queryCondition.QueryItems.push(
          generateQueryItem('DisplayName', this.DataType.String, this.QueryMethod.OrLike, this.queryForm.userName)
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
    change: function() {
      if (this.form.isEnabled === 0) {
        this.disabled = true
      }
    },
    handleNodeClick: function(data) {
      this.currentNode = data
      this.searchData()
    },
    add: function() {
      if (!this.currentNode) {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Message.SelectOrg),
          type: 'error'
        })
        return
      }
      this.resetForm()
      this.title = this.BusinessLanguage.GetMenuName(this.BusinessLanguage.User.DialogTitle.Add)
      this.form.id = this.Guid.Empty
      this.form.orgId = this.currentNode.id
      this.form.orgName = this.currentNode.orgName
      this.form.password = '***'
      this.form.isSupperAdmin = 0
      this.form.isEnabled = 1
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
      this.GetEntity(this.multipleSelection[0].id).then(response => {
        this.title = this.BusinessLanguage.GetMenuName(this.BusinessLanguage.User.DialogTitle.Edit)
        Object.assign(this.form, response.object)
        this.form.orgId = this.multipleSelection[0].orgId
        this.form.orgName = this.multipleSelection[0].orgName
        this.form.sex = response.object.sex.toString()
        this.dialogFormVisible = true
        this.loading = false
      })
    },
    del: function() {
      this.$confirm(
        this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Button.Delete.Confirm),
        this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Tooltip),
        {
          confirmButtonText: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Sure),
          cancelButtonText: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Cancel),
          type: 'warning'
        }).then(() => {
        if (this.multipleSelection.length === 1) {
          this.DeleteEntity(this.multipleSelection[0].id).then(response => {
            this.$message({
              showClose: true,
              message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Message.Delete),
              type: 'error'
            })
            this.editDisabled = true
            this.delDisabled = true
            this.getTreeNodes()
            this.InitData()
          })
        } else {
          const ids = this.multipleSelection.map((item) => {
            return item.id
          })
          this.DeleteEntities(ids.toString()).then(response => {
            this.$message({
              showClose: true,
              message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Message.Delete),
              type: 'error'
            })
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
            // this.form.password = this.rsaEncrypt(this.form.password)
            this.AddEntity(this.form).then(response => {
              this.$message({
                showClose: true,
                message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Message.Save),
                type: 'success'
              })
              this.dialogFormVisible = false
              this.editDisabled = true
              this.delDisabled = true
              this.getTreeNodes()
              this.InitData()
            })
          } else {
            this.form.password = this.rsaEncrypt(this.form.password)
            this.EditEntity(this.form).then(response => {
              this.$message({
                showClose: true,
                message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Message.Edit),
                type: 'success'
              })
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
    userCheck: function() {
      if (this.form.id === null || this.form.id === this.Guid.Empty && this.form.logonName) {
        const url = 'UserManagement/IsExistedLogonName/'
        this.RuYiAdmin.GetEntity(url, this.form.logonName).then(response => {
          if (response.object === true) {
            this.$message({
              showClose: true,
              message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.User.Form.Placeholder.ExistedLogonName),
              type: 'error'
            })
            this.form.logonName = null
          }
        })
      }
    },
    resetForm: function() {
      this.form.id = null
      this.form.orgId = null
      this.form.orgName = null
      this.form.logonName = null
      this.form.displayName = null
      this.form.password = null
      this.form.telephone = null
      this.form.mobilePhone = null
      this.form.email = null
      this.form.isSupperAdmin = null
      this.form.serialNumber = null
      this.form.remark = null
      this.form.isEnabled = null
      this.form.sex = null
      this.form.isDel = null
      this.form.creator = null
      this.form.createTime = null
      this.form.modifier = null
      this.form.modifyTime = null
    },
    uploadFile: function() {
      if (!this.currentNode) {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Message.SelectOrg),
          type: 'error'
        })
        return false
      }
      this.refreshLocalToken()
      this.importUrl = process.env.VUE_APP_BASE_API + '/UserManagement/Import?orgId=' + this.currentNode.id
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
      this.$message.warning(`file limited: 1,select: ${files.length},total:${files.length + fileList.length}`)
    },
    beforeRemove: function(file, fileList) {
      return this.$confirm(`are you sure you want to delete ${file.name}？`)
    },
    beforeUpload: function(file) {
      this.refreshLocalToken()
      const size = file.size / 1024
      if (size > 500) {
        this.$message.warning(this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Message.FileOutSize))
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
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Message.Import),
          type: 'success'
        })
        this.badgeValue = null
        this.excelId = null
        this.badgeVisible = false
        this.uploadDialogVisible = false
        this.getTreeNodes()
        this.InitData()
      }
    },
    downLoadExcel: function() {
      this.DownloadFile('UserManagement/DownloadExcel/' + this.excelId, null, '错误信息.xls')
    },
    downLoadTemplate: function() {
      this.DownloadFile('UserManagement/DownloadTemplate/UserTemplate', null, '用户导入模板.xls')
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
}</script>

<style scoped>
.colWidth {
  width: 250px;
}
</style>
