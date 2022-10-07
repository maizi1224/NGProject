<template>
  <div class="app-container">
    <el-row style="margin-bottom: 5px;">
      <el-col>
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
        prop="languageName"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Language.Grid.LanguageName)"
      />
      <el-table-column
        prop="orderNumber"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.SerialNumber)"
        align="center"
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
        prop="remark"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Remark)"
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
  </div>
</template>

<script>
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'

export default {
  name: 'LanguageManagement',
  extends: RuYiAdminBasePage,
  data() {
    return {}
  },
  watch: {},
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.url.queryList = 'LanguageManagement/Post'
    this.queryCondition.Sort = 'OrderNumber ASC'
  },
  mounted() {
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {}
}
</script>

<style scoped>

</style>
