<template>
  <div />
</template>

<script>
import { btnPermission } from '@/utils/btn-permission'
import fileDownload from 'js-file-download'

export default {
  name: 'RuYiAdminBasePage',
  data() {
    return {
      url: {
        queryList: null,
        queryEntity: null,
        addEntity: null,
        editEntity: null,
        deleteEntity: null,
        deleteEntities: null
      },
      addDisabled: false,
      editDisabled: true,
      delDisabled: true,
      multipleSelection: null,
      dialogFormVisible: false,
      title: null,
      loading: false,
      tableData: [],
      queryCondition: {
        PageIndex: 0,
        PageSize: 10,
        Sort: 'CreateTime DESC',
        QueryItems: []
      }
    }
  },
  watch: {},
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    this.InitData()
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    IndexMethod(index) {
      return this.queryCondition.PageIndex * this.queryCondition.PageSize + index + 1
    },
    HandleSizeChange(val) {
      this.queryCondition.PageSize = val
      this.InitData()
    },
    HandleCurrentChange(val) {
      this.queryCondition.PageIndex = val - 1
      this.InitData()
    },
    HandleSelectionChange: function(val) {
      if (val.length === 0) {
        this.editDisabled = true
        this.delDisabled = true
        this.multipleSelection = null
        return
      }
      this.multipleSelection = val
      if (val.length === 1) {
        this.editDisabled = false
      } else {
        this.editDisabled = true
      }
      this.delDisabled = false
    },
    InitData: function() {
      this.loading = true
      this.GetList(this.queryCondition).then(response => {
        this.tableData = response.list
        this.queryCondition.TotalCount = response.totalCount
        this.loading = false
      })
    },
    GetList: function(param) {
      return this.RuYiAdmin.GetList(this.url.queryList, param)
    },
    GetEntity: function(param) {
      return this.RuYiAdmin.GetEntity(this.url.queryEntity, param)
    },
    AddEntity: function(param) {
      return this.RuYiAdmin.AddEntity(this.url.addEntity, param)
    },
    EditEntity: function(param) {
      return this.RuYiAdmin.EditEntity(this.url.editEntity, param)
    },
    DeleteEntity: function(param) {
      return this.RuYiAdmin.DeleteEntity(this.url.deleteEntity, param)
    },
    DeleteEntities: function(param) {
      return this.RuYiAdmin.DeleteEntities(this.url.deleteEntities, param)
    },
    DeleteFile: function(url, param) {
      return this.RuYiAdmin.GetEntity(url, param)
    },
    ResetQueryFrom: function() {
      this.$refs.queryForm.resetFields()
      this.queryCondition.QueryItems = []
      this.InitData()
    },
    ButtonPermission: function(code) {
      return btnPermission(code)
    },
    Delete: function() {
      this.$confirm(this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Button.Delete.Confirm),
        this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Tooltip),
        {
          confirmButtonText: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Sure),
          cancelButtonText: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Cancel),
          type: 'warning'
        }).then(() => {
        if (this.multipleSelection.length === 1) {
          this.DeleteEntity(this.multipleSelection[0].id).then(response => {
            this.$message({
              showClose: true,
              message: this.BusinessLanguage.GetMenuName(this.BusinessLanguage.Common.Dialog.Message.Delete),
              type: 'error'
            })
            this.editDisabled = true
            this.delDisabled = true
            this.InitData()
          })
        } else {
          const ids = this.multipleSelection.map((item) => {
            return item.id
          })
          this.DeleteEntities(ids.toString()).then(response => {
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
    SubmitForm: function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.DataVerification()) {
            return
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
    DownloadFile: function(url, param, filename) {
      this.RuYiAdmin.DownloadFile(url, param).then(res => {
        fileDownload(res.data, filename)
      })
    },
    DataVerification: function() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
