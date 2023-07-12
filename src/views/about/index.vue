<template>
  <div class="app-container">
    <div class="block">关于我</div>
    <el-input v-model="url" placeholder="请输入内容" :disabled="isDisabled"></el-input>
      <el-button type="primary" style="margin-top: 15px" @click="editHandle">{{ btnContent }}</el-button>
  </div>
</template>

<script>
import { getAbout, editAbout } from '@/api/about.js';

export default {
  data() {
    return {
      url: '',
      isDisabled: true,
      btnContent: '编辑'
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getAbout().then(({data}) => {
        this.url = data;
      })
    },
    editHandle() {
      if(this.btnContent === '编辑') {
        this.btnContent = '完成'
        this.isDisabled = !this.isDisabled;
      } else { //代表在编辑当中
        if(this.url) {
          this.btnContent = '编辑'
          this.isDisabled = !this.isDisabled;
          editAbout({url: this.url}).then((res)=> {
            console.log(res, 'cvdf');
          })
          this.$message.success('更改成功!');
        } else {
          this.$message.warning('输入框不能为空');
        }
      }
    }
  },
};
</script>

<style scoped lang="scss">
.block {
  font-weight: 100;
  margin: 15px 0;
}
</style>