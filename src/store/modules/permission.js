import { asyncRoutes, constantRoutes } from '@/router'
import { getToken } from '@/utils/auth'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }

      function getMenuName(item) {
        const language = localStorage.getItem('language')
        let msg
        switch (language) {
          case 'zh-CN':
            msg = item.menuName
            break
          case 'en-US':
            msg = item.menuNameEn
            break
          case 'ru-RU':
            msg = item.menuNameRu
            break
          default:
            msg = item.menuName
            break
        }
        return msg
      }

      const menus = JSON.parse(sessionStorage.getItem(getToken() + '_permissions'))
      const codes = []
      asyncRoutes.length = 0
      menus.forEach((item, index) => {
        if (item.menuType === 0) {
          const root = {
            path: item.path,
            component: Layout,
            redirect: item.path,
            name: item.menuName,
            meta: { title: getMenuName(item), icon: item.icon }
          }
          if (item.children.length > 0) {
            root.children = []
            item.children.forEach(sub => {
              if (sub.menuType === 0) {
                root.children.push({
                  path: sub.menuUrl.replace('/', ''),
                  component: (resolve) => require(['@/views' + sub.path + sub.menuUrl], resolve),
                  name: sub.menuUrl.replace('/', ''),
                  meta: { title: getMenuName(sub), icon: sub.icon }
                })
              }
              if (sub.children.length > 0) {
                sub.children.forEach(bv => {
                  codes.push(bv.code)
                })
              }
            })
          }
          asyncRoutes.push(root)
        }
      })

      // 添加系统帮助
      // asyncRoutes.push({
      //   path: '/SystemDocument',
      //   component: Layout,
      //   redirect: 'noRedirect',
      //   name: 'SystemDocument',
      //   meta: {
      //     title: '系统帮助',
      //     icon: 'table'
      //   },
      //   children: [
      //     {
      //       path: 'SysDocument',
      //       component: () => import('@/views/pdf/sysdocument'),
      //       name: 'SysDocument',
      //       meta: { title: '系统手册', icon: 'table' }
      //     }
      //   ]
      // })

      const user = JSON.parse(sessionStorage.getItem(getToken()))
      const codeGeneratorConfig = JSON.parse(sessionStorage.getItem('codeGeneratorConfig'))
      if (codeGeneratorConfig.isEnabled === true && user.isSupperAdmin === 1) {
        // // 添加代码生成器
        // asyncRoutes.push({
        //   path: '/SystemHelp',
        //   component: Layout,
        //   redirect: 'noRedirect',
        //   name: 'SystemHelp',
        //   meta: {
        //     title: '系统工具',
        //     icon: 'table'
        //   },
        //   children: [
        //     {
        //       path: 'FormDesigner',
        //       component: () => import('@/views/system/FormDesigner'),
        //       name: 'FormDesigner',
        //       meta: { title: '表单设计器', icon: 'table' }
        //     },
        //     {
        //       path: 'CodeGenerator',
        //       component: () => import('@/views/system/CodeGenerator'),
        //       name: 'CodeGenerator',
        //       meta: { title: '代码生成器', icon: 'table' }
        //     },
        //     {
        //       path: 'SystemWebAPI',
        //       component: () => import('@/views/system/SystemWebAPI'),
        //       name: 'SystemWebAPI',
        //       meta: { title: '系统WebAPI', icon: 'table' }
        //     }
        //   ]
        // })
      }

      // 添加代码生成器
      // asyncRoutes.push({
      //   path: '/SystemHelp',
      //   component: Layout,
      //   redirect: 'noRedirect',
      //   name: 'SystemHelp',
      //   meta: {
      //     title: '系统工具',
      //     icon: 'table'
      //   },
      //   children: [
      //     {
      //       path: 'FormDesigner',
      //       component: () => import('@/views/system/FormDesigner'),
      //       name: 'FormDesigner',
      //       meta: { title: '表单设计器', icon: 'table' }
      //     },
      //     {
      //       path: 'CodeGenerator',
      //       component: () => import('@/views/system/CodeGenerator'),
      //       name: 'CodeGenerator',
      //       meta: { title: '代码生成器', icon: 'table' }
      //     },
      //     {
      //       path: 'SystemWebAPI',
      //       component: () => import('@/views/system/SystemWebAPI'),
      //       name: 'SystemWebAPI',
      //       meta: { title: '系统WebAPI', icon: 'table' }
      //     }
      //   ]
      // })

      // 添加大屏幕
      // asyncRoutes.push({
      //   path: '/DataViewer',
      //   component: Layout,
      //   redirect: 'noRedirect',
      //   name: 'DataViewer',
      //   meta: {
      //     title: '大数据',
      //     icon: 'table'
      //   },
      //   children: [
      //     {
      //       path: 'dataviewer',
      //       component: () => import('@/views/data-view/datav'),
      //       name: 'dataviewer',
      //       meta: { title: '智慧大屏幕', icon: 'table' }
      //     }
      //   ]
      // })

      sessionStorage.setItem(getToken() + '_codes', codes.toString())

      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
