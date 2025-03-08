import { baseUrl } from "@/stores/basic-data";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import { alertFail, showFail, showSuccess } from "./showMessage";
import qs from "qs";
import { gotoBack, gotoLogin } from "@/router";

let userStore: ReturnType<typeof useUserStore>;
const url = baseUrl;
axios.defaults.baseURL = url;
export const axiosClient = axios.create({
  baseURL: url,
  timeout: 3000,
});
axiosClient.interceptors.request.use((config) => {
  config.headers["authorization"] = userStore?.token;
  return config;
});
axiosClient.interceptors.response.use(
  (res) => {
    if (res.status >= 200 && res.status < 300) {
      showSuccess(res?.config?.url, res);
    } else {
      showFail(res?.config?.url, res);
    }
    return Promise.resolve(res);
  },
  (error) => {
    showFail(error?.config?.url, error);
    return Promise.reject(error);
  }
);
export async function apiLogin(loginData: any) {
  userStore = useUserStore();
  console.log(loginData);
  try {
    let res = await axiosClient.post("/login", qs.stringify(loginData));
    let token = "Bearer " + res?.data?.token;
    console.log(res, token);

    userStore.setToken(token);
    userStore.setLoginState(true);
    return Promise.resolve(res?.data);
  } catch (error: any) {
    alertFail(apiLogin.name, error?.message);
  }
}
export async function apiProfile() {
  userStore = useUserStore();
  try {
    let res = await axiosClient.get("/profile");
    let userData = res?.data;
    userStore.setUser(userData);
    return Promise.resolve(userData);
  } catch (error: any) {
    alertFail(apiProfile.name, error?.message);
  }
}
export async function apiLogout() {
  userStore = useUserStore();
  let res;
  try {
    res = await axiosClient.get("/logout");
    userStore.setLoginState(false);
    userStore.setToken("");
    userStore.setUser({});
    return Promise.resolve(res.data ? res.data : res?.statusText);
  } catch (error: any) {
    alertFail(apiLogout.name, error?.message);
    if (res?.status && res.status == 401) {
      userStore.setLoginState(false);
      userStore.setToken("");
      userStore.setUser({});
    }
    gotoLogin();
  }
}
export async function apiDeleteImageByPath(path: any) {
  console.log(apiDeleteImageByPath.name, path);
  if (path) {
    try {
      let data = await axiosClient.delete("/deleteimage-bypath" + path);
      showSuccess(apiDeleteImageByPath.name, data);
      return Promise.resolve(data);
    } catch (error) {
      let login = await autoLogin(error);
      if (login) {
        try {
          let data = await axiosClient.delete("/deleteimage-bypath" + path);
          showSuccess(apiDeleteImageByPath.name, data);
          return Promise.resolve(data);
        } catch (error: any) {
          alertFail(apiDeleteImageByPath.name, error?.message);
        }
      }
    }
  } else {
    alertFail(apiDeleteImageByPath.name, "待删除文件path不能为空");
  }
}

async function autoLogin(error: any) {
  if (error.status == 401) {
    userStore = useUserStore();
    let loginData = {
      account: userStore.account,
      password: userStore.password,
    };
    let data = await apiLogin(loginData);
    return Promise.resolve(data);
  } else {
    alertFail(error?.message, "");
  }
}
