<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryForm" label-width="100px" :inline="true" border>
      <el-form-item label="标题内容：" prop="title">
        <el-input
          v-model="queryForm.title"
          placeholder="请输入标题内容"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchData"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="ButtonPermission('announcement:query:list')"
          type="success"
          size="mini"
          icon="el-icon-search"
          plain
          @click="searchData"
        >
          查询
        </el-button>
        <el-button
          v-if="ButtonPermission('announcement:query:list')"
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
          v-if="ButtonPermission('announcement:add:entity')"
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
          v-if="ButtonPermission('announcement:edit:entity')"
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
          v-if="ButtonPermission('announcement:del:entities')"
          :disabled="delDisabled"
          icon="el-icon-circle-close"
          plain
          size="mini"
          type="danger"
          @click="Delete"
        >
          删除
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
        prop="title"
        label="标题"
      />
      <el-table-column
        prop="type"
        label="类型"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" type="success">公告</el-tag>
          <el-tag v-else type="success">通知</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="success"> 开放</el-tag>
          <el-tag v-else type="danger"> 关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160"
      >
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
      <el-form ref="form" :model="form" :rules="rules" label-width="50px" label-position="left">
        <el-tabs v-model="activeTabName" type="border-card">
          <el-tab-pane label="通知公告" name="first">
            <el-row>
              <el-col :span="24">
                <el-form-item label="标题" prop="title">
                  <el-input
                    v-model="form.title"
                    prefix-icon="el-icon-search"
                    placeholder="请输入标题"
                    style="width: 630px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="内容" prop="content">
                  <tinymce ref="xyz" v-model="form.content" :html="form.content" :width="630" :height="200" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="类型" prop="type">
                  <el-radio-group v-model="form.type" @change="typeChange">
                    <el-radio :label="0">公告</el-radio>
                    <el-radio :label="1">通知</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态" prop="status">
                  <el-radio-group v-model="form.status">
                    <el-radio :label="0">开放</el-radio>
                    <el-radio :label="1">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="邮件" prop="sendMail">
                  <el-radio-group v-model="form.sendMail" :disabled="mailDisabled">
                    <el-radio :label="false">否</el-radio>
                    <el-radio :label="true">是</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane v-if="hiddenAddresseeTab" label="人员列表" name="second">
            <el-tree
              ref="permissionTree"
              :data="permissionTreeData"
              show-checkbox
              default-expand-all
              node-key="id"
              highlight-current
              :props="permissionTreeProps"
              style="height: 450px;overflow: auto;"
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
          </el-tab-pane>
          <el-tab-pane v-if="hiddenAttachmentTab" label="附件" name="third">
            <el-row style="margin-bottom: 5px;">
              <el-col>
                <el-button
                  :disabled="attachmentDisabled"
                  icon="el-icon-circle-plus-outline"
                  plain
                  size="mini"
                  type="primary"
                  @click="uploadAttachment"
                >
                  上传
                </el-button>
                <el-button
                  icon="el-icon-edit"
                  plain
                  size="mini"
                  type="success"
                  @click="downloadAttachment"
                >
                  下载
                </el-button>
                <el-button
                  :disabled="attachmentDisabled"
                  icon="el-icon-circle-close"
                  plain
                  size="mini"
                  type="danger"
                  @click="deleteAttachment"
                >
                  删除
                </el-button>
              </el-col>
            </el-row>
            <el-table
              v-loading="aLoading"
              :data="aTableData"
              style="width: 100%;overflow: auto;height: 450px;"
              stripe
              row-key="id"
              border
              :header-cell-style="{textAlign: 'center'}"
              @selection-change="attachmentsSelectionChange"
            >
              <el-table-column
                align="center"
                type="selection"
              />
              <el-table-column
                type="index"
                label="序号"
                width="60"
                :index="generateIndex"
                align="center"
              />
              <el-table-column
                prop="fileName"
                label="文件名称"
              />
              <el-table-column
                prop="fileSize"
                label="文件大小"
                align="right"
                width="80"
              />
              <el-table-column
                prop="remark"
                label="单位"
                align="left"
                width="50"
              />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-circle-check" plain size="mini" type="success" @click="SubmitForm">
          确 定
        </el-button>
        <el-button icon="el-icon-close" plain size="mini" type="danger" @click="dialogFormVisible = false">
          取 消
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="上传附件"
      :visible.sync="uploadDialogVisible"
    >
      <el-upload
        class="upload-demo"
        :action="importUrl"
        :headers="headers"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :on-exceed="handleExceed"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :file-list="fileList"
      >
        <el-button size="small" type="primary" plain>
          点击上传
        </el-button>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'
import { generateQueryItem } from '@/utils/query-item'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'AnnouncementManagement',
  components: {
    Tinymce
  },
  extends: RuYiAdminBasePage,
  data() {
    return {
      queryForm: {
        title: null
      },
      form: {
        id: null,
        title: null,
        content: null,
        type: null,
        status: null,
        remark: null,
        isDel: null,
        creator: null,
        createTime: null,
        modifier: null,
        modifyTime: null,
        addressee: null,
        attachmentIds: null,
        sendMail: false
      },
      rules: {
        title: [
          { required: true, message: '请输入标题内容', trigger: 'blur' },
          { min: 0, max: 512, message: '长度在 0 到 512 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入通知公告内容', trigger: 'blur' }
        ]
      },
      activeTabName: 'first',
      hiddenAddresseeTab: false,
      hiddenAttachmentTab: false,
      permissionTreeData: null,
      permissionTreeProps: {
        children: 'children',
        label: 'name'
      },
      aLoading: false,
      aTableData: [],
      uploadDialogVisible: false,
      fileList: [],
      importUrl: null,
      headers: null,
      attachmentsSelection: null,
      attachmentDisabled: false,
      mailDisabled: true
    }
  },
  watch: {},
  created() {
    this.url.queryList = 'AnnouncementManagement/Post'
    this.url.queryEntity = 'AnnouncementManagement/GetById/'
    this.url.addEntity = 'AnnouncementManagement/Add'
    this.url.editEntity = 'AnnouncementManagement/Edit'
    this.url.deleteEntity = 'AnnouncementManagement/Delete/'
    this.url.deleteEntities = 'AnnouncementManagement/Delete/'
    this.queryCondition.Sort = 'CREATE_TIME DESC'
  },
  mounted() {
  },
  destroyed() {
  },
  methods: {
    searchData: function() {
      this.queryCondition.PageIndex = 0
      this.queryCondition.QueryItems = []
      if (this.queryForm.title) {
        this.queryCondition.QueryItems.push(
          generateQueryItem('TITLE', this.DataType.String, this.QueryMethod.Like, this.queryForm.title))
      }
      this.InitData()
    },
    add: function() {
      this.resetForm()
      this.title = '新增通知公告'
      this.activeTabName = 'first'
      this.form.id = this.Guid.Empty
      this.form.title = null
      this.form.content = null
      this.form.type = 0
      if (this.$refs.permissionTree !== undefined) {
        this.$refs.permissionTree.setCheckedKeys([])
      }
      this.permissionTreeData = []
      this.aTableData = []
      this.hiddenAddresseeTab = false
      this.hiddenAttachmentTab = false
      this.form.status = 1
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
      this.hiddenAttachmentTab = true
      this.GetEntity(this.multipleSelection[0].id).then(response => {
        this.title = '编辑通知公告'
        Object.assign(this.form, response.object)
        if (this.$refs['xyz'] !== undefined) {
          this.$refs['xyz'].setContent(this.form.content)
        }
        if (this.form.type === 1) {
          this.mailDisabled = false
          this.form.sendMail = false
          this.RuYiAdmin.GetList('OrganizationManagement/GetOrgUserTree', null).then(response => {
            this.permissionTreeData = response.list
            this.hiddenAddresseeTab = true
            this.activeTabName = 'first'
            this.dialogFormVisible = true
            this.loading = false
            this.RuYiAdmin.GetEntity('AnnouncementManagement/GetAnnouncementAddressee/', this.multipleSelection[0].id).then(res => {
              const ids = res.list.map((item) => {
                return item.userId
              })
              if (this.$refs.permissionTree !== undefined) {
                this.$refs.permissionTree.setCheckedKeys(ids)
              }
              this.loadAttachment()
            })
          })
        } else {
          if (this.$refs.permissionTree !== undefined) {
            this.$refs.permissionTree.setCheckedKeys([])
          }
          this.permissionTreeData = []
          this.hiddenAddresseeTab = false
          this.activeTabName = 'first'
          this.dialogFormVisible = true
          this.loading = false
          this.loadAttachment()
        }
      })
    },
    resetForm: function() {
      this.form.id = null
      this.form.title = null
      this.form.content = null
      this.form.type = null
      this.form.status = null
      this.form.remark = null
      this.form.isDel = null
      this.form.creator = null
      this.form.createTime = null
      this.form.modifier = null
      this.form.modifyTime = null
      this.form.addressee = null
      this.form.attachmentIds = null
      if (this.$refs['xyz'] !== undefined) {
        this.$refs['xyz'].setContent('')
      }
    },
    typeChange: function() {
      if (this.form.type === 1) {
        this.mailDisabled = false
        this.form.sendMail = false
        this.RuYiAdmin.GetList('OrganizationManagement/GetOrgUserTree', null).then(response => {
          this.permissionTreeData = response.list
          this.hiddenAddresseeTab = true
        })
      } else if (this.form.type === 0) {
        this.mailDisabled = true
        this.form.sendMail = false
        if (this.$refs.permissionTree !== undefined) {
          this.$refs.permissionTree.setCheckedKeys([])
        }
        this.permissionTreeData = []
        this.hiddenAddresseeTab = false
      }
    },
    SubmitForm: function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.DataVerification()) {
            return
          }
          if (this.form.type === 1) {
            let nodes = this.$refs.permissionTree.getCheckedNodes()
            nodes = nodes.filter(t => t.type === 2)
            const ids = nodes.map((item) => {
              return item.id
            })
            this.form.addressee = ids.toString()
          }
          if (this.form.id === this.Guid.Empty) {
            this.AddEntity(this.form).then(response => {
              this.$message({
                showClose: true,
                message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Message.Save),
                type: 'success'
              })
              this.dialogFormVisible = false
              this.editDisabled = true
              this.delDisabled = true
              this.InitData()
            })
          } else {
            this.EditEntity(this.form).then(response => {
              this.$message({
                showClose: true,
                message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Message.Edit),
                type: 'success'
              })
              this.dialogFormVisible = false
              this.editDisabled = true
              this.delDisabled = true
              this.InitData()
            })
          }
        }
      })
    },
    DataVerification: function() {
      if (this.form.type === 1) {
        let nodes = this.$refs.permissionTree.getCheckedNodes()
        nodes = nodes.filter(t => t.type === 2)
        if (nodes.length <= 0) {
          this.$message({
            showClose: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Message.SelectUser),
            type: 'warning'
          })
          return false
        }
      }
      return true
    },
    generateIndex: function(index) {
      return index + 1
    },
    loadAttachment: function() {
      this.aLoading = true
      const businessId = this.multipleSelection[0].id
      this.RuYiAdmin.GetEntity('AttachmentManagement/GetAttachments/', businessId).then(response => {
        this.aTableData = response.list
        this.attachmentDisabled = this.multipleSelection[0].status === 0
        this.aLoading = false
      })
    },
    attachmentsSelectionChange: function(val) {
      this.attachmentsSelection = val
    },
    uploadAttachment: function() {
      const id = this.multipleSelection[0].id
      this.refreshLocalToken()
      this.importUrl = process.env.VUE_APP_BASE_API + '/AttachmentManagement/UploadAttachments?businessId=' + id
      this.uploadDialogVisible = true
    },
    downloadAttachment: function() {
      const me = this
      me.attachmentsSelection.forEach(function(item, index) {
        const url = 'AttachmentManagement/DownloadAttachment/' + item.id
        me.DownloadFile(url, null, item.fileName)
      })
    },
    deleteAttachment: function() {
      this.$confirm('确定要将附件删除吗?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        const ids = this.attachmentsSelection.map((item) => {
          return item.id
        })
        const url = 'AttachmentManagement/DeleteAttachment/'
        this.RuYiAdmin.DeleteEntities(url, ids.toString()).then(response => {
          this.$message({ showClose: true, message: '删除成功', type: 'success' })
          this.loadAttachment()
        })
      })
    },
    handleRemove: function(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview: function(file) {
      console.log(file)
    },
    handleExceed: function(files, fileList) {
      console.log(files, fileList)
      // this.$message.warning(`file limited: 1,select: ${files.length},total: ${files.length + fileList.length}`)
    },
    beforeRemove: function(file, fileList) {
      console.log(file, fileList)
      // return this.$confirm(`are you sure you want to delete ${file.name}？`)
    },
    beforeUpload: function(file) {
      this.refreshLocalToken()
      // 获取上传文件大小
      const imgSize = Number(file.size / 1024 / 1024)
      if (imgSize > 20) {
        this.$msgbox({ title: '', message: '文件大小不能超过20MB', type: 'warning' })
        return false
      }
      return true
    },
    handleSuccess: function(response, file, fileList) {
      this.refreshLocalToken()
      this.loadAttachment()
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
  width: 240px;
}
</style>
