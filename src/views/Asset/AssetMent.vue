<template>
  <div class="app-container">
    <el-form
      ref="queryForm"
      :model="queryForm"
      label-width="100px"
      :inline="true"
      border
    >
      <el-form-item
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Placeholder.AssetMentCode
          )
        "
        prop="jobName"
      >
        <el-input
          v-model="queryForm.jobName"
          :placeholder="
            BusinessLanguage.GetMenuName(
              BusinessLanguage.AssetMent.Placeholder.Search
            )
          "
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchData"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="ButtonPermission('job:query:list')"
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
          v-if="ButtonPermission('job:query:list')"
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
      <el-form-item
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Placeholder.AssetCode
          )
        "
        prop="jobName"
      >
        <el-input
          v-model="queryForm.jobName"
          :placeholder="
            BusinessLanguage.GetMenuName(
              BusinessLanguage.AssetMent.Placeholder.Search
            )
          "
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchData"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="ButtonPermission('job:query:list')"
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
          v-if="ButtonPermission('job:query:list')"
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
      <el-form-item
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Placeholder.AssetMentTime
          )
        "
        prop="StartTime"
      >
        <el-date-picker
          v-model="form.startTime"
          type="date"
          :placeholder="
            BusinessLanguage.GetMenuName(
              BusinessLanguage.ScheduleJob.Form.Placeholder.StartTime
            )
          "
          class="colWidth"
        />
      </el-form-item>
      <el-form-item
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.ScheduleJob.Form.Field.EndTime
          )
        "
        prop="EndTime"
      >
        <el-date-picker
          v-model="form.endTime"
          type="date"
          :placeholder="
            BusinessLanguage.GetMenuName(
              BusinessLanguage.ScheduleJob.Form.Placeholder.EndTime
            )
          "
          class="colWidth"
        />
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 5px">
      <el-col>
        <el-button
          v-if="ButtonPermission('job:add:entity')"
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
          v-if="ButtonPermission('job:edit:entity')"
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
          v-if="ButtonPermission('job:del:entity')"
          :disabled="editDisabled"
          icon="el-icon-circle-close"
          plain
          size="mini"
          type="danger"
          @click="Delete"
        >{{
          BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Delete)
        }}
        </el-button>
        <el-button
          v-if="ButtonPermission('schedule:job:resume')"
          type="success"
          :disabled="editDisabled"
          icon="el-icon-refresh-left"
          plain
          size="mini"
          @click="resume"
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
      stripe
      row-key="id"
      border
      :header-cell-style="{ textAlign: 'center' }"
      @selection-change="HandleSelectionChange"
    >
      <el-table-column align="center" type="selection" />
      <el-table-column
        prop="serialNumber"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.Common.Grid.SerialNumber
          )
        "
        align="center"
        width="60"
      />
      <el-table-column
        type="index"
        :label="
          BusinessLanguage.GetMenuName(BusinessLanguage.AssetMent.Grid.AssetMentCode)
        "
        width="560"
        :index="IndexMethod"
        align="center"
      />
      <el-table-column
        prop="jobName"
        width="560"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.AssetMentTime
          )
        "
      />

    </el-table>
    <div class="pagination">
      <el-pagination
        :current-page="queryCondition.PageIndex"
        :page-sizes="[10, 15, 20, 40, 60, 80, 100]"
        :page-size="queryCondition.PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryCondition.TotalCount"
        @size-change="HandleSizeChange"
        @current-change="HandleCurrentChange"
      />
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      class="demo-ruleForm"
    >
      <el-card class="box-card">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="100px"
          label-position="left"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="
                  BusinessLanguage.GetMenuName(
                    BusinessLanguage.ScheduleJob.Form.Field.JobName
                  )
                "
                prop="jobName"
              >
                <el-input
                  v-model="form.jobName"
                  prefix-icon="el-icon-search"
                  :placeholder="
                    BusinessLanguage.GetMenuName(
                      BusinessLanguage.ScheduleJob.Form.Placeholder.JobName
                    )
                  "
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="
                  BusinessLanguage.GetMenuName(
                    BusinessLanguage.ScheduleJob.Form.Field.JobDescription
                  )
                "
                prop="jobDescription"
              >
                <el-input
                  v-model="form.jobDescription"
                  prefix-icon="el-icon-search"
                  :placeholder="
                    BusinessLanguage.GetMenuName(
                      BusinessLanguage.ScheduleJob.Form.Placeholder
                        .JobDescription
                    )
                  "
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="
                  BusinessLanguage.GetMenuName(
                    BusinessLanguage.ScheduleJob.Form.Field.NameSpace
                  )
                "
                prop="nameSpace"
              >
                <el-input
                  v-model="form.nameSpace"
                  prefix-icon="el-icon-search"
                  :placeholder="
                    BusinessLanguage.GetMenuName(
                      BusinessLanguage.ScheduleJob.Form.Placeholder.NameSpace
                    )
                  "
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="
                  BusinessLanguage.GetMenuName(
                    BusinessLanguage.ScheduleJob.Form.Field.JobImplement
                  )
                "
                prop="jobImplement"
              >
                <el-input
                  v-model="form.jobImplement"
                  prefix-icon="el-icon-search"
                  :placeholder="
                    BusinessLanguage.GetMenuName(
                      BusinessLanguage.ScheduleJob.Form.Placeholder.JobImplement
                    )
                  "
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="
                  BusinessLanguage.GetMenuName(
                    BusinessLanguage.ScheduleJob.Form.Field.CronExpression
                  )
                "
                prop="cronExpression"
              >
                <el-input
                  v-model="form.cronExpression"
                  prefix-icon="el-icon-search"
                  :placeholder="
                    BusinessLanguage.GetMenuName(
                      BusinessLanguage.ScheduleJob.Form.Placeholder
                        .CronExpression
                    )
                  "
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="
                  BusinessLanguage.GetMenuName(
                    BusinessLanguage.ScheduleJob.Form.Field.GroupId
                  )
                "
                prop="groupId"
              >
                <el-input
                  v-model="form.groupId"
                  prefix-icon="el-icon-search"
                  :placeholder="
                    BusinessLanguage.GetMenuName(
                      BusinessLanguage.ScheduleJob.Form.Placeholder.GroupId
                    )
                  "
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="
                  BusinessLanguage.GetMenuName(
                    BusinessLanguage.ScheduleJob.Form.Field.StartTime
                  )
                "
                prop="StartTime"
              >
                <el-date-picker
                  v-model="form.startTime"
                  type="datetime"
                  :placeholder="
                    BusinessLanguage.GetMenuName(
                      BusinessLanguage.ScheduleJob.Form.Placeholder.StartTime
                    )
                  "
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="
                  BusinessLanguage.GetMenuName(
                    BusinessLanguage.ScheduleJob.Form.Field.EndTime
                  )
                "
                prop="EndTime"
              >
                <el-date-picker
                  v-model="form.endTime"
                  type="datetime"
                  :placeholder="
                    BusinessLanguage.GetMenuName(
                      BusinessLanguage.ScheduleJob.Form.Placeholder.EndTime
                    )
                  "
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="
                  BusinessLanguage.GetMenuName(
                    BusinessLanguage.Common.Grid.Index
                  )
                "
                prop="SerialNumber"
              >
                <el-input-number
                  v-model="form.serialNumber"
                  :min="0"
                  :placeholder="
                    BusinessLanguage.GetMenuName(
                      BusinessLanguage.Common.Form.Placeholder.SerialNumber
                    )
                  "
                  :label="
                    BusinessLanguage.GetMenuName(
                      BusinessLanguage.Common.Form.Placeholder.SerialNumber
                    )
                  "
                  class="colWidth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="
                  BusinessLanguage.GetMenuName(
                    BusinessLanguage.Common.Grid.Remark
                  )
                "
                prop="Remark"
              >
                <el-input
                  v-model="form.remark"
                  type="text"
                  prefix-icon="el-icon-search"
                  :placeholder="
                    BusinessLanguage.GetMenuName(
                      BusinessLanguage.Common.Form.Placeholder.Remark
                    )
                  "
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button
          icon="el-icon-circle-check"
          plain
          size="mini"
          type="success"
          @click="SubmitForm"
        >
          {{
            BusinessLanguage.GetMenuName(BusinessLanguage.Common.Dialog.Sure)
          }}
        </el-button>
        <el-button
          icon="el-icon-close"
          plain
          size="mini"
          type="danger"
          @click="dialogFormVisible = false"
        >
          {{
            BusinessLanguage.GetMenuName(BusinessLanguage.Common.Dialog.Cancel)
          }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'
import { generateQueryItem } from '@/utils/query-item'

export default {
  name: 'ScheduleJobManagement',
  extends: RuYiAdminBasePage,
  data() {
    return {
      queryForm: {
        jobName: null
      },
      form: {
        id: null,
        jobName: null,
        jobDescription: null,
        nameSpace: null,
        jobImplement: null,
        cronExpression: null,
        startTime: null,
        endTime: null,
        groupId: null,
        serialNumber: null,
        remark: null,
        isDel: null,
        creator: null,
        createTime: null,
        modifier: null,
        modifyTime: null
      },
      rules: {
        jobName: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(
              this.BusinessLanguage.ScheduleJob.Form.Placeholder.JobName
            ),
            trigger: 'blur'
          },
          {
            min: 0,
            max: 128,
            message: this.BusinessLanguage.GetMenuName(
              this.BusinessLanguage.ScheduleJob.Form.Rule.MinLength128
            ),
            trigger: 'blur'
          }
        ],
        jobDescription: [
          {
            min: 0,
            max: 512,
            message: this.BusinessLanguage.GetMenuName(
              this.BusinessLanguage.ScheduleJob.Form.Rule.MinLength512
            ),
            trigger: 'blur'
          }
        ],
        nameSpace: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(
              this.BusinessLanguage.ScheduleJob.Form.Placeholder.NameSpace
            ),
            trigger: 'blur'
          },
          {
            min: 0,
            max: 512,
            message: this.BusinessLanguage.GetMenuName(
              this.BusinessLanguage.ScheduleJob.Form.Rule.MinLength512
            ),
            trigger: 'blur'
          }
        ],
        jobImplement: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(
              this.BusinessLanguage.ScheduleJob.Form.Placeholder.JobImplement
            ),
            trigger: 'blur'
          },
          {
            min: 0,
            max: 128,
            message: this.BusinessLanguage.GetMenuName(
              this.BusinessLanguage.ScheduleJob.Form.Rule.MinLength128
            ),
            trigger: 'blur'
          }
        ],
        cronExpression: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(
              this.BusinessLanguage.ScheduleJob.Form.Placeholder.CronExpression
            ),
            trigger: 'blur'
          },
          {
            min: 0,
            max: 128,
            message: this.BusinessLanguage.GetMenuName(
              this.BusinessLanguage.ScheduleJob.Form.Rule.MinLength128
            ),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {},
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.url.queryList = 'ScheduleJobManagement/Post'
    this.url.queryEntity = 'ScheduleJobManagement/GetById/'
    this.url.addEntity = 'ScheduleJobManagement/Add'
    this.url.editEntity = 'ScheduleJobManagement/Put'
    this.url.deleteEntity = 'ScheduleJobManagement/Delete/'
    this.queryCondition.Sort = 'SerialNumber ASC'
  },
  mounted() {},
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    searchData: function() {
      this.queryCondition.PageIndex = 0
      this.queryCondition.QueryItems = []
      if (this.queryForm.jobName) {
        this.queryCondition.QueryItems.push(
          generateQueryItem(
            'JobName',
            this.DataType.String,
            this.QueryMethod.Like,
            this.queryForm.jobName
          )
        )
      }
      this.InitData()
    },
    add: function() {
      this.resetForm()
      this.title = this.BusinessLanguage.GetMenuName(
        this.BusinessLanguage.ScheduleJob.DialogTitle.Add
      )
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
      this.GetEntity(this.multipleSelection[0].id).then((response) => {
        this.title = this.BusinessLanguage.GetMenuName(
          this.BusinessLanguage.ScheduleJob.DialogTitle.Edit
        )
        Object.assign(this.form, response.object)
        this.form.jobName = this.multipleSelection[0].jobName
        this.dialogFormVisible = true
        this.loading = false
      })
    },
    resetForm: function() {
      this.form.id = null
      this.form.jobName = null
      this.form.jobDescription = null
      this.form.nameSpace = null
      this.form.jobImplement = null
      this.form.cronExpression = null
      this.form.startTime = null
      this.form.endTime = null
      this.form.serialNumber = null
      this.form.groupId = null
      this.form.remark = null
      this.form.isDel = null
      this.form.creator = null
      this.form.createTime = null
      this.form.modifier = null
      this.form.modifyTime = null
    },
    start: function() {
      const row = this.multipleSelection[0]
      if (row.jobStatus === this.JobStatus.Running) {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(
            this.BusinessLanguage.ScheduleJob.Grid.Tooltip.Running
          ),
          type: 'warning'
        })
        return
      }
      if (row.jobStatus === this.JobStatus.Stopped) {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(
            this.BusinessLanguage.ScheduleJob.Grid.Tooltip.Reset
          ),
          type: 'warning'
        })
        return
      }
      this.RuYiAdmin.Get(
        'ScheduleJobManagement/StartScheduleJob/' + row.id,
        null
      ).then((response) => {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(
            this.BusinessLanguage.ScheduleJob.Grid.Message.Start
          ),
          type: 'success'
        })
        this.editDisabled = true
        this.delDisabled = true
        setTimeout(() => {
          this.InitData()
        }, 1000)
      })
    },
    pause: function() {
      const row = this.multipleSelection[0]
      if (row.jobStatus !== this.JobStatus.Running) {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(
            this.BusinessLanguage.ScheduleJob.Grid.Tooltip.Stopping
          ),
          type: 'warning'
        })
        return
      }
      this.RuYiAdmin.Get(
        'ScheduleJobManagement/PauseScheduleJob/' + row.id,
        null
      ).then((response) => {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(
            this.BusinessLanguage.ScheduleJob.Grid.Message.Pause
          ),
          type: 'success'
        })
        this.editDisabled = true
        this.delDisabled = true
        setTimeout(() => {
          this.InitData()
        }, 1000)
      })
    },
    resume: function() {
      const row = this.multipleSelection[0]
      if (row.jobStatus !== this.JobStatus.Stopped) {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(
            this.BusinessLanguage.ScheduleJob.Grid.Tooltip.Unstopped
          ),
          type: 'warning'
        })
        return
      }
      this.RuYiAdmin.Get(
        'ScheduleJobManagement/ResumeScheduleJob/' + row.id,
        null
      ).then((response) => {
        this.$message({
          showClose: true,
          message: this.BusinessLanguage.GetMenuName(
            this.BusinessLanguage.ScheduleJob.Grid.Message.Resume
          ),
          type: 'success'
        })
        this.editDisabled = true
        this.delDisabled = true
        setTimeout(() => {
          this.InitData()
        }, 1000)
      })
    }
  }
}
</script>

  <style scoped>
</style>
