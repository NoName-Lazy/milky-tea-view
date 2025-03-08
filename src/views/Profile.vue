<template>
  <nut-navbar title="用户信息" left-show @click-back="gotoBack"></nut-navbar>
  <div v-if="userStoreRef.isLogin.value">
    <div>
      <p>{{ userStoreRef.user }}</p>
    </div>
    <div class="center">
      <nut-button type="primary" @click="logout"> 登出 </nut-button>
    </div>
  </div>
  <div v-else class="center">
    <nut-button type="info" @click="gotoLogin">去登录</nut-button>
  </div>
</template>

<script setup lang="ts">
import { gotoBack, gotoLogin as login } from "@/router";
import { useUserStore } from "@/stores/user";
import { apiLogout, apiProfile } from "@/utils/apiUtils";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
const userStore = useUserStore();
const userStoreRef = storeToRefs(userStore);
async function logout() {
  await apiLogout();
}
function gotoLogin() {
  login();
}
onMounted(async () => {
  await apiProfile();
});
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
