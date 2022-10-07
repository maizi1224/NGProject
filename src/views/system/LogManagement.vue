<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryForm" label-width="100px" :inline="true" border>
      <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Form.Query.UserName)" prop="userName">
        <el-input
          v-model="queryForm.userName"
          :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Form.Placeholder.UserName)"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchData"
        />
      </el-form-item>
      <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Form.Query.OrgName)" prop="orgName">
        <el-input
          v-model="queryForm.orgName"
          :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Form.Placeholder.OrgName)"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchData"
        />
      </el-form-item>
      <el-form-item
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Form.Query.OperationType)"
        prop="operationType"
      >
        <el-select
          v-model="queryForm.operationType"
          clearable
          :placeholder="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Form.Placeholder.OperationType)"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="ButtonPermission('log:query:list')"
          type="success"
          size="mini"
          icon="el-icon-search"
          plain
          @click="searchData"
        >{{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Search) }}
        </el-button>
        <el-button
          v-if="ButtonPermission('log:query:list')"
          type="warning"
          size="mini"
          icon="el-icon-refresh-left"
          plain
          @click="ResetQueryFrom"
        >{{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Reset) }}
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
      <el-table-column type="expand" width="60">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.UserName)">
              <span>{{ props.row.userName }}</span>
            </el-form-item>
            <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.OrgName)">
              <span>{{ props.row.orgName }}</span>
            </el-form-item>
            <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.System)">
              <span>{{ props.row.system }}</span>
            </el-form-item>
            <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.Browser)">
              <span>{{ props.row.browser }}</span>
            </el-form-item>
            <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.IP)">
              <span>{{ props.row.ip }}</span>
            </el-form-item>
            <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.OperationType)">
              <span>{{ OperationType.getOperationType(props.row.operationType) }}</span>
            </el-form-item>
            <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.RequestMethod)">
              <span>{{ props.row.requestMethod }}</span>
            </el-form-item>
            <el-row>
              <el-col :span="24">
                <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.RequestUrl)">
                  <span>{{ props.row.requestUrl }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.Params)">
                  <el-input
                    type="textarea"
                    :rows="4"
                    style="width: 1100px;margin-bottom: 5px;"
                    :value="props.row.params"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.Result)">
                  <el-input
                    type="textarea"
                    :rows="4"
                    style="width: 1100px;margin-bottom: 5px;"
                    :value="props.row.result"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <el-form-item label="">
                  <i class="el-icon-warning" @click="downLoadTxt(props.row.result,props.row.id)" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.OldVaue)">
              <el-input
                type="textarea"
                :rows="4"
                style="width: 550px;"
                :value="props.row.oldVaue"
              />
            </el-form-item>
            <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.NewValue)">
              <el-input
                type="textarea"
                :rows="4"
                style="width: 550px;"
                :value="props.row.newValue"
              />
            </el-form-item>
            <el-row>
              <el-col :span="24">
                <el-form-item :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.Remark)">
                  <el-input
                    type="textarea"
                    :rows="2"
                    style="width: 1100px;margin-bottom: 5px;"
                    :value="props.row.remark"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Index)"
        width="60"
        :index="IndexMethod"
        align="center"
      />
      <el-table-column
        prop="userName"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.UserName)"
      />
      <el-table-column
        prop="orgName"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.OrgName)"
      />
      <el-table-column
        prop="requestUrl"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.RequestUrl)"
        width="400"
      />
      <el-table-column
        prop="ip"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.IP)"
      />
      <el-table-column
        prop="createTime"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.CreateTime)"
        width="160"
      >
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operationType"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Log.Grid.Field.OperationType)"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.operationType === OperationType.DeleteEntity"
            :type="'warning'"
            disable-transitions
          >
            {{ OperationType.getOperationType(scope.row.operationType) }}
          </el-tag>
          <el-tag
            v-else-if="scope.row.operationType === OperationType.RemoveEntity"
            :type="'danger'"
            disable-transitions
          >
            {{ OperationType.getOperationType(scope.row.operationType) }}
          </el-tag>
          <el-tag
            v-else-if="scope.row.operationType ===OperationType.AddEntity"
            :type="'primary'"
            disable-transitions
          >
            {{ OperationType.getOperationType(scope.row.operationType) }}
          </el-tag>
          <el-tag
            v-else-if="scope.row.operationType === OperationType.EditEntity"
            :type="'success'"
            disable-transitions
          >
            {{ OperationType.getOperationType(scope.row.operationType) }}
          </el-tag>
          <el-tag v-else :type="'info'" disable-transitions>
            {{ OperationType.getOperationType(scope.row.operationType) }}
          </el-tag>
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
  </div>
</template>

<script>
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'
import { generateQueryItem } from '@/utils/query-item'

export default {
  name: 'LogManagement',
  extends: RuYiAdminBasePage,
  data() {
    return {
      queryForm: {
        orgName: null,
        userName: null,
        operationType: null
      },
      options: null
    }
  },
  watch: {},
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.url.queryList = 'LogManagement/Post'
    this.queryCondition.Sort = 'createTime DESC' // 关系库使用CREATE_TIME
  },
  mounted() {
    this.options = this.OperationType.getOpTyKyVa()
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    searchData: function() {
      this.queryCondition.PageIndex = 0
      const array = []
      if (this.queryForm.userName) {
        array.push(generateQueryItem('userName', // 关系库使用USER_NAME
          this.DataType.String,
          this.QueryMethod.Like,
          this.queryForm.userName))
      }
      if (this.queryForm.orgName) {
        array.push(generateQueryItem('orgName', // 关系库使用ORG_NAME
          this.DataType.String,
          this.QueryMethod.Like,
          this.queryForm.orgName))
      }
      if (this.queryForm.operationType) {
        array.push(generateQueryItem('operationType', // 关系库使用OPERATION_TYPE
          this.DataType.Int,
          this.QueryMethod.Equal,
          this.queryForm.operationType))
      }
      this.queryCondition.QueryItems = array
      this.InitData()
    },
    downLoadTxt: function(result, id) {
      if (result && result.toString().endsWith('...')) {
        this.DownloadFile('LogManagement/DownloadMonitoringLog/' + id, null, id + '.txt')
      } else {
        this.$message.warning(this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Log.Message.Warning))
      }
    }
  }
}
</script>

<style scoped>
.pagination {
  text-align: right;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
