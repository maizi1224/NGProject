<template>
  <div class="app-container">
    <el-row style="margin-bottom: 5px;">
      <el-col>
        <el-button
          icon="el-icon-refresh"
          plain
          size="mini"
          type="info"
          @click="refresh"
        >
          {{ BusinessLanguage.GetMenuName(BusinessLanguage.Common.Button.Refresh) }}
        </el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      :header-cell-style="{textAlign: 'center'}"
      border
      row-key="id"
      style="width: 100%;"
    >
      <el-table-column
        :index="indexMethod"
        align="center"
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Index)"
        type="index"
        width="60"
      />
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.OnlineUser.Grid.LogonName)"
        prop="logonName"
        width="100"
      />
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.OnlineUser.Grid.DisplayName)"
        prop="displayName"
        width="100"
      />
      <el-table-column
        :label="BusinessLanguage.GetMenuName(BusinessLanguage.OnlineUser.Grid.OrgName)"
        prop="orgName"
        width="120"
      />
      <el-table-column
        label="Token"
        prop="token"
      />
      <el-table-column :label="BusinessLanguage.GetMenuName(BusinessLanguage.Common.Grid.Action)" width="90px">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="danger"
            icon="el-icon-circle-close"
            @click="forceLogout(scope.$index, scope.row)"
          > {{ BusinessLanguage.GetMenuName(BusinessLanguage.OnlineUser.Grid.ForceLogout.Action) }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'OnlineUserManagement',
  data() {
    return {
      loading: false,
      tableData: []
    }
  },
  watch: {},
  created() {
  },
  mounted() {
    this.initData()
  },
  destroyed() {
  },
  methods: {
    indexMethod: function(index) {
      return index + 1
    },
    initData: function() {
      this.loading = true
      this.RuYiAdmin.Get('UserManagement/GetOnlineUsers', null).then(response => {
        this.tableData = response.list
        this.loading = false
      })
    },
    forceLogout: function(index, row) {
      this.$confirm(
        this.BusinessLanguage.GetMenuName(this.BusinessLanguage.OnlineUser.Grid.ForceLogout.Tooltip),
        this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Tooltip),
        {
          confirmButtonText: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Sure),
          cancelButtonText: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Cancel),
          type: 'warning'
        }).then(() => {
        if (row.isSupperAdmin) {
          this.$message({
            showClose: true,
            message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.OnlineUser.Grid.ForceLogout.WarnningMessage),
            type: 'error'
          })
        } else {
          this.RuYiAdmin.Get('UserManagement/ForceLogout/' + row.token, null).then(response => {
            this.$message({
              showClose: true,
              message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.OnlineUser.Grid.ForceLogout.SuccessMessage),
              type: 'success'
            })
            this.initData()
          })
        }
      })
    },
    refresh: function() {
      this.initData()
    }
  }
}
</script>

<style scoped>

</style>
