<template>
  <div class="app-container">
    <el-row style="margin-bottom: 5px;">
      <el-col>
        <el-button
          v-if="ButtonPermission('menu:add:entity')"
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
          v-if="ButtonPermission('menu:edit:entity')"
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
          v-if="ButtonPermission('menu:del:entities')"
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
          v-if="ButtonPermission('menu:query:list')"
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
      default-expand-all
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
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Field.MenuName)"
        prop="menuName"
      />
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Field.RootPath)"
        prop="path"
        width="130"
      />
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Field.MenuUrl)"
        prop="menuUrl"
      />
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Field.MenuType)"
        prop="menuType"
        align="center"
        width="80"
      >
        <template slot-scope="scope">
          <span>{{ MenuType.getMenuType(scope.row.menuType) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Field.Code)"
        prop="code"
        align="left"
      />
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.SerialNumber)"
        prop="serialNumber"
        align="center"
        width="60"
      />
      <!--        <el-table-column-->
      <!--          label="创建日期"-->
      <!--          prop="createTime"-->
      <!--          width="160"-->
      <!--        >-->
      <!--          <template slot-scope="scope">-->
      <!--            <span>{{ $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <el-table-column :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Action)" width="260">
        <template slot-scope="scope">
          <el-button
            v-if="ButtonPermission('menu:add:entity')"
            plain
            size="mini"
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="handleAdd(scope.$index, scope.row)"
          >{{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Add) }}
          </el-button>
          <el-button
            v-if="ButtonPermission('menu:edit:entity')"
            plain
            size="mini"
            type="success"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
          >{{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Edit) }}
          </el-button>
          <el-button
            v-if="ButtonPermission('menu:del:entities')"
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
              <el-form-item label="父菜单" prop="ParentMenuName">
                <el-input
                  v-model="parentMenuName"
                  prefix-icon="el-icon-search"
                  placeholder="请选择父级菜单"
                  readonly
                  style="width: 590px;"
                />
              </el-form-item>
              <el-form-item v-show="false" label="父菜单编号" prop="ParentId">
                <el-input v-model="form.parentId" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Field.RootPath)"
                prop="Path"
              >
                <el-input
                  v-model="form.path"
                  :disabled="disabled"
                  prefix-icon="el-icon-search"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Placeholder.RootPath)"
                  style="width: 590px;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Field.MenuName)"
                prop="menuName"
              >
                <el-input
                  v-model="form.menuName"
                  prefix-icon="el-icon-search"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Placeholder.MenuName)"
                  class="colWidth"
                  auto-complete="off"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Field.MenuNameEn)"
                prop="MenuNameEn"
              >
                <el-input
                  v-model="form.menuNameEn"
                  prefix-icon="el-icon-search"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Placeholder.MenuNameEn)"
                  class="colWidth"
                  auto-complete="off"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Field.MenuNameRu)"
                prop="MenuNameRu"
              >
                <el-input
                  v-model="form.menuNameRu"
                  prefix-icon="el-icon-search"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Placeholder.MenuNameRu)"
                  class="colWidth"
                  auto-complete="off"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Field.MenuUrl)"
                prop="MenuUrl"
              >
                <el-input
                  v-model="form.menuUrl"
                  :disabled="disabled"
                  prefix-icon="el-icon-search"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Placeholder.MenuUrl)"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Field.MenuType)"
                prop="menuType"
              >
                <el-radio-group
                  v-model="form.menuType"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Placeholder.MenuType)"
                  class="colWidth"
                  @change="change"
                >
                  <el-radio :label="0">
                    {{ BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Selection.MenuType.Menu) }}
                  </el-radio>
                  <el-radio :label="1">
                    {{ BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Selection.MenuType.Button) }}
                  </el-radio>
                  <el-radio :label="2">
                    {{ BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Selection.MenuType.View) }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Field.Icon)"
                prop="Icon"
              >
                <el-input
                  v-model="form.icon"
                  :disabled="disabled"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Placeholder.Icon)"
                  style="width: 230px;"
                />
                <i class="el-icon-question" @click="dialogIconVisible=true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Field.Code)"
                prop="Code"
              >
                <el-input
                  v-model="form.code"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Menu.Form.Placeholder.Code)"
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
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Remark)"
                prop="Remark"
              >
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
    <el-dialog :visible.sync="dialogIconVisible" class="demo-ruleForm">
      <el-tabs type="border-card">
        <el-tab-pane label="Icons">
          <div class="grid">
            <div v-for="item of svgIconItems" :key="item" @click="handleClipboard(item)">
              <el-tooltip placement="top">
                <div slot="content">
                  {{ generateIconCode(item) }}
                </div>
                <div class="icon-item">
                  <svg-icon :icon-class="item" class-name="disabled" />
                  <span>{{ item }}</span>
                </div>
              </el-tooltip>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'
import svgIcons from '@/views/icons/svg-icons'

export default {
  name: 'MenuManagement',
  extends: RuYiAdminBasePage,
  data() {
    return {
      ps: true,
      disabled: false,
      parentMenuName: null,
      form: {
        id: '',
        path: '',
        menuName: '',
        menuNameEn: '',
        menuNameRu: '',
        menuUrl: '',
        parentId: null,
        serialNumber: '',
        menuType: '',
        icon: '',
        code: '',
        remark: '',
        isDel: '',
        creator: '',
        createTime: '',
        modifier: '',
        modifyTime: ''
      },
      rules: {
        menuName: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Menu.Form.Placeholder.MenuName),
            trigger: 'blur'
          },
          {
            min: 0,
            max: 128,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Menu.Form.Rule.MenuName.MinLengthMessage),
            trigger: 'blur'
          }
        ],
        menuType: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Menu.Form.Placeholder.MenuType),
            trigger: 'blur'
          }
        ]
      },
      dialogIconVisible: false,
      svgIconItems: svgIcons
    }
  },
  watch: {},
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.url.queryList = 'MenuManagement/Post'
    this.url.queryEntity = 'MenuManagement/GetById/'
    this.url.addEntity = 'MenuManagement/Add'
    this.url.editEntity = 'MenuManagement/Put'
    this.url.deleteEntity = 'MenuManagement/Delete/'
    this.url.deleteEntities = 'MenuManagement/DeleteRange/'
    this.queryCondition.Sort = 'SerialNumber ASC'
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
    change: function() {
      this.disabled = this.form.menuType === 1 || this.form.menuType === 2
    },
    handleAdd: function(index, row) {
      this.disabled = false
      this.title = this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Menu.DialogTitle.Add)
      this.form.id = this.Guid.Empty
      if (row) {
        this.ps = true
        this.parentMenuName = row.menuName
        this.form.parentId = row.id
      } else {
        this.ps = false
      }

      this.form.path = ''
      this.form.menuName = ''
      this.form.menuNameEn = ''
      this.form.menuNameRu = ''
      this.form.menuUrl = ''
      this.form.menuType = 0
      this.form.icon = ''
      this.form.code = ''
      this.form.serialNumber = ''
      this.form.remark = ''

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
        this.title = this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Menu.DialogTitle.Edit)
        Object.assign(this.form, response.object)
        this.dialogFormVisible = true
        this.change()
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
    generateIconCode: function(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    handleClipboard: function(text) {
      this.form.icon = text
      this.dialogIconVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.colWidth {
  width: 250px;
}

.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
