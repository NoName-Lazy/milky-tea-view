<template>
  <div v-if="userStore.isLogin">
    <nut-navbar title="Milky-tea" left-show @click-back="gotoBack"></nut-navbar>
    <nut-cell title="头像">
      <template #icon>
        <Jimi40 />
      </template>
      <template #desc>
        <div class="avatar-image">
          <nut-image
            :src="userDetail.avatar"
            width="50"
            height="50"
            fit="cover"
            round
          ></nut-image>
        </div>
      </template>
    </nut-cell>
    <nut-cell title="用户名" is-link @click="changeNameView">
      <template #icon>
        <My />
      </template>
      <template #desc>
        <div>{{ userDetail.username }}</div>
      </template>
    </nut-cell>
    <nut-popup
      v-model:visible="showPopup"
      position="bottom"
      closeable
      round
      :style="{ height: '30%' }"
      @click-overlay="changeshow"
    >
      <nut-input
        v-model="newUsername"
        placeholder="请更新用户名"
        clearable
        v-if="nameView"
      >
        <template #left>
          <Loading />
        </template>
        <template #right>
          <nut-button type="info" size="small" @click="changeUsername"
            >确定</nut-button
          >
        </template>
      </nut-input>
    </nut-popup>

    <nut-cell title="修改密码" is-link @click="changePwdView">
      <template #icon>
        <Edit />
      </template>
    </nut-cell>
    <nut-input
      v-model="newPassword"
      placeholder="请输入新密码"
      clearable
      v-if="pwdView"
      :type="pwdStyle"
    >
      <template #left>
        <Eye @click="changePwdStyle"></Eye>
      </template>
      <template #right>
        <nut-button type="info" size="small" @click="changePassword"
          >确定</nut-button
        >
      </template>
    </nut-input>
    <nut-cell title="邮箱">
      <template #icon>
        <Dongdong />
      </template>
      <template #desc>
        <div>{{ userDetail.email }}</div>
      </template>
    </nut-cell>
    <nut-cell title="电话">
      <template #icon>
        <Notice />
      </template>
      <template #desc>
        <div>{{ userDetail.phone }}</div>
      </template>
    </nut-cell>
    <nut-cell title="地址">
      <template #icon>
        <Location2 />
      </template>
      <template #desc>
        <div>{{ userDetail.address }}</div>
      </template>
    </nut-cell>
    <div class="center">
      <nut-button type="info" @click="logout" plain color="#880000"
        >登出</nut-button
      >
    </div>
  </div>
  <div v-else>
    <nut-navbar title="Milky-tea" left-show @click-back="gotoBack"></nut-navbar>
    <div class="center">
      <nut-button type="primary" @click="login" color="#880000"
        >去登录</nut-button
      >
    </div>
  </div>
</template>

// Profile.vue
<script setup lang="ts">
import { gotoBack, gotoLogin } from "@/router";
import { useUserStore } from "@/stores/user";
import {
  apiGetProfile,
  apiLogin,
  apiLogout,
  apiModifyPassword,
} from "@/utils/apiUtils";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import {
  Dongdong,
  Edit,
  Eye,
  Jimi40,
  Loading,
  Location2,
  My,
  Notice,
} from "@nutui/icons-vue";

const userStore = useUserStore();
const userStoreRef = storeToRefs(userStore);
const userDetail = userStore.user.user;

const newPassword = ref("");
const pwdView = ref(false);
const inputTypes = ["password", "text"];
const pwdStyle = ref(inputTypes[0]);

const newUsername = ref("");
const nameView = ref(false);

const showPopup = ref(false);

async function GetProfile() {
  await apiGetProfile(userDetail.id);
}

async function logout() {
  await apiLogout();
}

function login() {
  gotoLogin();
}

async function changePassword() {
  let modifyData = {
    id: userDetail.id,
    password: newPassword.value,
  };
  await apiModifyPassword(modifyData);
}

async function changeUsername() {}

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
    newPassword.value = "";
  }
}

function changeNameView() {
  changeshow();
  if (nameView.value) {
    newUsername.value = "";
  }
}

function changeshow() {
  showPopup.value = !showPopup.value;
  nameView.value = !nameView.value;
}

onMounted(() => {
  if (userStore.isLogin) {
    GetProfile();
  }
});
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.nut-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatar-image {
  margin-left: 220px;
}
</style>
