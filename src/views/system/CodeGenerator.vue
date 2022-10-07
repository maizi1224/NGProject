<template>
  <div class="app-container">
    <el-row style="margin-bottom: 5px;">
      <el-col>
        <el-button
          :disabled="delDisabled"
          icon="el-icon-edit"
          plain
          size="mini"
          type="success"
          @click="generate"
        >
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.CodeGenerator.Button.Generate) }}
        </el-button>
        <el-button
          v-if="ButtonPermission('language:query:list')"
          icon="el-icon-refresh"
          plain
          size="mini"
          type="info"
          @click="InitData"
        >
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Refresh) }}
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
        prop="tableName"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.CodeGenerator.Gird.TableName)"
      />
      <el-table-column
        prop="createTime"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.CreateTime)"
      >
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tableComment"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.CodeGenerator.Gird.TableComment)"
      />
    </el-table>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" class="demo-ruleForm">
      <el-card class="box-card">
        <el-form ref="form" :model="form" :rules="rules" label-width="110px" label-position="left">
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.CodeGenerator.Form.Field.EntityNamespace)"
              >
                <el-input
                  readonly
                  :value="en"
                  prefix-icon="el-icon-search"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="entityNamespace">
                <el-input
                  v-model="form.entityNamespace"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.CodeGenerator.Form.Placeholder.EntityNamespace)"
                  @blur="autoFill"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.CodeGenerator.Form.Field.ControllerNamespace)"
              >
                <el-input
                  readonly
                  :value="cn"
                  prefix-icon="el-icon-search"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="controllerNamespace">
                <el-input
                  v-model="form.controllerNamespace"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.CodeGenerator.Form.Placeholder.ControllerNamespace)"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.CodeGenerator.Form.Field.ServiceNamespace)"
              >
                <el-input
                  readonly
                  :value="sn"
                  prefix-icon="el-icon-search"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="serviceNamespace">
                <el-input
                  v-model="form.serviceNamespace"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.CodeGenerator.Form.Placeholder.ServiceNamespace)"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.CodeGenerator.Form.Field.RepositoryNamespace)"
              >
                <el-input
                  readonly
                  :value="rn"
                  prefix-icon="el-icon-search"
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="repositoryNamespace">
                <el-input
                  v-model="form.repositoryNamespace"
                  :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.CodeGenerator.Form.Placeholder.RepositoryNamespace)"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                :label="BusinessLanguage.GetMenuName(BusinessLanguage.CodeGenerator.Form.Field.LayoutMode)"
              >
                <el-radio-group
                  v-model="form.layoutMode"
                  class="colWidth"
                >
                  <el-radio :label="0">{{
                    BusinessLanguage.GetMenuName(BusinessLanguage.CodeGenerator.Options.Layout.UpAndDown)
                  }}
                  </el-radio>
                  <el-radio :label="1">{{
                    BusinessLanguage.GetMenuName(BusinessLanguage.CodeGenerator.Options.Layout.LeftAndRight)
                  }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-circle-check" plain size="mini" type="success" @click="submit">
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
  name: 'CodeGenerator',
  extends: RuYiAdminBasePage,
  data() {
    return {
      en: null,
      cn: null,
      sn: null,
      rn: null,
      form: {
        entityNamespace: null,
        controllerNamespace: null,
        serviceNamespace: null,
        repositoryNamespace: null,
        tables: null,
        layoutMode: 0
      },
      rules: {
        entityNamespace: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.CodeGenerator.Form.Placeholder.EntityNamespace),
            trigger: 'blur'
          }
        ],
        controllerNamespace: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.CodeGenerator.Form.Placeholder.ControllerNamespace),
            trigger: 'blur'
          }
        ],
        serviceNamespace: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.CodeGenerator.Form.Placeholder.ServiceNamespace),
            trigger: 'blur'
          }
        ],
        repositoryNamespace: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.CodeGenerator.Form.Placeholder.RepositoryNamespace),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {},
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.url.queryList = 'CodeGenerator/Post'
    this.url.addEntity = 'CodeGenerator/CodeGenerate'
  },
  mounted() {
    const codeGeneratorConfig = JSON.parse(sessionStorage.getItem('codeGeneratorConfig'))
    this.en = codeGeneratorConfig.entityNamespace
    this.cn = codeGeneratorConfig.controllerNamespace
    this.sn = codeGeneratorConfig.serviceNamespace
    this.rn = codeGeneratorConfig.repositoryNamespace
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    generate: function() {
      this.title = this.BusinessLanguage.GetMenuName(this.BusinessLanguage.CodeGenerator.DialogTitle.Generate)
      this.dialogFormVisible = true
    },
    submit: function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const tables = this.multipleSelection.map((item) => {
            return "'" + item.tableName + "'"
          })
          this.form.tables = tables.toString()
          this.AddEntity(this.form).then(response => {
            this.dialogFormVisible = false
            this.delDisabled = true
            this.InitData()
            this.DownloadFile(
              'RoleManagement/DownloadZip/' + response.object,
              null,
              'RuYiAdmin-CodeGenerator.zip')
          })
        }
      })
    },
    autoFill: function() {
      if (this.form.entityNamespace != null) {
        this.form.controllerNamespace = this.form.entityNamespace
        this.form.serviceNamespace = this.form.entityNamespace
        this.form.repositoryNamespace = this.form.entityNamespace
      }
    }
  }
}
</script>

<style scoped>
.colWidth {
  width: 450px;
}
</style>
