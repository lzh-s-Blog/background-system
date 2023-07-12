<template>
  <div class="app-container">
    <!-- 文章标题 -->
    <div class="block">文章标题</div>
    <div style="margin-bottom: 15px">
      <el-input placeholder="请输入文章标题" v-model="form.title"></el-input>
    </div>

    <!-- 文章编辑 -->
    <div class="block">文章编辑</div>
    <editor
      ref="toastuiEditor"
      :initialValue="form.editorText"
      height="600px"
      :options="editorOptions"
    />

    <!-- 文章描述 -->
    <div class="block">文章描述</div>
    <el-input type="textarea" v-model="form.description" :rows="6"></el-input>

    <!-- 文章头图 -->
    <Upload uploadTitle="文章头图" v-model="form.thumb" />

    <!-- 选择分类 -->
    <div class="block">选择分类</div>
    <el-select
      v-model="form.select"
      slot="prepend"
      placeholder="请选择文章分类"
    >
      <el-option
        :label="item.name"
        v-for="item in blogType"
        :key="item.id"
        :value="item.id"
      ></el-option>
    </el-select>

    <!-- 发布按钮 -->
    <div>
      <el-button
        type="primary"
        style="margin-top: 15px"
        @click="addArticleHandle"
        >{{ btnContent }}</el-button
      >
    </div>
  </div>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
import Upload from "@/components/Upload.vue";
import { getBlogType } from "@/api/blogType.js";
import { addBlog } from "@/api/blog.js";
import { editBlog, findOneBlog } from "@/api/blog.js";
import "@toast-ui/editor/dist/i18n/zh-cn";

export default {
  props: ["mode"],
  components: {
    editor: Editor,
    Upload,
  },
  data() {
    return {
      form: {
        title: "",
        thumb: "",
        editorText: "",
        description: "",
        select: "", //下拉列表
      },
      blogType: [], // 存放博客分类
      imageUrl: "", // 图片在服务器上的地址
      editorOptions: {
        language: "zh-CN",
      },
      btnContent: "发布文章",
    };
  },
  created() {
    getBlogType().then(({ data }) => {
      // this.blogType = res.data;
      this.blogType = data;
    });

    if (this.mode === "edit") {
      // 一进来的时候，就拿到传递过来的id，根据这个id获取到这篇文章的内容，回填到表单
      this.id = this.$route.params.id;
      findOneBlog(this.id).then(({ data }) => {
        this.form = data;
        // 有些文章可能是未分类
        console.log(this.form);
        this.form.select = data.category === null ? "" : data.category.id;
        this.$refs.toastuiEditor.invoke("setHTML", data.htmlContent);
      });
      this.btnContent = '确认修改'
    }
  },
  methods: {
    addArticleHandle() {
      // 添加文章的业务逻辑 1、获取表单内容 2、发送请求
      let html = this.$refs.toastuiEditor.invoke("getHTML");
      let markdown = this.$refs.toastuiEditor.invoke("getMarkdown");

      // 接下来，组装一下传递给服务器的对象
      let obj = {
        title: this.form.title,
        description: this.form.description,
        createDate: new Date().getTime(),
        categoryId: this.form.select,
        toc: [],
        htmlContent: html,
        thumb: this.form.thumb,
        markdownContent: markdown,
      };
      //对象组装好之后，就提交给服务器
      if (obj.title && obj.description && obj.htmlContent && obj.categoryId) {
        if (this.mode === "add") {
          // 说明要新增
          addBlog(obj).then(() => {
            this.$router.push("/blogList"); // 跳转到文章列表
          });
        } else {
          // 否则说明是要编辑
          editBlog({ id: this.form.id, data: obj }).then(() => {
            this.$router.push("/blogList"); // 跳转到文章列表
            this.$message.success("文章修改成功");
          });
        }
      } else {
        this.$message.error("请填写所有内容");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
</style>