import { baseUrl, imgUploadUrl } from "@/stores/basic-data";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import { alertFail, alertSuccess, showFail, showSuccess } from "./showMessage";
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
    alertFail(apiLogin.name, error?.response.data.message);
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
    alertFail(apiGetProfile.name, error?.response.data.message);
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
    alertFail(apiLogout.name, error?.response.data.message);
    if (res?.status && res.status == 401) {
      userStore.setLoginState(false);
      userStore.setToken("");
      userStore.setUser({});
    }
    gotoLogin();
  }
}

export async function apiRegister(registerData: {
  account: string;
  password: string;
  address: string;
  type: string;
}) {
  userStore = useUserStore();
  try {
    let res = await axiosClient.post("/register", qs.stringify(registerData));
    // console.log(res);
    alertSuccess(apiRegister.name, "注册成功");
    if (res.data.user.phone) {
      userStore.setAccount(res.data.user.phone);
    } else {
      userStore.setAccount(res.data.user.email);
    }
    userStore.setPassword(res.data.user.password);
    res.data.user.password = userStore.password;
    userStore.setUser(res.data.user);

    return Promise.resolve(res);
  } catch (error: any) {
    alertFail(apiLogout.name, error?.response.data.message);
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
    alertFail(apiModifyPassword.name, error?.response.data.message);
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
    alertFail(apiModifyUsername.name, error?.response.data.message);
    return Promise.reject(error);
  }
}

export async function apiModifyEmail(modifyData: {
  id: number;
  email: string;
}) {
  userStore = useUserStore();
  try {
    let res = await axiosClient.patch(
      "/modify-email",
      qs.stringify(modifyData)
    );
    alertSuccess(apiModifyEmail.name, res?.data?.message);
    // console.log(res);
    userStore.setUser(res?.data?.user);
    // console.log(userStore);

    return Promise.resolve(res);
  } catch (error: any) {
    alertFail(apiModifyEmail.name, error?.response.data.message);
    return Promise.reject(error);
  }
}

export async function apiModifyPhone(modifyData: {
  id: number;
  phone: string;
}) {
  userStore = useUserStore();
  try {
    let res = await axiosClient.patch(
      "/modify-phone",
      qs.stringify(modifyData)
    );
    alertSuccess(apiModifyPhone.name, res?.data?.message);
    // console.log(res);
    userStore.setUser(res?.data?.user);
    // console.log(userStore);

    return Promise.resolve(res);
  } catch (error: any) {
    alertFail(apiModifyPhone.name, error?.response.data.message);
    return Promise.reject(error);
  }
}

const API_BASE_URL = "http://localhost:8080"; // 后端地址

export const uploadImage = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append("id", id.toString()); // 确保 id 是字符串
  formData.append("image", file); // 文件对象

  try {
    const response = await axios.patch(
      `${API_BASE_URL}/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data; // 返回后端响应数据
  } catch (error) {
    console.error("上传失败:", error);
    throw error;
  }
};

export const getAvatarUrl = (fileName: string) => {
  return `${API_BASE_URL}/${fileName}`; // 返回完整的头像 URL
};
