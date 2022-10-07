const state = {
  isLock: localStorage.getItem("HLT_isLock") || false, //是否锁屏
  isCover: localStorage.getItem("HLT_lockCOver") || false, //是否覆盖
}
const mutations = {
  SET_LOCK: (state, cover) => {
    state.isLock = true,
      state.isCover = cover
    localStorage.setItem("HLT_LockCOver", state.isCover);
  },
  CLEAR_LOCK: (state, cover) => {
    state.isCover = cover;
    state.isLock = false;
    state.lockPassWord = "";
    localStorage.removeItem("HLT_LockCOver");
  },
  PREVENT_REFRSH: (state, cover) => {
    state.isCover = cover
  }
}
const actions = {
  setlock: ({ commit }, cover) => {
    commit("SET_LOCK", cover)
  },
  clearLock: ({ commit }, args) => {
    commit("CLEAR_LOCK", args)
  },
  preventRefresh: ({ commit }, cover) => {
    commit("PREVENT_REFRSH", cover)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}




