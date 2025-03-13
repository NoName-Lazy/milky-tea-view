<template>
  <nut-navbar title="Milky-tea" left-show @click-back="gotoBack"></nut-navbar>

  <nut-row type="flex" justify="center">
    <nut-col :span="18">
      <nut-form :model-value="formData">
        <nut-form-item label="账号" prop="account">
          <nut-input
            v-model="formData.account"
            placeholder="请输入手机号或邮箱"
            type="text"
          ></nut-input>
        </nut-form-item>
        <nut-form-item label="密码" prop="password">
          <nut-input
            v-model="formData.password"
            placeholder="请输入密码"
            type="password"
          ></nut-input>
        </nut-form-item>
        <nut-form-item label="地址" prop="address">
          <nut-input
            v-model="formData.address"
            placeholder="请选择地址"
            type="text"
          ></nut-input>
        </nut-form-item>
        <nut-space style="margin: 10px">
          <nut-button type="primary" size="small" @click="Register">
            注册
          </nut-button>
        </nut-space>
      </nut-form>
    </nut-col>
  </nut-row>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { gotoBack, gotoProfile, gotoRegister } from "@/router";
import { useUserStore } from "@/stores/user";
import { apiRegister } from "@/utils/apiUtils";
import { isEmail } from "@/utils/checkUtils";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const userStoreRef = storeToRefs(userStore);
const formData = reactive({
  account: "",
  password: "",
  address: "",
  type: "",
});

// 注册逻辑
async function Register() {
  if (isEmail(formData.account)) {
    formData.type = "email";
  } else {
    formData.type = "phone";
  }
  let res = await apiRegister(formData);
  if (res) {
    gotoProfile();
  }
}
</script>

<style scoped>
#map-container {
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
