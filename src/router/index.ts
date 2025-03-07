import Login from "@/views/Login.vue";
import Profile from "@/views/Profile.vue";
import { createRouter, createWebHistory } from "vue-router";
const routes = [
  { path: "/", name: "Home", component: Login },
  { path: "/login", name: "Login", component: Login },
  { path: "/profile", name: "Profile", component: Profile },
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
