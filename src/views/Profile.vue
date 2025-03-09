<template>
  <nut-navbar title="用户信息" left-show @click-back="gotoBack"></nut-navbar>
  <div v-if="userStoreRef.isLogin.value">
    <nut-cell title="头像" center>
      <template #icon>
        <Image />
      </template>
      <template #desc>
        <nut-avatar size="normal">
          <img :src="userDetail.avatar" />
        </nut-avatar>
      </template>
    </nut-cell>
    <nut-cell title="用户名" center is-link @click="changeNameView">
      <template #icon>
        <My />
      </template>
      <template #desc>
        <span>{{ userDetail.username }}</span>
      </template>
    </nut-cell>
    <nut-input
      v-model="newName"
      placeholder="请输入用户名"
      clearable
      v-if="nameView"
    >
      <template #left>
        <Edit />
      </template>
      <template #right>
        <nut-button type="info" size="small" @click="changeUsername"
          >确定</nut-button
        >
      </template>
    </nut-input>

    <nut-cell title="修改密码" is-link @click="changePwdView" center>
      <template #icon>
        <Eye />
      </template>
    </nut-cell>
    <nut-input
      v-model="newPwd"
      placeholder="请输入新密码"
      clearable
      v-if="pwdView"
      :type="pwdStyle"
    >
      <template #left>
        <Edit @click="changePwdStyle"></Edit>
      </template>
      <template #right>
        <nut-button type="info" size="small" @click="changePassword"
          >确定</nut-button
        >
      </template>
    </nut-input>
    <nut-cell title="邮箱" center>
      <template #icon>
        <Jdl />
      </template>
      <template #desc>
        <span>{{ userDetail.email }}</span>
      </template>
    </nut-cell>
    <nut-cell title="手机号" center>
      <template #icon>
        <Notice />
      </template>
      <template #desc>
        <span>{{ userDetail.phone }}</span>
      </template>
    </nut-cell>
    <nut-cell title="地址" center>
      <template #icon>
        <Location2 />
      </template>
      <template #desc>
        <span>{{ userDetail.address }}</span>
      </template>
    </nut-cell>
    <div class="center">
      <nut-button type="primary" @click="logout" plain color="#880000"
        >登出</nut-button
      >
    </div>
  </div>
  <div v-else class="center">
    <nut-button type="info" @click="gotoLogin" color="#880000"
      >去登录</nut-button
    >
  </div>
</template>

<script setup lang="ts">
import { gotoBack, gotoLogin as login } from "@/router";
import { useUserStore } from "@/stores/user";
import {
  apiLogout,
  apiGetProfile,
  apiModifyPassword,
  apiRename,
} from "@/utils/apiUtils";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import { Eye, My, Image, Location2, Jdl, Notice, Edit } from "@nutui/icons-vue";
const userStore = useUserStore();
const userStoreRef = storeToRefs(userStore);
const userDetail = reactive({
  id: 0,
  avatar: "",
  username: "",
  email: "",
  phone: "",
  address: "",
});

const pwdView = ref(false);
const newPwd = ref(userStore.getDecodedPwd);
const inputTypes = ["password", "text"];
const pwdStyle = ref(inputTypes[0]);

const newName = ref(userDetail.username);
const nameView = ref(false);

async function changePassword() {
  let data = await apiModifyPassword(userDetail.id, newPwd.value);
  if (data) {
    userStore.setPassword(newPwd.value);
  }
}

async function changeUsername() {
  await apiRename(userDetail.id, newName.value);
  getProfileDetail();
}

function changePwdStyle() {
  if (pwdStyle.value == inputTypes[0]) {
    pwdStyle.value = inputTypes[1];
  } else {
    pwdStyle.value = inputTypes[0];
  }
}

function changePwdView() {
  pwdView.value = !pwdView.value;
  if (pwdView.value) {
    newPwd.value = userStore.getDecodedPwd;
  }
}

function changeNameView() {
  nameView.value = !nameView.value;
}

async function logout() {
  await apiLogout();
}
function gotoLogin() {
  login();
}
async function getProfileDetail() {
  let data = await apiGetProfile();
  userDetail.id = data.user.id;
  userDetail.avatar = data.user.avatar;
  userDetail.username = data.user.username;
  userDetail.email = data.user.email;
  userDetail.phone = data.user.phone;
  userDetail.address = data.user.address;
  console.log(userDetail);
}
onMounted(async () => {
  getProfileDetail();
});
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
span {
  color: black;
  margin-right: 15px;
}
</style>
