import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: {},
      token: "",
      isLogin: false,
    };
  },
  getters: {},
  actions: {
    setUser(userData: any) {
      this.user = userData;
    },
    setToken(token: any) {
      this.token = token;
    },
    setLoginState(isLogin: boolean) {
      this.isLogin = isLogin;
    },
  },
  persist: true,
});
