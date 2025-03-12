<template>
  <div v-if="userStore.isLogin">
    <nut-navbar title="Milky-tea" left-show @click-back="gotoBack"></nut-navbar>

    <nut-cell title="头像" is-link @click="openFilePicker">
      <template #icon>
        <Jimi40 />
      </template>
      <template #desc>
        <div class="avatar-image">
          <nut-image
            :src="avatarUrl"
            width="50"
            height="50"
            fit="cover"
            round
          ></nut-image>
        </div>
      </template>
    </nut-cell>
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      accept="image/*"
      @change="handleFileChange"
    />
    <nut-cell title="用户名" is-link @click="changeNameView">
      <template #icon>
        <My />
      </template>
      <template #desc>
        <div>{{ userDetail?.username }}</div>
      </template>
    </nut-cell>
    <nut-popup
      v-model:visible="showPopup"
      position="bottom"
      closeable
      round
      :style="{ height: '30%' }"
      @click-overlay="changeshow"
      @click-close-icon="changeshow"
    >
      <nut-input
        v-model="newUsername"
        placeholder="请更新用户名"
        clearable
        v-if="nameView"
        style="margin-top: 40px"
      >
        <template #left>
          <Loading />
        </template>
        <template #right>
          <nut-button
            color="#880000"
            type="info"
            size="small"
            @click="changeUsername"
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
        <div>{{ userDetail?.email }}</div>
      </template>
    </nut-cell>
    <nut-cell title="电话">
      <template #icon>
        <Notice />
      </template>
      <template #desc>
        <div>{{ userDetail?.phone }}</div>
      </template>
    </nut-cell>
    <nut-cell title="地址">
      <template #icon>
        <Location2 />
      </template>
      <template #desc>
        <div>{{ userDetail?.address }}</div>
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
  apiModifyUsername,
} from "@/utils/apiUtils";
import { storeToRefs } from "pinia";
import { onActivated, onMounted, reactive, ref, watch } from "vue";
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
import { uploadImage, getAvatarUrl } from "@/utils/apiUtils";
const userStore = useUserStore();
const userStoreRef = storeToRefs(userStore);
const userDetail: any = userStore.user;

const newPassword = ref("");
const pwdView = ref(false);
const inputTypes = ["password", "text"];
const pwdStyle = ref(inputTypes[0]);

const newUsername = ref("");
const nameView = ref(false);

const showPopup = ref(false);

const avatarUrl = ref(
  userDetail?.avatar ? getAvatarUrl(userDetail.avatar) : ""
);
const fileInput = ref<HTMLInputElement | null>(null);

async function GetProfile() {
  await apiGetProfile(userDetail.id);
}

async function logout() {
  await apiLogout();
}

function login() {
  gotoLogin();
}

// 打开文件选择器
const openFilePicker = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// 处理文件选择
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    try {
      const response = await uploadImage(userDetail.id, file);
      // console.log(response);

      avatarUrl.value = getAvatarUrl(response.user.avatar); // 更新头像 URL
      // console.log(avatarUrl.value);

      console.log("上传成功");
    } catch (error) {
      console.error("上传失败:", error);
    }
  }
};

async function changePassword() {
  let modifyData = {
    id: userDetail.id,
    password: newPassword.value,
  };
  await apiModifyPassword(modifyData);
  pwdView.value = false;
}

async function changeUsername() {
  let modifyData = {
    id: userDetail.id,
    username: newUsername.value,
  };
  await apiModifyUsername(modifyData);

  userDetail.username = newUsername.value;
  showPopup.value = false;
  nameView.value = false;
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
    newPassword.value = userStore.getDecodedPwd;
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
    // console.log(userDetail);
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
