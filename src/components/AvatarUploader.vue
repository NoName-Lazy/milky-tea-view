<template>
  <div>
    <nut-image
      v-if="avatarUrl"
      :src="avatarUrl"
      width="100"
      height="100"
      fit="cover"
      round
    ></nut-image>
    <nut-uploader
      :url="uploadUrl"
      v-model:file-list="fileList"
      :maximum="1"
      @change="handleFileChange"
    >
      <nut-button type="primary" size="small">上传头像</nut-button>
    </nut-uploader>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { uploadImage, getAvatarUrl } from "@/utils/apiUtils";

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  initialAvatar: {
    type: String,
    default: "",
  },
});

const fileList = ref([]);
const avatarUrl = ref(props.initialAvatar);

const handleFileChange = async (files) => {
  if (files.length === 0) return;

  const file = files[0].file;
  try {
    const response = await uploadImage(props.userId, file);
    avatarUrl.value = getAvatarUrl(response.user.avatar); // 更新头像 URL
    console.log("上传成功:", response);
  } catch (error) {
    console.error("上传失败:", error);
  }
};
</script>

<style scoped>
/* 自定义样式 */
</style>
