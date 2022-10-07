export const OperationType = {

  // 查询列表
  QueryList: 0,

  // 查询实体
  QueryEntity: 1,

  // 新增实体
  AddEntity: 2,

  // 编辑实体
  EditEntity: 3,

  // 逻辑删除实体
  DeleteEntity: 4,

  // 物理删除实体
  RemoveEntity: 5,

  // 上传文件
  UploadFile: 6,

  // 下载文件
  DownloadFile: 7,

  // 导入数据
  ImportData: 8,

  // 导出数据
  ExportData: 9,

  // 菜单授权
  MenuAuthorization: 10,

  // 用户授权
  PermissionAuthorization: 11,

  // 打印
  Print: 12,

  // 登录
  Logon: 13,

  // 登出
  Logout: 14,

  // 强制登出
  ForceLogout: 15,

  // 修改密码
  UpdatePassword: 16,

  // 启动计划任务
  StartScheduleJob: 17,

  // 暂停计划任务
  PauseScheduleJob: 18,

  // 恢复计划任务
  ResumeScheduleJob: 19,

  // 下放权限
  DelegatePermission: 20,

  // 生成代码
  GenerateCode: 21,

  // Sql注入攻击
  SqlInjectionAttack: 22,

  // Token劫持
  TokenHijacked: 23,

  // 统一认证
  UnifiedAuthentication: 24,

  // 统一认证授权
  UnifiedAuthorization: 25,

  // 解除统一授权
  RemoveUnifiedAuthorization: 26,

  // 获取同步口令
  GetSyncToken: 27,

  // 同步新增用户
  SyncAddUser: 28,

  // 同步编辑用户
  SyncEditUser: 29,

  // 同步删除用户
  SyncDeleteUser: 30,

  getOperationType: function(type) {
    let msg = ''
    switch (type) {
      case OperationType.QueryList:
        msg = '查询列表'
        break
      case OperationType.QueryEntity:
        msg = '查询实体'
        break
      case OperationType.AddEntity:
        msg = '新增实体'
        break
      case OperationType.EditEntity:
        msg = '编辑实体'
        break
      case OperationType.DeleteEntity:
        msg = '逻辑删除'
        break
      case OperationType.RemoveEntity:
        msg = '物理删除'
        break
      case OperationType.UploadFile:
        msg = '上传文件'
        break
      case OperationType.DownloadFile:
        msg = '下载文件'
        break
      case OperationType.ImportData:
        msg = '导入数据'
        break
      case OperationType.ExportData:
        msg = '导出数据'
        break
      case OperationType.MenuAuthorization:
        msg = '菜单授权'
        break
      case OperationType.PermissionAuthorization:
        msg = '用户授权'
        break
      case OperationType.Print:
        msg = '打印'
        break
      case OperationType.Logon:
        msg = '登录'
        break
      case OperationType.Logout:
        msg = '登出'
        break
      case OperationType.ForceLogout:
        msg = '强制登出'
        break
      case OperationType.UpdatePassword:
        msg = '更新密码'
        break
      case OperationType.StartScheduleJob:
        msg = '启动计划任务'
        break
      case OperationType.PauseScheduleJob:
        msg = '暂停计划任务'
        break
      case OperationType.ResumeScheduleJob:
        msg = '恢复计划任务'
        break
      case OperationType.DelegatePermission:
        msg = '权限下放'
        break
      case OperationType.GenerateCode:
        msg = '生成代码'
        break
      case OperationType.SqlInjectionAttack:
        msg = 'Sql注入攻击'
        break
      case OperationType.TokenHijacked:
        msg = 'Token劫持'
        break
      case OperationType.UnifiedAuthentication:
        msg = '统一认证'
        break
      case OperationType.UnifiedAuthorization:
        msg = '统一认证授权'
        break
      case OperationType.RemoveUnifiedAuthorization:
        msg = '解除统一授权'
        break
      case OperationType.GetSyncToken:
        msg = '获取同步口令'
        break
      case OperationType.SyncAddUser:
        msg = '同步新增用户'
        break
      case OperationType.SyncEditUser:
        msg = '同步编辑用户'
        break
      case OperationType.SyncDeleteUser:
        msg = '同步删除用户'
        break
      default:
        break
    }
    return msg
  },
  getOpTyKyVa: function() {
    return [
      {
        value: OperationType.QueryList,
        label: '查询列表'
      },
      {
        value: OperationType.QueryEntity,
        label: '查询实体'
      },
      {
        value: OperationType.AddEntity,
        label: '新增实体'
      },
      {
        value: OperationType.EditEntity,
        label: '编辑实体'
      },
      {
        value: OperationType.DeleteEntity,
        label: '逻辑删除'
      },
      {
        value: OperationType.RemoveEntity,
        label: '物理删除'
      },
      {
        value: OperationType.UploadFile,
        label: '上传文件'
      },
      {
        value: OperationType.DownloadFile,
        label: '下载文件'
      },
      {
        value: OperationType.ImportData,
        label: '导入数据'
      },
      {
        value: OperationType.ExportData,
        label: '导出数据'
      },
      {
        value: OperationType.MenuAuthorization,
        label: '菜单授权'
      },
      {
        value: OperationType.PermissionAuthorization,
        label: '用户授权'
      },
      {
        value: OperationType.Print,
        label: '打印'
      },
      {
        value: OperationType.Logon,
        label: '登录'
      },
      {
        value: OperationType.Logout,
        label: '登出'
      },
      {
        value: OperationType.ForceLogout,
        label: '强制登出'
      },
      {
        value: OperationType.UpdatePassword,
        label: '更新密码'
      },
      {
        value: OperationType.StartScheduleJob,
        label: '启动计划任务'
      },
      {
        value: OperationType.PauseScheduleJob,
        label: '暂停计划任务'
      },
      {
        value: OperationType.ResumeScheduleJob,
        label: '恢复计划任务'
      },
      {
        value: OperationType.DelegatePermission,
        label: '权限下放'
      },
      {
        value: OperationType.GenerateCode,
        label: '生成代码'
      },
      {
        value: OperationType.SqlInjectionAttack,
        label: 'Sql注入攻击'
      },
      {
        value: OperationType.TokenHijacked,
        label: 'Token劫持'
      },
      {
        value: OperationType.UnifiedAuthentication,
        label: '统一认证'
      },
      {
        value: OperationType.UnifiedAuthorization,
        label: '统一认证授权'
      },
      {
        value: OperationType.RemoveUnifiedAuthorization,
        label: '解除统一授权'
      },
      {
        value: OperationType.GetSyncToken,
        label: '获取同步口令'
      },
      {
        value: OperationType.SyncAddUser,
        label: '同步新增用户'
      },
      {
        value: OperationType.SyncEditUser,
        label: '同步编辑用户'
      },
      {
        value: OperationType.SyncDeleteUser,
        label: '同步删除用户'
      }
    ]
  }
}
