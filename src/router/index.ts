import Login from "@/views/Login.vue";
import Profile from "@/views/Profile.vue";
import { createRouter, createWebHistory } from "vue-router";
const routes = [
  { path: "/", name: "Home", component: Profile },
  { path: "/login", name: "Login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
export function gotoLogin() {
  router.push({ name: "Login" });
}
export function gotoProfile() {
  router.push({ name: "Profile" });
}
export function gotoBack() {
  router.back();
}
