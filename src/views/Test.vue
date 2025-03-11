<script setup>
import { StyleProvider, Themes } from "@varlet/ui";
import { ref } from "vue";

// 定义一个变量来存储当前主题
const currentTheme = ref(null);

// 定义一个方法来切换主题
const switchTheme = (theme) => {
  StyleProvider(theme); // 注入主题变量
  currentTheme.value = theme; // 更新当前主题
};
</script>

<template>
  <var-space direction="column" size="large">
    <var-button type="primary" block @click="switchTheme(Themes.md3Light)"
      >Material Design 3 亮色</var-button
    >
    <var-button type="primary" block @click="switchTheme(Themes.md3Dark)"
      >Material Design 3 暗色</var-button
    >
  </var-space>
</template>
