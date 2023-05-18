import { createApp, defineComponent } from "vue";
import { createStore, Store } from "vuex";
import VuexPersist from "vuex-persist";
import axios from "axios";

const vuexLocalStorage = new VuexPersist({
  key: "vuex", // The key to store the state on in the storage provider.
  storage: window.localStorage // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
});


interface State {
  loading: boolean;
  itemsTouchedThreeTimes: any[]; // Replace 'any' with the appropriate type for your items
  itemsTouchedTwoTimes: any[]; // Replace 'any' with the appropriate type for your items
  containerHeight: number;
  moviesList: {},
}


declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>; // Replace 'State' with your actual state type
  }
}

// Create a new store instance or import from module.
const store: Store<State> = createStore<State>({
  plugins: [vuexLocalStorage.plugin],
  state: {
    loading: false,
    itemsTouchedThreeTimes: [],
    itemsTouchedTwoTimes: [],
    containerHeight: 0,
    moviesList: {},
  },
  mutations: {
    setLoading: (state, value) => state.loading = value,
    setContainerHeight: (state, value) => state.containerHeight = value,
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
    addMoviesList: (state, { key, value }) => state.moviesList = { ...state.moviesList, ...{ [key]: value } },
    setMoviesList: (state, value) => state.moviesList = value,
  },
  getters: {
    getLoading: (state) => state.loading,
    getItemsTouchedThreeTimes: (state) => state.itemsTouchedThreeTimes,
    getItemsTouchedTwoTimes: (state) => state.itemsTouchedTwoTimes,
    getContainerHeight: (state) => state.containerHeight,
    getMoviesList: (state) => state.moviesList,
  },
  actions: {
    reset({ commit }) {
      commit('setLoading', false)
      commit('setItemsTouchedThreeTimes', [])
      commit('setItemsTouchedTwoTimes', [])
      commit('setContainerHeight', 0)
      // commit('setMoviesList', {})
    },
    buildMoviesListCache({ commit, dispatch, getters }, data) {
      // console.log(data);

      commit('addMoviesList', { key: data.cacheKey, value: data.items });
      // dispatch('_fetchItems')
      console.log('--------------------------------');

      // console.log(getters.getMoviesList);

    },
  }
});

export default store
