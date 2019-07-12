import Vue from "vue";
import Router from "vue-router";
import Login from "../views/login";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/home",
      name: "home",
      component: () => import(/* webpackChunkName: "about" */ "../views/home")
    }
  ]
});
