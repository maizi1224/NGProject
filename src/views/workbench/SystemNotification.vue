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
          v-if="ButtonPermission('notification:query:list')"
          type="success"
          size="mini"
          icon="el-icon-search"
          plain
          @click="searchData"
        >
          查询
        </el-button>
        <el-button
          v-if="ButtonPermission('notification:query:list')"
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
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      stripe
      row-key="id"
      border
      :header-cell-style="{textAlign: 'center'}"
    >
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
        width="100"
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
        width="100"
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
      <el-table-column
        prop="readed"
        label="阅读情况"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.readed === 0" type="danger"> 未读</el-tag>
          <el-tag v-else type="info"> 已读</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Action)" width="100">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="info"
            icon="el-icon-search"
            @click="handleView(scope.$index, scope.row)"
          >{{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.View) }}
          </el-button>
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
      <el-tabs v-model="activeName">
        <el-tab-pane label="通知内容" name="first">
          <el-form ref="form" :model="form" style="width: 100%;overflow: auto;height: 400px;">
            <el-row>
              <el-col :span="24">
                <div>
                  <div style="text-align: center">{{ this.form.title }}</div>
                  <el-divider />
                  <div v-html="this.form.content" />
                </div>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="通知附件" name="second">
          <el-table
            v-loading="aLoading"
            :data="aTableData"
            style="width: 100%;overflow: auto;height: 400px;"
            stripe
            row-key="id"
            border
            :header-cell-style="{textAlign: 'center'}"
          >
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
            >
              <template slot-scope="scope">
                <el-link type="primary" @click="downloadAttachment(scope.row.id,scope.row.fileName)">
                  {{ scope.row.fileName }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="fileSize"
              label="文件大小"
              align="right"
              width="100"
            />
            <el-table-column
              prop="remark"
              label="单位"
              align="left"
              width="70"
            />
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" plain size="mini" type="danger" @click="closeDialog">
          关 闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'
import { generateQueryItem } from '@/utils/query-item'

export default {
  name: 'SystemNotification',
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
      aLoading: false,
      aTableData: [],
      activeName: 'first'
    }
  },
  created() {
    this.url.queryList = 'AnnouncementManagement/GetNotifications'
    this.url.queryEntity = 'AnnouncementManagement/GetById/'
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
    handleView: function(index, row) {
      debugger
      this.loading = true
      this.GetEntity(row.id).then(response => {
        Object.assign(this.form, response.object)
        this.loadAttachment(row.id)
        if (row.readed === 0) {
          this.updateNotificationStatus(row.id)
        }
        this.activeName = 'first'
        this.dialogFormVisible = true
        this.loading = false
      })
    },
    generateIndex: function(index) {
      return index + 1
    },
    loadAttachment: function(businessId) {
      this.aLoading = true
      this.RuYiAdmin.GetEntity('AttachmentManagement/GetAttachments/', businessId).then(response => {
        this.aTableData = response.list
        this.aLoading = false
      })
    },
    updateNotificationStatus: function(businessId) {
      this.RuYiAdmin.GetEntity('AnnouncementManagement/UpdateNotificationStatus/', businessId)
    },
    downloadAttachment: function(id, fileName) {
      const url = 'AttachmentManagement/DownloadAttachment/' + id
      this.DownloadFile(url, null, fileName)
    },
    closeDialog: function() {
      this.dialogFormVisible = false
      this.searchData()
    }
  }
}
</script>

<style scoped>

</style>

