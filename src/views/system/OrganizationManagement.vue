<template>
  <div class="app-container">
    <el-row style="margin-bottom: 5px;">
      <el-col>
        <el-button
          v-if="ButtonPermission('org:add:entity')"
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
          v-if="ButtonPermission('org:edit:entity')"
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
          v-if="ButtonPermission('org:del:entities')"
          :disabled="delDisabled"
          icon="el-icon-circle-close"
          plain
          size="mini"
          type="danger"
          @click="Delete"
        >
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Delete) }}
        </el-button>
        <el-button
          v-if="ButtonPermission('org:query:list')"
          icon="el-icon-refresh"
          plain
          size="mini"
          type="info"
          @click="refresh"
        >
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Refresh) }}
        </el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      :header-cell-style="{textAlign: 'center'}"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      border
      default-expand-all
      row-key="id"
      style="width: 100%;"
      @selection-change="HandleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
      />
      <el-table-column
        :index="IndexMethod"
        align="center"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Index)"
        type="index"
        width="60"
      />
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Org.Grid.OrgName)"
        prop="orgName"
      />
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Org.Grid.LeaderName)"
        prop="leaderName"
      />
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.SerialNumber)"
        prop="serialNumber"
        align="center"
      />
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Remark)"
        prop="remark"
      />
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.CreateTime)"
        prop="createTime"
      >
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Action)" width="260">
        <template slot-scope="scope">
          <el-button
            v-if="ButtonPermission('org:add:entity')"
            plain
            size="mini"
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="handleAdd(scope.$index, scope.row)"
          >{{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Add) }}
          </el-button>
          <el-button
            v-if="ButtonPermission('org:edit:entity')"
            plain
            size="mini"
            type="success"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
          >{{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Edit) }}
          </el-button>
          <el-button
            v-if="ButtonPermission('org:del:entities')"
            plain
            size="mini"
            type="danger"
            icon="el-icon-circle-close"
            @click="handleDelete(scope.$index, scope.row)"
          >{{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Delete) }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" class="demo-ruleForm">
      <el-card class="box-card">
        <el-form ref="form" :model="form" :rules="rules" label-width="85px" label-position="left">
          <el-row v-show="ps">
            <el-col :span="24">
              <el-form-item label="父机构" prop="ParentOrgName">
                <el-input
                  v-model="parentOrgName"
                  prefix-icon="el-icon-search"
                  placeholder="请选择机构"
                  readonly
                  style="width: 590px;"
                />
              </el-form-item>
              <el-form-item v-show="false" label="父机构编号" prop="ParentId">
                <el-input v-model="form.parentId" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Org.Grid.OrgName)" prop="orgName">
                <el-input
                  v-model="form.orgName"
                  prefix-icon="el-icon-search"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Org.Form.Placeholder.OrgName)"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Org.Grid.LeaderName)" prop="Leader">
                <el-select
                  v-model="form.leader"
                  clearable
                  filterable
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Org.Form.Placeholder.LeaderName)"
                  class="colWidth"
                  @clear="clearLeader"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.displayName"
                    :value="item.id"
                  />
                </el-select>
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
              <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Remark)" prop="Remark">
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
        <el-button icon="el-icon-circle-check" plain size="mini" type="success" @click="SubmitForm">
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Dialog.Sure) }}
        </el-button>
        <el-button icon="el-icon-close" plain size="mini" type="danger" @click="dialogFormVisible = false">
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Dialog.Cancel) }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'

export default {
  name: 'OrganizationManagement',
  extends: RuYiAdminBasePage,
  data() {
    return {
      ps: true,
      options: null,
      parentOrgName: null,
      form: {
        id: null,
        orgName: null,
        parentId: null,
        leader: null,
        serialNumber: null,
        remark: null,
        isDel: null,
        creator: null,
        createTime: null,
        modifier: null,
        modifyTime: null
      },
      rules: {
        orgName: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Org.Form.Placeholder.OrgName),
            trigger: 'blur'
          },
          {
            min: 0,
            max: 128,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Org.Form.Rule.OrgName.MinLengthMessage),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {},
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.url.queryList = 'OrganizationManagement/Post'
    this.url.queryEntity = 'OrganizationManagement/GetById/'
    this.url.addEntity = 'OrganizationManagement/Add'
    this.url.editEntity = 'OrganizationManagement/Put'
    this.url.deleteEntity = 'OrganizationManagement/Delete/'
    this.url.deleteEntities = 'OrganizationManagement/DeleteRange/'
  },
  mounted() {
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    add: function() {
      if (this.multipleSelection === null || this.multipleSelection.length === 0) {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Org.DialogTitle.DefaultSelection),
          type: 'error'
        })
      } else {
        this.handleAdd(null, this.multipleSelection[0])
      }
    },
    edit: function() {
      this.handleEdit(null, this.multipleSelection[0])
    },
    refresh: function() {
      this.InitData()
    },
    handleAdd: function(index, row) {
      this.resetForm()
      this.title = this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Org.DialogTitle.Add)
      this.form.id = this.Guid.Empty
      this.parentOrgName = row.orgName
      this.form.parentId = row.id
      this.form.isDel = this.DeletionType.Undeleted
      this.form.creator = this.Guid.Empty
      this.form.createTime = this.DateTime.Default
      this.form.modifier = this.Guid.Empty
      this.form.modifyTime = this.DateTime.Default
      this.dialogFormVisible = true
    },
    handleEdit: function(index, row) {
      this.loading = true
      this.RuYiAdmin.GetEntity('UserManagement/GetUserByOrgId/', row.id).then(response => {
        this.options = response.list
        this.GetEntity(row.id).then(res => {
          this.ps = false
          this.title = this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Org.DialogTitle.Edit)
          Object.assign(this.form, res.object)
          this.dialogFormVisible = true
          this.loading = false
        })
      })
    },
    handleDelete: function(index, row) {
      this.$confirm(
        this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Button.Delete.Confirm),
        this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Tooltip),
        {
          confirmButtonText: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Sure),
          cancelButtonText: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Cancel),
          type: 'warning'
        }).then(() => {
        this.DeleteEntity(row.id).then(response => {
          this.$message({
            showClose: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Message.Delete),
            type: 'error'
          })
          this.InitData()
        })
      })
    },
    resetForm: function() {
      this.ps = true
      this.form.id = null
      this.form.orgName = null
      this.form.parentId = null
      this.parentOrgName = null
      this.form.leader = null
      this.form.serialNumber = null
      this.form.remark = null
    },
    clearLeader: function() {
      this.form.leader = null
    }
  }
}
</script>

<style scoped>
.colWidth {
  width: 250px;
}
</style>
