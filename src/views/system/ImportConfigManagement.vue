<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryForm" label-width="100px" :inline="true" border>
      <el-form-item label="配置名称：" prop="configName">
        <el-input
          v-model="queryForm.configName"
          placeholder="请输入配置名称"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchData"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="ButtonPermission('import:config:query:list')"
          type="success"
          size="mini"
          icon="el-icon-search"
          plain
          @click="searchData"
        >
          查询
        </el-button>
        <el-button
          v-if="ButtonPermission('import:config:query:list')"
          type="warning"
          size="mini"
          icon="el-icon-refresh-left"
          plain
          @click="ResetQueryFrom"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 5px;">
      <el-col>
        <el-button
          v-if="ButtonPermission('import:config:add:entity')"
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
          v-if="ButtonPermission('import:config:edit:entity')"
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
          v-if="ButtonPermission('import:config:del:entities')"
          :disabled="delDisabled"
          icon="el-icon-circle-close"
          plain
          size="mini"
          type="danger"
          @click="Delete"
        >
          删除
        </el-button>
        <el-button
          v-if="ButtonPermission('import:config:query:list')"
          :disabled="editDisabled"
          type="info"
          size="mini"
          icon="el-icon-share"
          plain
          @click="showDetail"
        >
          配置项
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
        width="65"
      />
      <el-table-column
        type="index"
        label="序号"
        width="60"
        :index="IndexMethod"
        align="center"
      />
      <el-table-column
        prop="configName"
        label="配置名称"
      />
      <el-table-column
        prop="startRow"
        label="起始行"
        align="center"
        width="80"
      />
      <el-table-column
        prop="startColumn"
        label="起始列"
        align="center"
        width="80"
      />
      <el-table-column
        prop="workSheetIndexes"
        label="索引集"
        align="center"
      />
      <el-table-column
        prop="serialNumber"
        label="排序"
        align="center"
        width="60"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160"
      >
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
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
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
          <el-row>
            <el-col :span="24">
              <el-form-item label="配置名称" prop="configName">
                <el-input
                  v-model="form.configName"
                  prefix-icon="el-icon-search"
                  placeholder="请输入配置名称"
                  style="width: 585px;"
                  :readonly="readonly"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="起始行" prop="startRow">
                <el-input-number
                  v-model="form.startRow"
                  :min="0"
                  placeholder="请输入起始行"
                  label="请输入起始行"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="起始列" prop="startColumn">
                <el-input-number
                  v-model="form.startColumn"
                  :min="0"
                  placeholder="请输入起始列"
                  label="请输入起始列"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工作簿索引集" prop="WorkSheetIndexes">
                <el-input
                  v-model="form.workSheetIndexes"
                  placeholder="请输入索引集，以英文逗号隔开"
                  label="请输入工作簿索引集"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="序号" prop="SerialNumber">
                <el-input-number
                  v-model="form.serialNumber"
                  :min="0"
                  placeholder="请输入序号"
                  label="请输入序号"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="Remark">
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  prefix-icon="el-icon-search"
                  placeholder="请输入备注"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-circle-check" plain size="mini" type="success" @click="SubmitForm">
          确 定
        </el-button>
        <!--          <el-button icon="el-icon-refresh-left" plain size="mini" type="warning" @click="resetForm">重 置</el-button>-->
        <el-button icon="el-icon-close" plain size="mini" type="danger" @click="dialogFormVisible = false">
          取 消
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入配置明细" width="1200px" :visible.sync="detailDialogVisible">
      <el-form
        ref="detailForm"
        :model="detailForm"
        :rules="detailFormRules"
        label-width="100px"
        label-position="left"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="数据类型" prop="dataType">
              <el-select v-model="detailForm.dataType" class="colWidth" clearable placeholder="请选择">
                <el-option
                  v-for="item in dtOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  class="colWidth"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在列" prop="cells">
              <el-input
                v-model="detailForm.cells"
                placeholder="请输入所在列，以英文逗号隔开"
                label="请输入所在列"
                class="colWidth"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否必填" prop="Required">
              <el-select v-model="detailForm.required" class="colWidth" clearable placeholder="请选择">
                <el-option
                  v-for="item in ynOptions"
                  :key="item.value"
                  :label="item.codeName"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="最大值" prop="MaxValue">
              <el-input
                v-model="detailForm.maxValue"
                type="number"
                placeholder="请输入最大值"
                label="请输入最大值"
                class="colWidth"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最小值" prop="MinValue">
              <el-input
                v-model="detailForm.minValue"
                type="number"
                placeholder="请输入最小值"
                label="请输入最小值"
                class="colWidth"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="小数位数" prop="DecimalLimit">
              <el-input-number
                v-model="detailForm.decimalLimit"
                :min="0"
                placeholder="请输入所在列"
                label="请输入所在列"
                class="colWidth"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="枚举值" prop="TextEnum">
              <el-input
                v-model.trim="detailForm.textEnum"
                placeholder="请输入枚举值，以英文逗号隔开"
                label="请输入枚举值"
                class="colWidth"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="正则表达式" prop="Extend1">
              <el-input
                v-model.trim="detailForm.extend1"
                placeholder="请输入正则表达式"
                label="请输入正则表达式"
                class="colWidth"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button icon="el-icon-circle-check" plain size="mini" type="success" @click="submitDetailForm">
              确 定
            </el-button>
            <el-button icon="el-icon-refresh-left" plain size="mini" type="warning" @click="resetDetailForm">
              重 置
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        v-loading="detailLoading"
        :data="detailList"
        element-loading-text="loading"
        border
        fit
        highlight-current-row
        style="height: 300px;overflow: auto;"
        stripe
        row-key="id"
        :header-cell-style="{textAlign: 'center'}"
      >
        <el-table-column
          prop="dataType"
          label="数据类型"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <span>{{ CellDataType.getCellDataType(scope.row.dataType) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cells"
          label="所在列"
          align="center"
          width="80"
        />
        <el-table-column
          prop="required"
          label="必填项"
          align="center"
          width="70"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.required && scope.row.required === 1 ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="maxValue"
          label="最大值"
          align="right"
          width="70"
        />
        <el-table-column
          prop="minValue"
          label="最小值"
          align="right"
          width="70"
        />
        <el-table-column
          prop="decimalLimit"
          label="小数位数"
          align="right"
          width="80"
        />
        <el-table-column
          prop="textEnum"
          label="枚举值"
          width="200"
        />
        <el-table-column
          prop="extend1"
          label="正则表达式"
        />
        <el-table-column align="center" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              plain
              type="success"
              size="mini"
              icon="el-icon-edit"
              @click="editDetail(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              plain
              size="mini"
              icon="el-icon-circle-close"
              type="danger"
              @click="deleteDetail(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'
import { generateQueryItem } from '@/utils/query-item'

export default {
  name: 'ImportConfigManagement',
  extends: RuYiAdminBasePage,
  data() {
    return {
      queryForm: {
        configName: null
      },
      form: {
        id: null,
        configName: null,
        startRow: null,
        startColumn: null,
        workSheetIndexes: null,
        serialNumber: null,
        remark: null,
        isDel: null,
        creator: null,
        createTime: null,
        modifier: null,
        modifyTime: null
      },
      rules: {
        configName: [
          { required: true, message: '请输入配置名称', trigger: 'blur' },
          { min: 0, max: 128, message: '长度在 0 到 128 个字符', trigger: 'blur' }
        ],
        startRow: [
          { required: true, message: '请输入起始行', trigger: 'blur' }
        ],
        startColumn: [
          { required: true, message: '请输入起始列', trigger: 'blur' }
        ]
      },
      detailDialogVisible: false,
      detailList: [],
      detailLoading: false,
      ynOptions: null,
      dtOptions: null,
      detailForm: {
        id: null,
        parentId: null,
        dataType: null,
        cells: null,
        required: null,
        maxValue: null,
        minValue: null,
        decimalLimit: null,
        textEnum: null,
        extend1: null,
        extend2: null,
        extend3: null,
        serialNumber: null,
        remark: null,
        isDel: null,
        creator: null,
        createTime: null,
        modifier: null,
        modifyTime: null
      },
      detailFormRules: {
        dataType: [
          { required: true, message: '请选择数据类型', trigger: 'blur' }
        ],
        cells: [
          { required: true, message: '请输入所在列', trigger: 'blur' }
        ]
      },
      readonly: null
    }
  },
  watch: {},
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.url.queryList = 'ImportConfigManagement/Post'
    this.url.queryEntity = 'ImportConfigManagement/GetById/'
    this.url.addEntity = 'ImportConfigManagement/AddConfig'
    this.url.editEntity = 'ImportConfigManagement/EditConfig'
    this.url.deleteEntity = 'ImportConfigManagement/DeleteConfig/'
    this.url.deleteEntities = 'ImportConfigManagement/DeleteConfigs/'
    this.queryCondition.Sort = 'CREATE_TIME DESC'
  },
  mounted() {
    this.getCodes('YesOrNo').then(response => {
      this.ynOptions = response.object
    })
    this.dtOptions = this.CellDataType.getCellDataTypeKv()
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    searchData: function() {
      this.queryCondition.PageIndex = 0
      this.queryCondition.QueryItems = []
      if (this.queryForm.configName) {
        this.queryCondition.QueryItems.push(
          generateQueryItem('CONFIG_NAME',
            this.DataType.String,
            this.QueryMethod.Like,
            this.queryForm.configName))
      }
      this.InitData()
    },
    add: function() {
      this.resetForm()
      this.title = '新增配置'
      this.form.id = this.Guid.Empty
      this.form.configName = null
      this.form.startRow = null
      this.form.startColumn = null
      this.form.workSheetIndexes = null
      this.form.isDel = this.DeletionType.Undeleted
      this.form.creator = this.Guid.Empty
      this.form.createTime = this.DateTime.Default
      this.form.modifier = this.Guid.Empty
      this.form.modifyTime = this.DateTime.Default
      this.readonly = false
      this.dialogFormVisible = true
    },
    edit: function() {
      this.loading = true
      this.resetForm()
      this.GetEntity(this.multipleSelection[0].id).then(response => {
        this.title = '编辑配置'
        Object.assign(this.form, response.object)
        this.readonly = true
        this.dialogFormVisible = true
        this.loading = false
      })
    },
    resetForm: function() {
      this.form.id = null
      this.form.configName = null
      this.form.startRow = null
      this.form.startColumn = null
      this.form.workSheetIndexes = null
      this.form.serialNumber = null
      this.form.remark = null
      this.form.isDel = null
      this.form.creator = null
      this.form.createTime = null
      this.form.modifier = null
      this.form.modifyTime = null
    },
    showDetail: function() {
      this.detailLoading = true
      this.resetDetailForm()
      const id = this.multipleSelection[0].id
      this.RuYiAdmin.GetEntity('ImportConfigManagement/GetByParentId/', id).then(response => {
        this.detailList = response.object
        this.detailDialogVisible = true
        this.detailLoading = false
      })
    },
    editDetail: function(index, row) {
      Object.assign(this.detailForm, row)
      if (row.required) {
        this.detailForm.required = row.required.toString()
      }
    },
    deleteDetail: function(index, row) {
      this.$confirm('确定要将数据删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.RuYiAdmin.DeleteEntity('ImportConfigManagement/DeleteConfigDetail/', row.id).then(response => {
          this.$message({ showClose: true, message: '删除成功', type: 'error' })
          this.showDetail()
        })
      })
    },
    submitDetailForm: function() {
      this.$refs.detailForm.validate((valid) => {
        if (valid) {
          if (!this.detailForm.minValue) {
            this.detailForm.minValue = null
          }
          if (!this.detailForm.maxValue) {
            this.detailForm.maxValue = null
          }
          if (this.detailForm.maxValue && this.detailForm.minValue &&
            this.detailForm.maxValue < this.detailForm.minValue) {
            this.$message({ showClose: true, message: '最大值应当大于最小值', type: 'error' })
            return
          }
          if (this.detailForm.id === this.Guid.Empty) {
            this.detailForm.parentId = this.multipleSelection[0].id
            this.detailForm.isDel = this.DeletionType.Undeleted
            this.detailForm.creator = this.Guid.Empty
            this.detailForm.createTime = this.DateTime.Default
            this.detailForm.modifier = this.Guid.Empty
            this.detailForm.modifyTime = this.DateTime.Default
            this.RuYiAdmin.AddEntity('ImportConfigManagement/AddConfigDetail', this.detailForm).then(response => {
              this.$message({ showClose: true, message: '保存成功', type: 'success' })
              this.resetDetailForm()
              this.showDetail()
            })
          } else {
            this.RuYiAdmin.EditEntity('ImportConfigManagement/EditConfigDetail', this.detailForm).then(response => {
              this.$message({ showClose: true, message: '编辑成功', type: 'success' })
              this.resetDetailForm()
              this.showDetail()
            })
          }
        }
      })
    },
    resetDetailForm: function() {
      this.detailForm.id = this.Guid.Empty
      this.detailForm.parentId = null
      this.detailForm.dataType = null
      this.detailForm.cells = null
      this.detailForm.required = null
      this.detailForm.maxValue = null
      this.detailForm.minValue = null
      this.detailForm.decimalLimit = null
      this.detailForm.textEnum = null
      this.detailForm.extend1 = null
      this.detailForm.extend2 = null
      this.detailForm.extend3 = null
      this.detailForm.serialNumber = null
      this.detailForm.remark = null
      this.detailForm.isDel = null
      this.detailForm.creator = null
      this.detailForm.createTime = null
      this.detailForm.modifier = null
      this.detailForm.modifyTime = null
    }
  }
}
</script>

<style scoped>
.colWidth {
  width: 240px;
}
</style>
