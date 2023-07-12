<template>
  <div class="app-container">
    <el-form
      :model="adminInfo"
      :rules="setRules"
      ref="ruleForm"
      label-width="100px"
      width="500px"
    >
      <el-form-item label="用户名">
        <el-input 
          placeholder="请输入用户名" 
          v-model="adminInfo.name">
        </el-input>
      </el-form-item>

      <el-form-item label="旧密码" prop="oldLoginPwd">
        <el-input
          placeholder="请输入旧密码"
          v-model="adminInfo.oldLoginPwd"
          type="password"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="新密码" porp="loginPwd">
        <el-input
          placeholder="请输入新密码"
          v-model="adminInfo.loginPwd"
          type="password"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="新密码确认" prop="loginPwdConfirm" type="password">
        <el-input
          placeholder="请确认新密码"
          v-model="adminInfo.loginPwdConfirm"
          type="password"
        >
        </el-input>
      </el-form-item>

      <el-button type="primary" style="margin-top: 15px" @click="modifyHandle"
        >修改</el-button
      >
      <el-button type="danger" style="margin-top: 15px" @click="backHandle"
        >返回</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { setUser, getInfo } from "@/api/user.js";

export default {
  data() {
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.adminInfo.loginPwd) {
        callback(new Error("两次输入的密码不一致！"));
      } else {
        callback();
      }
    };
    return {
      adminInfo: {
        id: "",
        loginId: "",
        name: "",
        oldLoginPwd: "",
        loginPwd: "",
        loginPwdConfirm: "",
      },
      setRules: {
        oldLoginPwd: [
          { required: true, trigger: "blur", message: "请输入旧的密码" },
        ],
        loginPwd: [
          { required: true, trigger: "blur", message: "请输入新的密码" },
        ],
        loginPwdConfirm: [
          { required: true, trigger: "blur", message: "请再次输入新密码" },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getInfo().then(({ data }) => {
        console.log(data);
        this.adminInfo = data;
      });
    },
    modifyHandle() {
      if (this.adminInfo.name && this.adminInfo.loginPwd && this.adminInfo.oldLoginPwd) {
        setUser(this.adminInfo).then((res) => {
          console.log(res);
          if (typeof res === 'string') {
            const resp = JSON.parse(res);
            this.$message.error(resp.msg);
          } else {
            // 说明修改成功
            this.$message.success('修改密码成功');
            this.$store.dispatch('user/logout').then(() => {
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            })
          }
        });
      } else {
        this.$message.error('请填写所有项目');
      }
    },
    backHandle() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.app-container {
  width: 500px;
}
</style>