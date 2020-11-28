import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    uid: 1,
    token: "4e13398e7899657c97fd500953f47e8f"
  },
  mutations: {
    setToken (state, uid, token) {
      state.uid = uid;
      state.token = token;
    }
  }
})