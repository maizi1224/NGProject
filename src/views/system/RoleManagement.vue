<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryForm" label-width="100px" :inline="true" border>
      <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Role.Query.RoleName)" prop="roleName">
        <el-input
          v-model="queryForm.roleName"
          :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Role.Form.Placeholder.RoleName)"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchData"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="ButtonPermission('role:query:list')"
          type="success"
          size="mini"
          icon="el-icon-search"
          plain
          @click="searchData"
        >{{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Search) }}
        </el-button>
        <el-button
          v-if="ButtonPermission('role:query:list')"
          type="warning"
          size="mini"
          icon="el-icon-refresh-left"
          plain
          @click="ResetQueryFrom"
        >{{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Reset) }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 5px;">
      <el-col>
        <el-button
          v-if="ButtonPermission('role:add:entity')"
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
          v-if="ButtonPermission('role:edit:entity')"
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
          v-if="ButtonPermission('role:del:entities')"
          :disabled="editDisabled"
          icon="el-icon-circle-close"
          plain
          size="mini"
          type="danger"
          @click="deleteRole"
        >{{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Delete) }}
        </el-button>
        <el-button
          v-if="ButtonPermission('role:relate:menus')"
          type="warning"
          :disabled="editDisabled"
          icon="el-icon-connection"
          plain
          size="mini"
          @click="relate"
        >
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Role.Button.Relate) }}
        </el-button>
        <el-button
          v-if="ButtonPermission('role:grant:permission')"
          type="warning"
          :disabled="editDisabled"
          icon="el-icon-copy-document"
          plain
          size="mini"
          @click="grant"
        >{{ BusinessLanguage.GetMenuName(BusinessLanguage.Role.Button.Grant) }}
        </el-button>
        <el-button
          v-if="ButtonPermission('role:delegate:permission')"
          type="warning"
          :disabled="editDisabled"
          icon="el-icon-link"
          plain
          size="mini"
          @click="delegate"
        >{{ BusinessLanguage.GetMenuName(BusinessLanguage.Role.Button.Delegate) }}
        </el-button>
        <el-button
          v-if="ButtonPermission('role:list:export')"
          type="info"
          icon="el-icon-bottom"
          plain
          size="mini"
          @click="DownloadFile('RoleManagement/ExportExcel',null,'角色信息.xls')"
        >
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Export) }}
        </el-button>
        <el-button
          v-if="ButtonPermission('role:list:import')"
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
      <el-table-column
        align="center"
        type="selection"
      />
      <el-table-column
        type="index"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Index)"
        width="60"
        :index="IndexMethod"
        align="center"
      />
      <el-table-column
        prop="roleName"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Role.Form.Field.RoleName)"
      />
      <el-table-column
        prop="serialNumber"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.SerialNumber)"
        align="center"
        width="60"
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
        prop="remark"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Remark)"
      />
    </el-table>
    <div class="pagination">
      <el-pagination
        :current-page="queryCondition.PageIndex"
        :page-sizes="[10,15, 20,40,60,80,100]"
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
            <el-col span="12">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.Role.Form.Field.RoleName)"
                prop="roleName"
              >
                <el-input
                  v-model="form.roleName"
                  prefix-icon="el-icon-search"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Role.Form.Placeholder.RoleName)"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col span="12">
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
          </el-row>
          <el-row>
            <el-col span="24">
              <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Remark)" prop="Remark">
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  prefix-icon="el-icon-search"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Form.Placeholder.Remark)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-circle-check" plain size="mini" type="success" @click="SubmitForm">
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Dialog.Sure) }}
        </el-button>
        <el-button icon="el-icon-close" plain size="mini" type="danger" @click="dialogFormVisible = false">
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Dialog.Cancel) }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="BusinessLanguage.GetMenuName(BusinessLanguage.Role.DialogTitle.Grant)"
      :visible.sync="dialogPermissionVisible"
      class="demo-ruleForm"
    >
      <el-card class="box-card">
        <el-tree
          ref="permissionTree"
          :data="permissionTreeData"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="permissionTreeProps"
          style="height: 350px;overflow: auto;"
        >
          <span slot-scope="{ data }" class="custom-tree-node">
            <span v-if="data.type===2">
              <i class="el-icon-user-solid" />{{ data.name }}
            </span>
            <span v-else>
              <i class="el-icon-s-platform" />{{ data.name }}
            </span>
          </span>
        </el-tree>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-circle-check" plain size="mini" type="success" @click="submitPermission">
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Dialog.Sure) }}
        </el-button>
        <el-button icon="el-icon-refresh-left" plain size="mini" type="warning" @click="withdrawPermission">
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Dialog.Withdraw) }}
        </el-button>
        <el-button icon="el-icon-close" plain size="mini" type="danger" @click="dialogPermissionVisible = false">
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Dialog.Cancel) }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="BusinessLanguage.GetMenuName(BusinessLanguage.Role.DialogTitle.Delegate)"
      :visible.sync="dialogDelegationVisible"
      class="demo-ruleForm"
    >
      <el-card class="box-card">
        <el-tree
          ref="delegationTree"
          :data="delegationTreeData"
          show-checkbox
          check-strictly
          default-expand-all
          node-key="id"
          highlight-current
          :props="delegationTreeProps"
          style="height: 350px;overflow: auto;"
        >
          <span slot-scope="{ data }" class="custom-tree-node">
            <i class="el-icon-s-platform" />{{ data.orgName }}
          </span>
        </el-tree>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-circle-check" plain size="mini" type="success" @click="submitDelegation">
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Dialog.Sure) }}
        </el-button>
        <el-button icon="el-icon-refresh-left" plain size="mini" type="warning" @click="withdrawDelegation">
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Dialog.Withdraw) }}
        </el-button>
        <el-button icon="el-icon-close" plain size="mini" type="danger" @click="dialogDelegationVisible = false">
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Dialog.Cancel) }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="BusinessLanguage.GetMenuName(BusinessLanguage.Role.DialogTitle.Relate)"
      :visible.sync="dialogMenusVisible"
      class="demo-ruleForm"
    >
      <el-card class="box-card">
        <el-tree
          ref="relationTree"
          :data="relationTreeData"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="relationTreeProps"
          style="height: 350px;overflow: auto;"
        />
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-circle-check" plain size="mini" type="success" @click="submitMenus">
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Dialog.Sure) }}
        </el-button>
        <el-button icon="el-icon-close" plain size="mini" type="danger" @click="dialogMenusVisible = false">
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Dialog.Cancel) }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="BusinessLanguage.GetMenuName(BusinessLanguage.Role.DialogTitle.Import)"
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
      <el-button
        plain
        size="mini"
        type="success"
        @click="downLoadTemplate"
      >
        {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.DownLoadTemplate) }}
      </el-button>
      &nbsp;&nbsp;
      <el-badge v-show="badgeVisible" :value="badgeValue" :max="99" class="item">
        <el-button size="small" type="warning" plain @click="downLoadExcel">
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.DownLoadExcel) }}
        </el-button>
      </el-badge>
    </el-dialog>
  </div>
</template>

<script>
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'
import { generateQueryItem } from '@/utils/query-item'

export default {
  name: 'RoleManagement',
  extends: RuYiAdminBasePage,
  data() {
    return {
      queryForm: {
        roleName: null
      },
      form: {
        id: null,
        roleName: null,
        serialNumber: null,
        remark: null,
        isDel: null,
        creator: null,
        createTime: null,
        modifier: null,
        modifyTime: null
      },
      rules: {
        roleName: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Role.Form.Placeholder.RoleName),
            trigger: 'blur'
          },
          {
            min: 0,
            max: 128,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.ScheduleJob.Form.Rule.MinLength128),
            trigger: 'blur'
          }
        ]
      },
      dialogPermissionVisible: false,
      permissionTreeData: null,
      permissionTreeProps: {
        children: 'children',
        label: 'name'
      },
      dialogMenusVisible: false,
      relationTreeData: null,
      relationTreeProps: {
        children: 'children',
        label: 'menuName'
      },
      dialogDelegationVisible: false,
      delegationTreeData: null,
      delegationTreeProps: {
        children: 'children',
        label: 'orgName'
      },
      uploadDialogVisible: false,
      fileList: [],
      importUrl: null,
      headers: null,
      badgeValue: null,
      badgeVisible: false,
      excelId: null
    }
  },
  watch: {},
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.url.queryList = 'RoleManagement/Post'
    this.url.queryEntity = 'RoleManagement/GetById/'
    this.url.addEntity = 'RoleManagement/Add'
    this.url.editEntity = 'RoleManagement/Put'
    this.url.deleteEntity = 'RoleManagement/Delete/'
    this.url.deleteEntities = 'RoleManagement/DeleteRange/'
    this.queryCondition.Sort = 'SerialNumber ASC'
  },
  mounted() {
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    searchData: function() {
      this.queryCondition.PageIndex = 0
      this.queryCondition.QueryItems = []
      if (this.queryForm.roleName) {
        this.queryCondition.QueryItems.push(generateQueryItem(
          'RoleName',
          this.DataType.String,
          this.QueryMethod.Like,
          this.queryForm.roleName))
      }
      this.InitData()
    },
    add: function() {
      this.resetForm()
      this.title = this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Role.DialogTitle.Add)
      this.form.id = this.Guid.Empty
      this.form.isDel = this.DeletionType.Undeleted
      this.form.creator = this.Guid.Empty
      this.form.createTime = this.DateTime.Default
      this.form.modifier = this.Guid.Empty
      this.form.modifyTime = this.DateTime.Default
      this.dialogFormVisible = true
    },
    edit: function() {
      this.RuYiAdmin.GetEntity('RoleManagement/IsInheritedRole/', this.multipleSelection[0].id).then(res => {
        if (res.object === false) {
          this.loading = true
          this.resetForm()
          this.GetEntity(this.multipleSelection[0].id).then(response => {
            this.title = this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Role.DialogTitle.Edit)
            Object.assign(this.form, response.object)
            this.form.roleName = this.multipleSelection[0].roleName
            this.dialogFormVisible = true
            this.loading = false
          })
        } else {
          this.$message({
            showClose: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Role.Message.UpdateLimited),
            type: 'error'
          })
        }
      })
    },
    deleteRole: function() {
      this.RuYiAdmin.GetEntity('RoleManagement/IsInheritedRole/', this.multipleSelection[0].id).then(res => {
        if (res.object === false) {
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
                this.InitData()
              })
            }
          })
        } else {
          this.$message({
            showClose: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Role.Message.DeleteLimited),
            type: 'error'
          })
        }
      })
    },
    resetForm: function() {
      this.form.id = null
      this.form.roleName = null
      this.form.serialNumber = null
      this.form.remark = null
      this.form.isDel = null
      this.form.creator = null
      this.form.createTime = null
      this.form.modifier = null
      this.form.modifyTime = null
    },
    grant: function() {
      this.RuYiAdmin.GetList('OrganizationManagement/GetOrgUserTree', null).then(response => {
        this.dialogPermissionVisible = true
        this.permissionTreeData = response.list
        this.RuYiAdmin.GetEntity('RoleManagement/GetGrantedUserRoles/', this.multipleSelection[0].id).then(res => {
          const ids = res.object.map((item) => {
            return item.userId
          })
          this.$refs.permissionTree.setCheckedKeys(ids)
        })
      })
    },
    relate: function() {
      this.RuYiAdmin.GetEntity('RoleManagement/IsInheritedRole/', this.multipleSelection[0].id).then(res => {
        if (res.object === false) {
          this.RuYiAdmin.GetList('MenuManagement/Post', {
            PageIndex: 0, PageSize: 10, Sort: 'CreateTime DESC', TotalCount: 0, QueryItems: []
          }).then(response => {
            this.dialogMenusVisible = true
            this.relationTreeData = response.list
            this.RuYiAdmin.GetEntity('RoleManagement/GetGrantedRoleMenus/', this.multipleSelection[0].id).then(res => {
              res.object.forEach((element) => {
                const node = this.$refs.relationTree.getNode(element.menuId)
                if (node.isLeaf) {
                  this.$refs.relationTree.setChecked(node, true)
                }
              })
            })
          })
        } else {
          this.$message({
            showClose: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Role.Message.UpdateLimited),
            type: 'error'
          })
        }
      })
    },
    delegate: function() {
      this.RuYiAdmin.GetList('OrganizationManagement/Post', {
        PageIndex: 0, PageSize: 10, Sort: 'CreateTime DESC', TotalCount: 0, QueryItems: []
      }).then(response => {
        this.dialogDelegationVisible = true
        this.delegationTreeData = response.list
        this.RuYiAdmin.GetEntity('RoleManagement/GetDelegatedRoleOrgs/', this.multipleSelection[0].id).then(res => {
          res.object.forEach((element) => {
            const node = this.$refs.delegationTree.getNode(element.orgId)
            this.$refs.delegationTree.setChecked(node, true)
          })
        })
      })
    },
    submitPermission: function() {
      let nodes = this.$refs.permissionTree.getCheckedNodes()
      nodes = nodes.filter(t => t.type === 2)
      if (nodes.length <= 0) {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Message.SelectUser),
          type: 'warning'
        })
        return
      }
      const roleId = this.multipleSelection[0].id
      const array = []
      for (let i = 0; i < nodes.length; i++) {
        array.push({ roleId: roleId, userId: nodes[i].id })
      }
      this.RuYiAdmin.AddEntity('RoleManagement/GrantUserRole', array).then(response => {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Role.Message.Grant),
          type: 'success'
        })
        this.dialogPermissionVisible = false
      })
    },
    withdrawPermission: function() {
      let nodes = this.$refs.permissionTree.getCheckedNodes()
      nodes = nodes.filter(t => t.type === 2)
      if (nodes.length <= 0) {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Message.SelectUser),
          type: 'warning'
        })
        return
      }
      const roleId = this.multipleSelection[0].id
      const array = []
      for (let i = 0; i < nodes.length; i++) {
        array.push({ roleId: roleId, userId: nodes[i].id })
      }
      this.RuYiAdmin.AddEntity('RoleManagement/WithdrawGrantedUserRole', array).then(response => {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Role.Message.WithdrawGrant),
          type: 'success'
        })
        this.$refs.permissionTree.setCheckedKeys([])
        this.RuYiAdmin.GetEntity('RoleManagement/GetGrantedUserRoles/', this.multipleSelection[0].id).then(res => {
          const ids = res.object.map((item) => {
            return item.userId
          })
          this.$refs.permissionTree.setCheckedKeys(ids)
        })
      })
    },
    submitDelegation: function() {
      const nodes = this.$refs.delegationTree.getCheckedKeys()
      if (nodes.length <= 0) {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Message.SelectOrg),
          type: 'warning'
        })
        return
      }
      const roleId = this.multipleSelection[0].id
      const array = []
      for (let i = 0; i < nodes.length; i++) {
        array.push({ roleId: roleId, orgId: nodes[i], ownerType: 1 })
      }
      this.RuYiAdmin.AddEntity('RoleManagement/DelegateRoleOrgs', array).then(response => {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Role.Message.Delegate),
          type: 'success'
        })
        this.dialogDelegationVisible = false
      })
    },
    withdrawDelegation: function() {
      const nodes = this.$refs.delegationTree.getCheckedKeys()
      if (nodes.length <= 0) {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Message.SelectOrg),
          type: 'warning'
        })
        return
      }
      const roleId = this.multipleSelection[0].id
      const array = []
      for (let i = 0; i < nodes.length; i++) {
        array.push({ roleId: roleId, orgId: nodes[i], ownerType: 1 })
      }
      this.RuYiAdmin.AddEntity('RoleManagement/WithdrawRoleOrgs', array).then(response => {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Role.Message.WithdrawDelegation),
          type: 'success'
        })
        this.$refs.delegationTree.setCheckedKeys([])
        this.RuYiAdmin.GetEntity('RoleManagement/GetDelegatedRoleOrgs/', this.multipleSelection[0].id).then(res => {
          res.object.forEach((element) => {
            const node = this.$refs.delegationTree.getNode(element.orgId)
            this.$refs.delegationTree.setChecked(node, true)
          })
        })
      })
    },
    submitMenus: function() {
      const halfNodes = this.$refs.relationTree.getHalfCheckedNodes()
      const nodes = this.$refs.relationTree.getCheckedNodes()
      if (nodes.length <= 0) {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Message.SelectMenu),
          type: 'warning'
        })
        return
      }
      const roleId = this.multipleSelection[0].id
      const array = []
      for (let i = 0; i < halfNodes.length; i++) {
        array.push({ roleId: roleId, menuId: halfNodes[i].id })
      }
      for (let i = 0; i < nodes.length; i++) {
        array.push({ roleId: roleId, menuId: nodes[i].id })
      }
      this.RuYiAdmin.AddEntity('RoleManagement/GrantRoleMenus', array).then(response => {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Role.Message.Relate),
          type: 'success'
        })
        this.dialogMenusVisible = false
      })
    },
    uploadFile: function() {
      this.refreshLocalToken()
      this.importUrl = process.env.VUE_APP_BASE_API + '/RoleManagement/Import'
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
      this.$message.warning(`file limited: 1,select: ${files.length},total: ${files.length + fileList.length}`)
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
        this.InitData()
      }
    },
    downLoadExcel: function() {
      this.DownloadFile('RoleManagement/DownloadExcel/' + this.excelId, null, '错误信息.xls')
    },
    downLoadTemplate: function() {
      this.DownloadFile('RoleManagement/DownloadTemplate/RoleTemplate', null, '角色导入模板.xls')
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

<style scoped>
.colWidth {
  width: 250px;
}
</style>
