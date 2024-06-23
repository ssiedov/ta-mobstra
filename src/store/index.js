import Vue from "vue";
import Vuex from "vuex";
import { data, total } from "@/assets/data.json";

Vue.use(Vuex);

const persist = (store) => {
  // called when the store is initialized
  store.subscribe((mutation) => {
    // called after every mutation.
    // The mutation comes in the format of `{ type, payload }`.
    if (mutation.payload.name === "columnsList") {
      localStorage.setItem(
        "columnsList",
        JSON.stringify(mutation.payload.value)
      );
    }
    if (mutation.payload.name === "sortBy") {
      localStorage.setItem("sortBy", mutation.payload.value);
    }
  });
};

const checkColumnsList = () => {
  const columnsList = localStorage.getItem("columnsList");
  return columnsList ? JSON.parse(columnsList) : [];
};

const recurse = (obj, columns = []) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      recurse(obj[key], columns);
    } else {
      columns.push({ active: !["partner", "offer"].includes(key), name: key });
    }
  });
  return columns;
};

export default new Vuex.Store({
  plugins: [persist],
  state: {
    data: [],
    total: {},
    sortBy: localStorage.getItem("sortBy") || undefined,
    columnsList: checkColumnsList(),
  },
  getters: {
    getFilteredData(state, getters) {
      const params = getters.getActiveColumns;

      return state.data.map((item) => {
        const filteredItem = {};
        Object.keys(item).forEach((key) => {
          filteredItem[key] = {};
          Object.keys(item[key]).forEach((innerKey) => {
            if (params.includes(innerKey)) {
              filteredItem[key][innerKey] = item[key][innerKey];
            }
          });
          if (Object.keys(filteredItem[key]).length === 0) {
            delete filteredItem[key];
          }
        });
        return filteredItem;
      });
    },
    getActiveColumns(state) {
      return state.columnsList
        .filter((column) => column.active)
        .map((column) => column.name);
    },
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
  actions: {
    fetchData({ commit, state, getters }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (data && total) {
            commit("set", { name: "data", value: data });
            commit("set", { name: "total", value: total });
            if (!state.columnsList.length) {
              const columnsList = recurse(data[0]);
              commit("set", { name: "columnsList", value: columnsList });
            }
            if (!state.sortBy) {
              commit("set", {
                name: "sortBy",
                value: getters.getActiveColumns[0],
              });
            }
            resolve();
          } else {
            reject(new Error("error"));
          }
        }, 100);
      });
    },
    setColumnsList({ commit, getters, state }, value) {
      if (!getters.getActiveColumns.includes(state.sortBy)) {
        commit("set", { name: "sortBy", value: getters.getActiveColumns[0] });
      }
      commit("set", { name: "columnsList", value });
    },
    setSortBy({ commit }, value) {
      commit("set", { name: "sortBy", value });
    },
  },
});
