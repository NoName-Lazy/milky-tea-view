import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
import NutUI from "@nutui/nutui";
import Varlet from "@varlet/ui";
import "@varlet/ui/es/style";
import "@nutui/nutui/dist/style.css";
import "@nutui/touch-emulator";
import IconFont from "@arco-design/web-vue";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
const app = createApp(App);

app.use(createPinia().use(piniaPluginPersistedstate));
app.use(router);
app.use(NutUI);
app.use(Varlet);
app.use(IconFont);
app.use(ArcoVue);
app.mount("#app");
