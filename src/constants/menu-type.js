export const MenuType = {
  // 菜单
  Menu: 0,

  // 按钮
  Button: 1,

  // 视图
  View: 2,

  getMenuType: function(type) {
    let msg = ''
    switch (type) {
      case MenuType.Menu:
        msg = '菜单'
        break
      case MenuType.Button:
        msg = '按钮'
        break
      case MenuType.View:
        msg = '视图'
        break
      default:
        break
    }
    return msg
  },
  getMenuTypeKV: function() {
    return [
      {
        value: MenuType.Menu,
        label: '菜单'
      },
      {
        value: MenuType.Button,
        label: '按钮'
      },
      {
        value: MenuType.View,
        label: '视图'
      }
    ]
  }
}
