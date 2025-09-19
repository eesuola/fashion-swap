import { createStore } from "vuex";
import axios from "axios";

const API = "http://localhost:5000/api"; // ✅ your backend API base

export default createStore({
  state: {
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    LOGOUT(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  actions: {
    async login({ commit }, credentials) {
      const { data } = await axios.post(`${API}/auth/login`, credentials);
      commit("SET_USER", data.user);
      commit("SET_TOKEN", data.token);
    },
    async signup({ commit }, userData) {
      const { data } = await axios.post(`${API}/auth/register`, userData);
      commit("SET_USER", data.user);
      commit("SET_TOKEN", data.token);
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
  },
});
