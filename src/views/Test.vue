<template>
  <div class="upload-container">
    <nut-form>
      <nut-form-item label="用户ID">
        <nut-input v-model="userId" placeholder="请输入用户ID" type="number" />
      </nut-form-item>
      <nut-form-item label="选择图片">
        <nut-uploader
          v-model="fileList"
          :max-count="1"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-remove="handleRemove"
          :upload-url="uploadUrl"
          name="image"
          accept="image/*"
        >
          <nut-button type="primary">上传图片</nut-button>
        </nut-uploader>
      </nut-form-item>
    </nut-form>

    <div v-if="uploadStatus">
      <nut-textarea
        v-model:visible="uploadStatus.show"
        :type="uploadStatus.type"
      >
        {{ uploadStatus.message }}
      </nut-textarea>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Toast } from "@nutui/nutui";

const userId = ref("");
const fileList = ref([]);
const uploadStatus = ref(null);
const uploadUrl = "/api/upload-image";

const beforeUpload = (file) => {
  return new Promise((resolve, reject) => {
    if (!userId.value) {
      Toast.text("请先输入用户ID");
      reject(new Error("请先输入用户ID"));
    } else {
      // 可以在这里添加更多的异步校验逻辑
      resolve(true);
    }
  });
};

const handleSuccess = (response) => {
  Toast.text(response.message || "上传成功");
  uploadStatus.value = {
    show: true,
    type: "success",
    message: response.message || "上传成功",
  };
};

const handleError = (error) => {
  Toast.text(error.message || "上传失败");
  uploadStatus.value = {
    show: true,
    type: "danger",
    message: error.message || "上传失败",
  };
};

const handleRemove = () => {
  Toast.text("已移除图片");
};
</script>

<style scoped>
.upload-container {
  padding: 20px;
}
</style>
