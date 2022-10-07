<template>
  <div class="app-container">
    <el-table
      v-loading="loading"
      :data="tableData"
      :header-cell-style="{textAlign: 'center'}"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      border
      row-key="id"
      style="width: 100%;"
    >
      <el-table-column
        align="center"
        type="selection"
      />
      <el-table-column
        :index="IndexMethod"
        align="center"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Index)"
        type="index"
        width="60"
      />
      <el-table-column
        label="区域名称"
        prop="areaName"
      />
      <el-table-column
        label="区域编码"
        prop="areaCode"
      />
      <el-table-column label="区域层级" prop="areaLevel">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.areaLevel === 1">
            省份
          </el-tag>
          <el-tag v-else-if="scope.row.areaLevel === 2">
            城市
          </el-tag>
          <el-tag v-else>区县
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.CreateTime)"
        prop="createTime"
      >
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import RuYiAdminBasePage from '@/components/BasePage/RuYiAdminBasePage'

export default {
  name: 'AreaManagement',
  extends: RuYiAdminBasePage,
  data() {
    return {}
  },
  watch: {},
  created() {
    this.url.queryList = 'AreaManagement/Post'
  },
  mounted() {
  },
  destroyed() {
  },
  methods: {}
}
</script>

<style scoped>

</style>
