import { defineStore } from "pinia";
import CryptoJS from "crypto-js";
const KEY = "daitj234jb235";
function encryptText(text: string) {
  return CryptoJS.AES.encrypt(text, KEY).toString();
}
function decryptText(encoded_text: string) {
  let bytes = CryptoJS.AES.decrypt(encoded_text, KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
function encryptObject(object: any) {
  return CryptoJS.AES.encrypt(JSON.stringify(object), KEY).toString();
}
function decryptObject(encoded_object: any) {
  let bytes = CryptoJS.AES.decrypt(encoded_object, KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: {},
      token: "",
      isLogin: false,
      account: "",
      password: "",
    };
  },
  getters: {
    getDecodedPwd(): string {
      return decryptText(this.password);
    },
  },
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
    setAccount(name: string) {
      this.account = name;
    },
    setPassword(pwd: string) {
      this.password = pwd;
    },
  },
  persist: {
    serializer: {
      serialize: (state) => encryptObject(state),
      deserialize: (data) => decryptObject(data),
    },
  },
});
