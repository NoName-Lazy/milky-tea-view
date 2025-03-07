<template>
  <nut-navbar
    title="Milky-tea"
    left-show
    @click-back="dealNavBack"
  ></nut-navbar>
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
  <div class="center">
    <nut-button
      plain
      color="#880000"
      type="info"
      @click="LogIn"
      :disabled="isButtonDisabled"
      >登录</nut-button
    >
  </div>
</template>

<script setup lang="ts">
import { apiLogin } from "@/utils/apiUtils";
import { alertSuccess } from "@/utils/showMessage";
import { reactive, ref, watch } from "vue";
import logoSrc from "@/assets/coffee.jpg";
import { gotoBack } from "@/router";

const formData = reactive({
  account: "",
  password: "",
});

const formRef = ref(null);
const isButtonDisabled = ref(true);

async function LogIn() {
  let data = await apiLogin(formData);
  //   console.log(data);

  alertSuccess(LogIn.name, JSON.stringify(data));
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

function dealNavBack() {
  gotoBack();
}
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
}
.img {
  margin-top: 40px;
}
</style>
