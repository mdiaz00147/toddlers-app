import { createApp } from "vue";
import { createStore } from "vuex";
import VuexPersist from "vuex-persist";

const vuexLocalStorage = new VuexPersist({
  key: "vuex", // The key to store the state on in the storage provider.
  storage: window.localStorage // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
});


// Create a new store instance or import from module.
const store = createStore({
  plugins: [vuexLocalStorage.plugin],
  state: {
    loading: false,
    itemsTouchedThreeTimes: [],
    itemsTouchedTwoTimes: [],
  },
  mutations: {
    setLoading: (state, value) => state.loading = value,
    setItemsTouchedTwoTimes: (state, value) => state.itemsTouchedTwoTimes = value,
    setItemsTouchedThreeTimes: (state, value) => state.itemsTouchedThreeTimes = value,
    addItemsTouchedTwoTimes: (state, value) => {
      state.itemsTouchedTwoTimes = Array.from(new Set([...state.itemsTouchedTwoTimes, value]));
    },
    addItemsTouchedThreeTimes: (state, value) => {
      state.itemsTouchedThreeTimes = Array.from(new Set([...state.itemsTouchedThreeTimes, value]));
    },
    deleteItemsTouchedThreeTimes: (state, value) => {
      const itemIndex = state.itemsTouchedThreeTimes.indexOf(value);
      // if item actually exists in the array
      if (itemIndex !== - 1) {
        state.itemsTouchedThreeTimes.splice(itemIndex, 1);
      }
    },
    deleteItemsTouchedTwoTimes: (state, value) => {
      const itemIndex = state.itemsTouchedTwoTimes.indexOf(value);
      // if item actually exists in the array
      if (itemIndex !== - 1) {
        state.itemsTouchedTwoTimes.splice(itemIndex, 1);
      }
    },
  },
  getters: {
    getLoading: (state) => state.loading,
    getItemsTouchedThreeTimes: (state) => state.itemsTouchedThreeTimes,
    getItemsTouchedTwoTimes: (state) => state.itemsTouchedTwoTimes,
  },
  actions: {
    reset({ commit }) {
      commit('setLoading', false)
      commit('setItemsTouchedThreeTimes', [])
      commit('setItemsTouchedTwoTimes', [])
    }
  }
});

export default store