<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryForm" label-width="100px" :inline="true" border>
      <el-form-item label="模块简称" prop="moduleShortName">
        <el-input
          v-model="queryForm.moduleShortName"
          clearable
          placeholder="请输入模块或英文简称"
          size="small"
          prefix-icon="el-icon-search"
          @keyup.enter.native="searchData"
        />
      </el-form-item>
      <el-form-item label="模块地址" prop="moduleAddress">
        <el-input
          v-model="queryForm.moduleAddress"
          clearable
          placeholder="请输入ip或者域名"
          size="small"
          prefix-icon="el-icon-search"
          @keyup.enter.native="searchData"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="ButtonPermission('biz:module:list')"
          type="success"
          size="mini"
          icon="el-icon-search"
          plain
          @click="searchData"
        >查询
        </el-button>
        <el-button
          v-if="ButtonPermission('biz:module:list')"
          type="warning"
          size="mini"
          icon="el-icon-refresh-left"
          plain
          @click="ResetQueryFrom"
        >重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 5px;">
      <el-col>
        <el-button
          v-if="ButtonPermission('module:add:entity')"
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
          v-if="ButtonPermission('module:edit:entity')"
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
          v-if="ButtonPermission('module:del:entity')"
          :disabled="delDisabled"
          icon="el-icon-circle-close"
          plain
          size="mini"
          type="danger"
          @click="Delete"
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
      <el-table-column label="模块简称" prop="moduleShortName" />
      <el-table-column label="英文简称" prop="moduleShortNameEN" />
      <el-table-column label="采用协议" prop="moduleProtocol" />
      <el-table-column label="模块地址" prop="moduleAddress" />
      <el-table-column label="端口" prop="modulePort" />
      <el-table-column label="单点登录地址" prop="moduleSsoAddress" />
      <el-table-column label="待办服务地址" prop="moduleTodoAddress" />
      <el-table-column label="编号" prop="serialNumber" />
      <el-table-column prop="createTime" label="创建时间" width="160">
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
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
            <el-col :span="24">
              <el-form-item label="模块名称" prop="moduleName">
                <el-input
                  v-model="form.moduleName"
                  placeholder="请输入模块名称"
                  prefix-icon="el-icon-search"
                  style="width: 605px;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模块简称" prop="moduleShortName">
                <el-input
                  v-model="form.moduleShortName"
                  placeholder="请输入模块简称"
                  prefix-icon="el-icon-search"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="英文简称" prop="moduleShortNameEn">
                <el-input
                  v-model="form.moduleShortNameEn"
                  placeholder="请输入模块英文简称"
                  prefix-icon="el-icon-search"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采用协议" prop="moduleProtocol">
                <el-select
                  v-model="form.moduleProtocol"
                  placeholder="请选择采用协议"
                  prefix-icon="el-icon-search"
                  class="colWidth"
                >
                  <el-option
                    v-for="item in protocols"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模块地址" prop="moduleAddress">
                <el-input
                  v-model="form.moduleAddress"
                  placeholder="请输入ip或者域名"
                  prefix-icon="el-icon-search"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模块端口" prop="modulePort">
                <el-input
                  v-model="form.modulePort"
                  placeholder="请输入模块端口"
                  prefix-icon="el-icon-search"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="logo位置" prop="moduleLogoAddress">
                <el-input
                  v-model="form.moduleLogoAddress"
                  placeholder="请输入logo地址"
                  prefix-icon="el-icon-search"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="SSO地址" prop="moduleSsoAddress">
                <el-input
                  v-model="form.moduleSsoAddress"
                  placeholder="请输入单点登录地址"
                  prefix-icon="el-icon-search"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="待办地址" prop="moduleTodoAddress">
                <el-input
                  v-model="form.moduleTodoAddress"
                  placeholder="请输入待办服务地址"
                  prefix-icon="el-icon-search"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="序号" prop="serialNumber">
                <el-input v-model="form.serialNumber" type="number" placeholder="请输入序号" size="medium" :min="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="Remark">
                <el-input
                  v-model="form.remark"
                  type="text"
                  placeholder="请输入备注"
                  prefix-icon="el-icon-search"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-circle-check" plain size="mini" type="success" @click="SubmitForm">确 定
        </el-button>
        <el-button icon="el-icon-close" plain size="mini" type="danger" @click="dialogFormVisible = false">取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'
import { generateQueryItem } from '@/utils/query-item'

export default {
  name: 'BizModule',
  extends: RuYiAdminBasePage,
  data() {
    return {
      queryForm: {
        moduleShortName: null,
        moduleAddress: null
      },
      form: {
        id: null,
        moduleName: null,
        moduleShortName: null,
        moduleShortNameEn: null,
        moduleProtocol: null,
        moduleAddress: null,
        modulePort: null,
        moduleLogoAddress: null,
        moduleSsoAddress: null,
        moduleTodoAddress: null,
        serialNumber: null,
        remark: null,
        isDel: null,
        creator: null,
        createTime: null,
        modifier: null,
        modifyTime: null
      },
      rules: {
        moduleName: [
          { required: true, message: '模块名称不能为空', trigger: 'blur' }
        ],
        moduleShortName: [
          { required: true, message: '模块简称不能为空', trigger: 'blur' }
        ],
        moduleShortNameEn: [
          { required: true, message: '模块英文简称不能为空', trigger: 'blur' }
        ],
        moduleProtocol: [
          { required: true, message: '模块协议不能为空', trigger: 'blur' }
        ],
        moduleAddress: [
          { required: true, message: '模块地址不能为空', trigger: 'blur' }
        ],
        moduleSsoAddress: [
          { required: true, message: '模块单点登录地址不能为空', trigger: 'blur' }
        ]
      },
      protocols: [{
        value: 'http',
        label: 'http'
      }, {
        value: 'https',
        label: 'https'
      }]
    }
  },
  watch: {},
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.url.queryList = 'BizModuleManagement/Post'
    this.url.queryEntity = 'BizModuleManagement/GetById/'
    this.url.addEntity = 'BizModuleManagement/Add'
    this.url.editEntity = 'BizModuleManagement/Put'
    this.url.deleteEntity = 'BizModuleManagement/Delete/'
    this.url.deleteEntities = 'BizModuleManagement/DeleteRange/'
    this.queryCondition.Sort = 'X.SERIAL_NUMBER ASC'
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
      if (this.queryForm.moduleShortName) {
        this.queryCondition.QueryItems.push(generateQueryItem(
          'MODULE_SHORT_NAME',
          this.DataType.String,
          this.QueryMethod.Like,
          this.queryForm.moduleShortName))
        this.queryCondition.QueryItems.push(generateQueryItem(
          'MODULE_SHORT_NAME_EN',
          this.DataType.String,
          this.QueryMethod.OrLike,
          this.queryForm.moduleShortName))
      }
      if (this.queryForm.moduleAddress) {
        this.queryCondition.QueryItems.push(generateQueryItem(
          'MODULE_ADDRESS',
          this.DataType.String,
          this.QueryMethod.Like,
          this.queryForm.moduleAddress))
      }
      this.InitData()
    },
    add: function() {
      this.resetForm()
      this.title = '新增模块'
      this.form.id = this.Guid.Empty
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
        this.title = '编辑模块'
        Object.assign(this.form, response.object)
        this.form.moduleShortNameEn = response.object.moduleShortNameEN
        this.dialogFormVisible = true
        this.loading = false
      })
    },
    resetForm: function() {
      this.form = {
        id: null,
        moduleName: null,
        moduleShortName: null,
        moduleShortNameEn: null,
        moduleProtocol: null,
        moduleAddress: null,
        modulePort: null,
        moduleLogoAddress: null,
        moduleSsoAddress: null,
        moduleTodoAddress: null,
        serialNumber: null,
        remark: null,
        isDel: null,
        creator: null,
        createTime: null,
        modifier: null,
        updateTime: null
      }
    }
  }
}
</script>
