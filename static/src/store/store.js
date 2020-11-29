import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    uid: 0,
    token: ""
  },
  mutations: {
    setToken (state, data) {
      state.uid = data.uid;
      state.token = data.token;
    }
  }
})