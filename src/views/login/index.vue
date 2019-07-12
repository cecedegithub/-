<template>
  <div>
    <van-nav-bar class="dl" title="登陆" />
    <van-cell-group>
      <van-field
        v-model="user.mobile"
        clearable
        label="用户名"
        left-icon="contact"
        placeholder="请输入用户名"
        :error-message="errors.mobile"
        @click-right-icon="$toast('question')"
      />
      <van-field
        v-model="user.code"
        center
        clearable
        label="短信验证码"
        placeholder="请输入短信验证码"
        :error-message="errors.code"
      >
        <van-button slot="button" size="small" type="primary"
          >发送验证码</van-button
        >
      </van-field>
    </van-cell-group>
    <van-button size="large" type="warning" @click="loginLogin"
      >登陆</van-button
    >
  </div>
</template>

<script>
import { login } from "@/api/user";
export default {
  name: "login",
  methods: {
    async loginLogin() {
      try {
        const { mobile, code } = this.user;
        const errors = this.errors;
        if (mobile.length) {
          errors.mobile = "";
        } else {
          return (errors.mobile = "请输入正确的手机号码");
        }
        if (code.length) {
          errors.code = "";
        } else {
          return (errors.code = "请输入正确的验证码");
        }
        const res = await login(this.user);
        this.$store.commit("setUser", res.data.data);

        this.$router.push({
          name: "home"
        });
      } catch (err) {
        window.console.log(err);
      }
    }
  },
  data() {
    return {
      user: {
        mobile: "",
        code: ""
      },
      errors: {
        mobile: "",
        code: ""
      }
    };
  }
};
</script>

<style scoped>
.dl {
  background-color: #6db4fb;
}
</style>
