/*
 * @Author: maizi 851620279@qq.com
 * @Date: 2022-10-08 02:20:47
 * @LastEditors: maizi 851620279@qq.com
 * @LastEditTime: 2022-12-05 15:05:06
 * @FilePath: \NGProject\src\store\modules\lockScreen.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// const state = {
//   isLock: localStorage.getItem("HLT_isLock") || false, //是否锁屏
//   isCover: localStorage.getItem("HLT_lockCOver") || false, //是否覆盖
// }
const state = {
  isLock: false, // 是否锁屏
  isCover: false // 是否覆盖
}
const mutations = {
  // SET_LOCK: (state, cover) => {
  //   state.isLock = true,
  //   state.isCover = cover
  //   localStorage.setItem('HLT_LockCOver', state.isCover)
  // },
  SET_LOCK: (state, cover) => {
    state.isLock = false
    state.isCover = false
    // localStorage.setItem('HLT_LockCOver', state.isCover)
  },
  CLEAR_LOCK: (state, cover) => {
    state.isCover = cover
    state.isLock = false
    state.lockPassWord = ''
    localStorage.removeItem('HLT_LockCOver')
  },
  PREVENT_REFRSH: (state, cover) => {
    state.isCover = cover
  }
}
const actions = {
  setlock: ({ commit }, cover) => {
    commit('SET_LOCK', cover)
  },
  clearLock: ({ commit }, args) => {
    commit('CLEAR_LOCK', args)
  },
  preventRefresh: ({ commit }, cover) => {
    commit('PREVENT_REFRSH', cover)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

