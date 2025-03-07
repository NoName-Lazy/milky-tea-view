import { baseUrl } from "@/stores/basic-data";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import { alertFail, showFail, showSuccess } from "./showMessage";
import qs from "qs";
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
//   console.log(loginData);
  try {
    let res = await axiosClient.post("/login", qs.stringify(loginData));
    let token = "Bearer " + res?.data?.access_token;
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
    return error;
  }
}
