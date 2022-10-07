<template>
  <div class="app-container">
    <el-row style="margin-bottom: 5px;">
      <el-col>
        <el-button
          v-if="ButtonPermission('code:add:entity')"
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
          v-if="ButtonPermission('code:edit:entity')"
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
          v-if="ButtonPermission('code:del:entities')"
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
          v-if="ButtonPermission('code:query:list')"
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
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.CodeTable.Grid.CodeName)"
        prop="codeName"
      />
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.CodeTable.Grid.Code)"
        prop="code"
      />
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.CodeTable.Grid.CodeValue)"
        prop="value"
      />
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.SerialNumber)"
        prop="serialNumber"
        align="center"
      />
      <!--        <el-table-column-->
      <!--          :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Remark)"-->
      <!--          prop="remark"-->
      <!--          align="left"-->
      <!--        />-->
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
            v-if="ButtonPermission('code:add:entity')"
            plain
            size="mini"
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="handleAdd(scope.$index, scope.row)"
          >{{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Add) }}
          </el-button>
          <el-button
            v-if="ButtonPermission('code:edit:entity')"
            plain
            size="mini"
            type="success"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
          >{{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Edit) }}
          </el-button>
          <el-button
            v-if="ButtonPermission('code:del:entities')"
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
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
          <el-row v-show="ps">
            <el-col :span="24">
              <el-form-item label="父编码" prop="ParentCodeName">
                <el-input
                  v-model="parentCodeName"
                  prefix-icon="el-icon-search"
                  placeholder="请选择父级编码"
                  readonly
                  style="width: 590px;"
                />
              </el-form-item>
              <el-form-item v-show="false" label="父编码编号" prop="ParentId">
                <el-input v-model="form.parentId" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.CodeTable.Grid.CodeName)"
                prop="codeName"
              >
                <el-input
                  v-model="form.codeName"
                  prefix-icon="el-icon-search"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.CodeTable.Form.Placeholder.CodeName)"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.CodeTable.Grid.Code)"
                prop="code"
              >
                <el-input
                  v-model="form.code"
                  prefix-icon="el-icon-search"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.CodeTable.Form.Placeholder.Code)"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.CodeTable.Grid.CodeValue)"
                prop="Value"
              >
                <el-input
                  v-model="form.value"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.CodeTable.Form.Placeholder.CodeValue)"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
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
          </el-row>
          <el-row>
            <el-col :span="24">
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
  </div>
</template>

<script>
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'

export default {
  name: 'CodeTableManagement',
  extends: RuYiAdminBasePage,
  data() {
    return {
      ps: true,
      parentCodeName: null,
      form: {
        id: null,
        codeName: null,
        parentId: null,
        code: null,
        value: null,
        serialNumber: null,
        remark: null,
        isDel: null,
        creator: null,
        createTime: null,
        modifier: null,
        modifyTime: null
      },
      rules: {
        codeName: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.CodeTable.Form.Placeholder.CodeName),
            trigger: 'blur'
          },
          {
            min: 0,
            max: 128,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.CodeTable.Form.Rule.CodeName.MinLengthMessage),
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.CodeTable.Form.Placeholder.Code),
            trigger: 'blur'
          },
          {
            min: 0,
            max: 128,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.CodeTable.Form.Rule.Code.MinLengthMessage),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {},
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.url.queryList = 'CodeTableManagement/Post'
    this.url.queryEntity = 'CodeTableManagement/GetById/'
    this.url.addEntity = 'CodeTableManagement/Add'
    this.url.editEntity = 'CodeTableManagement/Put'
    this.url.deleteEntity = 'CodeTableManagement/Delete/'
    this.url.deleteEntities = 'CodeTableManagement/DeleteRange/'
  },
  mounted() {
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    add: function() {
      if (this.multipleSelection === null || this.multipleSelection.length === 0) {
        this.handleAdd(null, null)
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
      this.title = this.BusinessLanguage.GetMenuName(this.BusinessLanguage.CodeTable.DialogTitle.Add)
      this.form.id = this.Guid.Empty
      if (row) {
        this.ps = true
        this.parentCodeName = row.codeName
        this.form.parentId = row.id
      } else {
        this.ps = false
      }
      this.form.isDel = this.DeletionType.Undeleted
      this.form.creator = this.Guid.Empty
      this.form.createTime = this.DateTime.Default
      this.form.modifier = this.Guid.Empty
      this.form.modifyTime = this.DateTime.Default
      this.dialogFormVisible = true
    },
    handleEdit: function(index, row) {
      this.loading = true
      this.GetEntity(row.id).then(response => {
        this.ps = false
        this.title = this.BusinessLanguage.GetMenuName(this.BusinessLanguage.CodeTable.DialogTitle.Edit)
        Object.assign(this.form, response.object)
        this.dialogFormVisible = true
        this.loading = false
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
          this.editDisabled = true
          this.delDisabled = true
          this.InitData()
        })
      })
    },
    resetForm: function() {
      this.ps = false
      this.form.id = null
      this.form.codeName = null
      this.form.parentId = null
      this.parentCodeName = null
      this.form.code = null
      this.form.value = null
      this.form.serialNumber = null
      this.form.remark = null
    }
  }
}
</script>

<style scoped>
.colWidth {
  width: 250px;
}
</style>
