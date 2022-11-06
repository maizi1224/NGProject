<template>
  <div class="app-container">
    <!--
       头部查询
    -->
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
            BusinessLanguage.AssetMent.Placeholder.AssetCode
          )
        "
        prop="assetsCode"
      >
        <el-input
          v-model="queryForm.assetsCode"
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
      <el-form-item
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Placeholder.Adress
          )
        "
        label-width="50px"
        prop="assetsAdress"
      >
        <el-input
          v-model="queryForm.assetsAdress"
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

    <!--
      显示内容的table
     -->
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      align="center"
      stripe
      row-key="id"
      border
      :header-cell-style="{ textAlign: 'center' }"
      @selection-change="HandleSelectionChange"
    >
      <el-table-column align="center" type="selection" />
      <el-table-column
        prop="assetsCode"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(BusinessLanguage.AssetMent.Grid.AssetsCode)
        "
      />
      <el-table-column
        prop="assetsTypeId"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.AssetsType
          )
        "
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.assetsTypeId === 0">
            租赁型住宅
          </el-tag>
          <el-tag v-else-if="scope.assetsTypeId === 1">
            租赁型门面房
          </el-tag>
          <el-tag v-else-if="scope.assetsTypeId === 2">
            土地
          </el-tag>
          <el-tag v-else-if="scope.assetsTypeId === 3">
            经营性用房
          </el-tag>
          <el-tag v-else-if="scope.assetsTypeId === 4">
            商服用房
          </el-tag>
          <el-tag v-else-if="scope.assetsTypeId === 5">
            工厂用房
          </el-tag>
          <el-tag v-else>
            沿街商铺
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="assetsState"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.AssetsState
          )
        "
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.assetsState === 0">
            闲置中
          </el-tag>
          <el-tag v-else>
            出租
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="assetsArea"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.AssetsArea
          )
        "
      />
      <el-table-column
        prop="assetsAdress"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.AssetsAdress
          )
        "
      />
      <el-table-column
        prop="currentcontract.lessee"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.lessee
          )
        "
      />
      <el-table-column
        prop="currentcontract.lesseePhone"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.lesseePhone
          )
        "
      />
      <el-table-column
        prop="currentcontract.contracStartDate"
        align="center"
        :formatter="formatterDate"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.ContracStartDate
          )
        "
      />
      <el-table-column
        prop="currentcontract.contractEndDate"
        align="center"
        :formatter="formatterDate"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.ContractEndDate
          )
        "
      />
      <el-table-column
        prop="currentcontract.contractPrice"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.ContractPrice
          )
        "
      />
      <el-table-column
        prop="currentcontract.contractMoney"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.ContractMoney
          )
        "
      />
      <el-table-column
        prop="assetUseType"
        align="center"
        :label="
          BusinessLanguage.GetMenuName(
            BusinessLanguage.AssetMent.Grid.AssetUseType
          )
        "
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.assetUseType === 0">
            移交
          </el-tag>
          <el-tag v-else-if="scope.assetUseType === 1">
            拆迁
          </el-tag>
          <el-tag v-else-if="scope.assetUseType === 2">
            出借
          </el-tag>
          <el-tag v-else-if="scope.assetUseType === 3" type="danger">
            停用
          </el-tag>
          <el-tag v-else type="success">
            正常管理

          </el-tag>
        </template>
      </el-table-column>
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
      fullscreen="true"
      modal="true"
      modal-append-to-body="true"
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
                    BusinessLanguage.AssetMent.Grid.AssetMentCode
                  )
                "
                prop="AssetsCode"
              >
                <el-input
                  v-model="form.AssetCode"
                  prefix-icon="el-icon-search"
                  :placeholder="
                    BusinessLanguage.GetMenuName(
                      BusinessLanguage.AssetMent.Grid.AssetMentCode
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
  name: 'AssetMent',
  extends: RuYiAdminBasePage,
  data() {
    return {
      queryForm: {
        AssetCode: null,
        assetsAdress: null
      },
      form: {
        id: null,
        AssetCode: null,
        assetsAdress: null,
        PersonId: null,
        PersonName: null,
        DepartmentId: null,
        DepartName: null,
        MAEPName: null,
        Money: null,
        MAEPFileGroupId: null
      },
      rules: {
        AssetCode: [
          {
            required: true,
            message: this.BusinessLanguage.GetMenuName(
              this.BusinessLanguage.AssetMent.Placeholder.AssetMentCode
            ),
            trigger: 'blur'
          },
          {
            min: 0,
            max: 255,
            message: this.BusinessLanguage.GetMenuName(
              this.BusinessLanguage.ScheduleJob.Form.Rule.MinLength255
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
    this.url.queryList = 'Asset/Post'
    this.url.queryEntity = 'ScheduleJobManagement/GetById/'
    this.url.addEntity = 'ScheduleJobManagement/Add'
    this.url.editEntity = 'ScheduleJobManagement/Put'
    this.url.deleteEntity = 'ScheduleJobManagement/Delete/'
    this.queryCondition.Sort = 'Id ASC'
  },
  mounted() {},
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    searchData: function() {
      this.queryCondition.PageIndex = 0
      this.queryCondition.QueryItems = []
      if (this.queryForm.assetsCode) {
        this.queryCondition.QueryItems.push(
          generateQueryItem(
            'assetsCode',
            this.DataType.String,
            this.QueryMethod.Like,
            this.queryForm.assetsCode
          )
        )
      }
      if (this.queryForm.assetsAdress) {
        this.queryCondition.QueryItems.push(
          generateQueryItem(
            'assetsAdress',
            this.DataType.String,
            this.QueryMethod.Like,
            this.queryForm.assetsAdress
          )
        )
      }
      this.InitData()
    },
    formatterDate: function(row, column, cellValue, index) {
      const daterc = cellValue
      if (daterc != null && daterc !== '0001-01-01T00:00:00') {
        var date = new Date(daterc)
        var year = date.getFullYear()
        /* 在日期格式中，月份是从0开始，11结束，因此要加0
                     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
                     * */
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        // var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        // var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        // var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        // 拼接
        // return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
        return year + '-' + month + '-' + day
      }
    },
    add: function() {
      this.resetForm()
      this.title = '新增资产'
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
      this.form.assetsCode = null
      this.form.assetsAdress = null
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
