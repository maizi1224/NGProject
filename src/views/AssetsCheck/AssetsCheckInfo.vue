<template>
  <div id="primary" class="app-container">
    <el-form
      ref="queryForm"
      :model="queryForm"
      label-width="100px"
      :inline="true"
      border
      size="mini"
    >
      <el-form-item label="资产编码" prop="id">
        <el-input v-model="queryForm.assetsId" placeholder=" 资产编码" prefix-icon="el-icon-search" clearable @keyup.enter.native="searchData" />
      </el-form-item>
      <!-- <el-form-item label="资产名称" prop="id">
        <el-input v-model="queryForm.assetsName" placeholder=" 资产名称" prefix-icon="el-icon-search" clearable @keyup.enter.native="searchData" />
      </el-form-item> -->

      <el-form-item inline="true">
        <el-button
          v-if="ButtonPermission('Asset:qurey:list')"
          type="success"
          size="mini"
          icon="el-icon-search"
          plain
          @click="searchData"
        >{{
          BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Search)
        }}
        </el-button>
        <el-button
          v-if="ButtonPermission('Asset:qurey:list')"
          type="warning"
          size="mini"
          icon="el-icon-refresh-left"
          plain
          @click="ResetQueryFrom"
        >{{
          BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Reset)
        }}
        </el-button>

      </el-form-item>

    </el-form>

    <!--
      新增丶修改丶删除丶刷新 功能按钮
     -->
    <el-row style="margin-bottom: 5px">
      <el-col>
        <el-button
          v-if="ButtonPermission('assetinfo:add:entity')"
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
          v-if="ButtonPermission('asset:edit:entity')"
          :disabled="editDisabled"
          icon="el-icon-edit"
          plain
          size="mini"
          type="success"
          @click="edit"
        >
          {{
            BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Edit)
          }}
        </el-button>
        <el-button
          v-if="ButtonPermission('asset:delete:entity')"
          :disabled="editDisabled"
          icon="el-icon-circle-close"
          plain
          size="mini"
          type="danger"
          @click="del"
        >{{
          BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Delete)
        }}
        </el-button>
        <el-button
          type="success"
          icon="el-icon-refresh-left"
          plain
          size="mini"
          @click="refresh"
        >
          {{
            BusinessLanguage.GetMenuName(
              BusinessLanguage.AssetMent.Placeholder.Refresh
            )
          }}
        </el-button>

      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      align="center"
      stripe
      border
      :header-cell-style="{ textAlign: 'center' }"
      @selection-change="HandleSelectionChange"
      @row-dblclick="dbclick"
    >
      <el-table-column align="center" type="selection" />
      <el-table-column prop="assetsId" align="center" label="资产编码" />
      <el-table-column prop="assetsName" align="center" width="200" label="资产名称" />
      <el-table-column prop="checkTime" align="center" width="200" :formatter="dateFormat" label="巡检时间" />
      <el-table-column prop="checkProblem" align="center" width="200" label="巡检问题" />
      <el-table-column prop="problemFix" width="100" align="center" label="问题整改" />

    </el-table>
    <div class="pagination">
      <el-pagination
        background
        :current-page.sync="queryCondition.PageIndex"
        :page-sizes="[10, 15, 20, 40, 60, 80, 100]"
        :page-size="queryCondition.PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryCondition.TotalCount"
        @size-change="HandleSizeChange"
        @current-change="HandleCurrentChange"
      />
    </div>
    <el-drawer ref="drawer" :title="title" :visible.sync="dialogFormVisible" direction="ttb" :before-close="handleClose" size="100%" class="Maindrawer">
      <el-card class="box-card">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="auto"
          label-position="left"
          size="small"
          class="overflowauto"
          :disabled="Isdisabled"
        >

          <template slot="title">
            <p>巡检管理  </p><i class="header-icon el-icon-notebook-2" />
          </template>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label=""
                prop="assetsFor"
                class="lineheight"
              />
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="巡检人姓名" label-width="90px" prop="checkName">
                <el-input v-model="form.checkName" class="col3" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="巡检人号码" label-width="90px" prop="checkPhone">
                <el-input v-model="form.checkPhone" class="col3" />
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>

            <el-col :span="8">
              <el-form-item
                label="资产名称"
                label-width="90px"
                prop="assetsId"
              >
                <el-select v-model="form.assetsId" class="col3">
                  <el-option
                    v-for="item in optionsAssets"
                    :key="item.assetsCode"
                    :label="item.assetsName"
                    :value="item.assetsCode"
                  />
                </el-select>

              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="巡检时间" label-width="90px" prop="checkTime">
                <el-date-picker v-model="form.checkTime" :picker-options="pickerOptions" type="date" class="col3" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="巡检类型"
                label-width="90px"
              >
                <el-select v-model="form.checkType" class="col3">
                  <el-option
                    v-for="item in options5"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-form-item label="巡检问题" label-width="90px" class="nowrap">
              <el-col :span="24">
                <el-input
                  v-model="form.checkProblem"
                  class="htbz"
                  type="textarea"
                />
              </el-col>
            </el-form-item>

          </el-row>

          <el-row>
            <el-form-item label="问题整改" label-width="90px" class="nowrap">
              <el-col :span="24">
                <el-input
                  v-model="form.problemFix"
                  class="htbz"
                  type="textarea"
                />
              </el-col>
            </el-form-item>

          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item
                label="纸质合同附件"
                label-width="100px"
              >

                <el-upload
                  class="upload-demo"
                  :headers="headers"
                  action=""
                  :before-remove="beforeRemove"
                  :multiple="true"
                  :limit="limit"
                  :auto-upload="false"
                  :on-exceed="handleExceed"
                  :on-change="(file,file_list)=>{return fileChange(file,file_list,'3',index)}"
                  :on-preview="handlePreview"
                  :file-list="form.contractPdfGroupFiles"
                >
                  <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                  <el-button size="small" type="success" style="margin-left:50px" @click="submitUpload('3',index)">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </el-card>
      <div class="demo-drawer__footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" :disabled="Isdisabled" :loading="loading" @click="SubmitForm">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        <!-- <el-button @click="printForm">打 印</el-button> -->
      </div>
    </el-drawer>
  </div>
</template>
<script>
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'
import { generateQueryItem } from '@/utils/query-item'

export default {

  extends: RuYiAdminBasePage,

  data() {
    return {
      limit: 50,
      dialogFormVisible: false,
      queryForm: {
        assetsName: null,
        assetsId: null

      }, options8: [
        {
          value: 2,
          label: '不存在逾期'
        },
        {
          value: 1,
          label: '合同逾期'
        },
        {
          value: 0,
          label: '合同完结'
        }

      ],
      options7: [
        {
          value: -1,
          label: ' '
        },
        {
          value: 0,
          label: '半年一交'
        },
        {
          value: 1,
          label: '一年一交'
        }

      ],
      rules: {
        checkTime: [
          { required: true, message: '请选择巡检时间', trigger: 'change' }
        ],

        checkName: [
          { required: true, message: '巡检人名称不能为空', trigger: 'blur' }

        ],
        checkPhone: [
          { required: true, message: '巡检人号码不能为空', trigger: 'blur' }

        ],

        contractPrice: [
          { required: true, message: '年租金不能为空', trigger: 'blur' },
          { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '年租金需为数字', trigger: 'blur' }
        ],
        contractMoney: [
          { required: true, message: '合同总金额不能为空', trigger: 'blur' },
          { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '合同总金额需为数字', trigger: 'blur' }
        ],
        lessee: [
          { required: true, message: '承租方(乙方)不能为空', trigger: 'blur' }
        ],
        lessor: [
          { required: true, message: '出租方(甲方)不能为空', trigger: 'blur' }
        ],
        assetsId: [
          { required: true, message: '资产名称不能为空', trigger: 'blur' }
        ],
        lessorPhone: [
          { required: true, message: '甲方联系方式不能为空', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '甲方联系方式需为号码', trigger: 'blur' }
        ],
        lesseePhone: [
          { required: true, message: '乙方联系方式不能为空', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '乙方联系方式需为号码', trigger: 'blur' }
        ]
      },
      IsdisabledDate: false,
      Isdisabled: false,
      form: {
        id: null,
        checkName: null,
        checkPhone: null,
        checkType: new Date(),
        assetsId: null,
        assetsName: null,
        checkTime: null,
        fileGroupsId: null,
        checkProblem: null,
        problemFix: null,
        contractPdfGroupFiles: [],
        isDel: '',
        creator: '',
        createTime: '',
        modifier: '',
        modifyTime: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }]
      },
      options5: [
        {
          value: -1,
          label: ' '
        },
        {
          value: 0,
          label: '现场巡检'
        },
        {
          value: 1,
          label: '监控巡检'
        }

      ]
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.url.queryList = 'AssetsCheck/GetCheckList'
    this.url.queryEntity = 'AssetsCheck/GetEntityById/'
    this.url.addEntity = 'AssetsCheck/AddEntity'
    this.url.editEntity = 'AssetsCheck/EditEntity'
    this.url.deleteEntity = 'AssetsCheck/DeleteEntityById/'
    this.queryCondition.Sort = 'Id ASC'
    this.refreshLocalToken()
    this.GetAllAssets()
  },
  methods: {
    refresh: function() {
      this.InitData()
    },
    del: function() {
      this.$confirm(
        '是否确认删除?',
        '确认信息',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        if (this.multipleSelection.length === 1) {
          this.PostData('AssetsCheck/DeleteById', { id: this.multipleSelection[0].id }).then(response => {
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
    },
    edit: function() {
      this.loading = true
      this.GetEntity(this.multipleSelection[0].id).then((response) => {
        this.title = '修改合同'
        Object.assign(this.form, response.object)
        this.dialogFormVisible = true
        this.loading = false
        this.Isdisabled = false
        this.IsdisabledDate = true
      })
    },
    fileChange(file, fileList, param, p2) {
      this.form.contractPdfGroupFiles = fileList
    },
    SubmitForm: function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id === '') {
            this.form.id = this.Guid.Empty
            this.form.remark = ''
            this.AddEntity(this.form).then(response => {
              this.$message({
                showClose: true,
                message: '巡检管理新建成功',
                type: 'success'
              })
              this.loading = false
              this.dialogFormVisible = false
              this.InitData()
            })
          } else {
            this.EditEntity(this.form).then(response => {
              this.$message({
                showClose: true,
                message: '巡检管理修改成功',
                type: 'success'
              })
              this.loading = false
              this.dialogFormVisible = false
              this.InitData()
            })
          }
        }
      })
    },
    resetForm: function() {
      this.form.id = ''
      this.form.checkName = null
      this.form.checkPhone = null
      this.form.checkType = -1
      this.form.assetsId = null
      this.form.assetsName = null
      this.form.checkTime = new Date()
      this.form.fileGroupsId = null
      this.form.checkProblem = null
      this.form.problemFix = null
      this.form.contractPdfGroupFiles = []
      this.form.isDel = this.DeletionType.Undeleted
      this.form.creator = this.Guid.Empty
      this.form.createTime = this.DateTime.Default
      this.form.modifier = this.Guid.Empty
      this.form.modifyTime = this.DateTime.Default
    },
    add: function() {
      this.resetForm()
      this.title = '新增巡检管理'
      this.dialogFormVisible = true
      this.Isdisabled = false
      this.IsdisabledDate = false
    },
    handlePreview: function(file) {
      this.DownloadFile(
        'Files/DownloadFiles/', file.id, file.name
      )
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消' }).then(() => {
        this.DeleteFile('Files/DeleteFiles/', file.id).then(response => {
          if (response.message === 'OK') {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            return true
          } else {
            this.$message({
              showClose: true,
              message: '删除失败',
              type: 'error'
            })
            return false
          }
        })
      })
    },
    dateFormat(row, column, cellValue, index) {
      return row[column.property].replace('T', ' ')
    },
    submitUpload(param, p2) { // 提交点击
      this.uploadFile(param, p2)
    },
    handleClose(done) {
      if (this.loading) {
        return
      }
      this.loading = true
      this.timer = setTimeout(() => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        // 动画关闭需要一定的时间
        setTimeout(() => {
          this.loading = false
          this.dialogFormVisible = false
          clearTimeout(this.timer)
        }, 400)
      }, 2000)
    },
    cancelForm() {
      if (this.Isdisabled) {
        this.loading = false
        this.dialogFormVisible = false
        clearTimeout(this.timer)
      } else {
        this.$confirm('是否在离开前保存资产信息?', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '保存',
          cancelButtonText: '放弃修改'
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.loading = false
            this.dialogFormVisible = false
            clearTimeout(this.timer)
          })
          .catch(action => {
            this.$message({
              type: 'info',
              message: action === 'cancel'
                ? '放弃保存并离开页面'
                : '停留在当前页面'
            })
            this.loading = false
            this.dialogFormVisible = false
            clearTimeout(this.timer)
          })
      }
    },
    async printForm() {
      // 调用子组件方法-进行数据封装
      await this.$refs.PrintView.getCheckUser(this.infoForm.checkUserId, this.infoForm.copyUserId)
      // 调用工具类中的打印方法，进行打印
      this.$print(this.$refs.PrintView.$el, { 'styleStr': '#PrintView{display:block !important;}' })
    },
    uploadFile(param, p2) { // 文件上传方法
      this.refreshLocalToken()
      const formData = new FormData()

      this.form.contractPdfGroupFiles.forEach(file => {
        formData.append('multipartFiles', file.raw)
      })

      const VueThis = this
      this.PostData('/Files/UploadFiles', formData).then(response => {
        this.$message({
          showClose: true,
          message: '成功',
          type: 'success'
        })
        const files = []
        response.object.forEach(element => {
          VueThis.form.fileGroupsId = element.fileId
          VueThis.form.ContractPdfGroupId = element.fileId
          files.push({ name: element.fileName, url: element.fileUrl, id: element.id })
        })
        VueThis.form.contractPdfGroupFiles.forEach(element => {
          if (element.id) {
            files.push(element)
          }
        })
        VueThis.form.contractPdfGroupFiles = files
      })
    },
    refreshLocalToken: function() {
      this.RuYiAdmin.RefreshLocalToken()
      this.headers = {
        'Authorization': 'Bearer ' + sessionStorage.getItem('access-token'),
        'RefreshToken': sessionStorage.getItem('refresh-token'),
        'token': sessionStorage.getItem('EncryptUserToken'),
        'ts': sessionStorage.getItem('ts')
      }
    },
    searchData: function() {
      this.queryCondition.PageIndex = 0
      this.queryCondition.QueryItems = []
      if (this.queryForm.assetsId) {
        this.queryCondition.QueryItems.push(
          generateQueryItem(
            'assetsId',
            this.DataType.String,
            this.QueryMethod.Like,
            this.queryForm.assetsId
          )
        )
      }
      if (this.queryForm.assetsName) {
        this.queryCondition.QueryItems.push(
          generateQueryItem(
            'assetsName',
            this.DataType.String,
            this.QueryMethod.Like,
            this.queryForm.assetsName
          )
        )
      }
      this.InitData()
    }, dbclick: function(row, column) {
      this.loading = true
      this.GetEntity(row.id).then((response) => {
        this.title = '查看合同'
        Object.assign(this.form, response.object)
        this.dialogFormVisible = true
        this.loading = false
        this.Isdisabled = true
        this.IsdisabledDate = true
      })
    }
  }}
</script>
<style scoped>
.box-card {
width: 1200px;
margin: auto;
}
.colWidth
{
width: 240px;

}
.colWidth2
{
width: 92%;
}
.upload-demo
{
width:100%;
text-align: left;
}
.Maindrawer  {
text-align: center;
}
.overflowauto{
  overflow-y: auto;
  width: 100%;
  height: 750px;
  padding-right: 15px;
}
.overflowauto::-webkit-scrollbar
{
height: 6px;
width: 6px;
margin-left: 10px;
}
.overflowauto::-webkit-scrollbar-thumb{
background: rgb(224, 214, 235);
}
.demo-drawer__footer{
margin-top: 10px;
}
/deep/ .el-collapse-item__header{
font-weight: 700;
padding-left: 45%;
}
/deep/ .el-form-item__label-wrap
{
margin-left: 15px;
}
/* /deep/ .el-form-item__label
{
  line-height: 20px;
} */
.header-icon{
margin-left: 5px;
}
.nowrap{
white-space: nowrap;
}
.col3{
margin-left: -60px;
width: 200px;
}
.htbz{
margin-left: -50px;
width: 92%;
}
.lineheight /deep/ .el-form-item__label{
line-height: 20px;
}
</style>
