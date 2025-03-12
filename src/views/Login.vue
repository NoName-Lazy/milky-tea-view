<template>
  <div class="login">
    <nut-navbar title="Milky-tea" left-show @click-back="gotoBack"></nut-navbar>
    <nut-row type="flex" justify="center">
      <nut-col :span="18" fill>
        <div class="img">
          <nut-image
            :src="logoSrc"
            width="100%"
            height="50vh"
            fit="cover"
            radius="10px"
          ></nut-image>
        </div>
      </nut-col>
    </nut-row>
    <nut-row type="flex" justify="center">
      <nut-col :span="18">
        <nut-form
          :model-value="formData"
          ref="formRef"
          :rules="{
            account: [{ required: true, message: '请填写账号' }],
            password: [{ required: true, message: '请填写密码' }],
          }"
        >
          <nut-form-item label="账号" prop="account">
            <nut-input
              v-model="formData.account"
              placeholder="请输入手机号或邮箱"
              @blur="customBlurValidate('account')"
            ></nut-input>
          </nut-form-item>
          <nut-form-item label="密码" prop="password">
            <nut-input
              v-model="formData.password"
              type="password"
              placeholder="请输入密码"
              @blur="customBlurValidate('password')"
            ></nut-input>
          </nut-form-item>
        </nut-form>
      </nut-col>
    </nut-row>
    <nut-row class="center">
      <nut-animate type="float" loop>
        <nut-button
          plain
          color="#880000"
          type="info"
          @click="LogIn"
          :disabled="isButtonDisabled"
          >登录</nut-button
        >
      </nut-animate>
    </nut-row>
    <nut-divider dashed :style="{ color: '#880000' }" />
    <nut-row class="center">
      <router-link :to="{ name: 'Register' }">
        <div class="register">若还没有账号，请注册</div>
      </router-link>
    </nut-row>
  </div>
</template>

<script setup lang="ts">
import { apiLogin } from "@/utils/apiUtils";
import { alertSuccess } from "@/utils/showMessage";
import { reactive, ref, watch } from "vue";
import logoSrc from "@/assets/coffee.jpg";
import { gotoBack, gotoRegister } from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const userStoreRef = storeToRefs(userStore);
const formData = reactive({
  account: userStoreRef.account,
  password: userStore.getDecodedPwd,
});

const formRef = ref(null);
const isButtonDisabled = ref(true);

async function LogIn() {
  let data = await apiLogin(formData);
  // console.log(data);
  if (data) {
    userStore.setUser(data.user);
    userStore.setPassword(formData.password);
    gotoBack();
  }
}

const customBlurValidate = (prop: any) => {
  formRef.value?.validate(prop).then(({ valid, errors }: any) => {
    if (valid) {
      console.log("success:", formData);
    } else {
      console.warn("error:", errors);
    }
    checkFormValidation();
  });
};

const checkFormValidation = () => {
  formRef.value?.validate().then(({ valid }: any) => {
    isButtonDisabled.value = !valid;
  });
};

watch(formData, () => {
  checkFormValidation();
});
</script>

<style scoped>
.login {
  min-height: 100vh;
  padding: 20px;
}

.nut-navbar {
  background-color: #880000; /* 导航栏背景色 */
  color: white; /* 导航栏文字颜色 */
}

.img {
  margin-top: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 图片阴影 */
  border-radius: 10px; /* 图片圆角 */
}

.nut-form {
  margin-top: 20px;
}

.nut-form-item {
  margin-bottom: 15px;
}

.nut-input {
  border-radius: 8px; /* 输入框圆角 */
  border: 1px solid #ddd; /* 输入框边框 */
  padding: 10px;
  font-size: 14px;
}

.nut-button {
  width: 100%;
  max-width: 200px;
  margin-top: 20px;
  border-radius: 25px; /* 按钮圆角 */
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease; /* 按钮 hover 动画 */
}

.nut-button:disabled {
  background-color: #ccc; /* 禁用按钮背景色 */
  color: #666; /* 禁用按钮文字颜色 */
}

.nut-button:not(:disabled):hover {
  background-color: #660000; /* 按钮 hover 背景色 */
  color: white; /* 按钮 hover 文字颜色 */
}

.nut-divider {
  margin: 20px 0;
}

.register {
  color: #880000; /* 注册链接颜色 */
  font-size: 14px;
  text-decoration: none; /* 去掉下划线 */
  transition: color 0.3s ease; /* 链接 hover 动画 */
}

.register:hover {
  color: #660000; /* 注册链接 hover 颜色 */
}

.center {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
