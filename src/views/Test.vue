<template>
  <div>
    <input type="file" @change="onFileSelected" />
    <button @click="uploadAvatar">上传头像</button>
    <div v-if="imageUrl">
      <img :src="imageUrl" alt="Uploaded Avatar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  avatar?: string; // 头像 URL，可能不存在
}

interface Request {
  code: number;
  message: string;
  user?: User; // 用户数据，可能不存在
}

const selectedFile = ref<File | null>(null);
const imageUrl = ref<string | null>(null);
const request = ref<Request>({ code: 0, message: "", user: undefined });

const onFileSelected = (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  selectedFile.value = fileInput.files ? fileInput.files[0] : null;
};

const uploadAvatar = async () => {
  if (!selectedFile.value) {
    alert("请先选择一个文件");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("id", "2"); // 假设用户ID为2
    formData.append("avatar", selectedFile.value);

    const response = await axios.patch(
      "http://localhost:8080/change-avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const data = response.data as Request;
    if (data.code === 200 && data.user) {
      imageUrl.value = `http://localhost:8080/uploads/avatars/${data.user.avatar}`;
      alert("头像更新成功");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("上传头像失败", error);
    alert("上传头像失败");
  }
};
</script>
