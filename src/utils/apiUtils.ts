import { baseUrl } from "@/stores/basic-data";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import { alertFail, alertSuccess, showFail, showSuccess } from "./showMessage";
import qs from "qs";
import { gotoBack, gotoLogin } from "@/router";
import { useRouter } from "vue-router";

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
      showSuccess(res?.config?.url, "");
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

  try {
    let res = await axiosClient.post("/login", qs.stringify(loginData));
    console.log(res);
    let token = "Bearer " + res?.data?.user?.token;
    userStore.setToken(token);
    userStore.setLoginState(true);
    return Promise.resolve(res?.data);
  } catch (error: any) {
    alertFail(apiLogin.name, error?.message);
  }
}

export async function apiGetProfile(id: Number) {
  userStore = useUserStore();
  try {
    let res = await axiosClient.get("/profile", { params: { id } });
    let userData = res?.data;
    // console.log(userData);

    userStore.setUser(userData.user);
    return Promise.resolve(userData);
  } catch (error: any) {
    alertFail(apiGetProfile.name, error?.message);
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

export async function apiModifyPassword(modifyData: {
  id: number;
  password: string;
}) {
  userStore = useUserStore();

  try {
    let res = await axiosClient.patch(
      "/modify-password",
      qs.stringify(modifyData)
    );
    // console.log(res);
    alertSuccess(apiModifyPassword.name, res?.data?.message);
    userStore.setPassword(modifyData.password);

    return Promise.resolve(res);
  } catch (error: any) {
    alertFail(apiModifyPassword.name, error?.message);
    return Promise.reject(error);
  }
}

export async function apiModifyUsername(modifyData: {
  id: number;
  username: string;
}) {
  userStore = useUserStore();
  try {
    let res = await axiosClient.patch(
      "/modify-username",
      qs.stringify(modifyData)
    );
    alertSuccess(apiModifyUsername.name, res?.data?.message);
    // console.log(res);
    userStore.setUser(res?.data?.user);
    // console.log(userStore);

    return Promise.resolve(res);
  } catch (error: any) {
    alertFail(apiModifyUsername.name, error?.message);
    return Promise.reject(error);
  }
}
