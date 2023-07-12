<template>
  <div class="app-container">
    <!-- 数据表格 -->
    <el-table :data="data" style="width: 100%" border>
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">{{
          scope.$index + (currentPage - 1) * eachPage + 1
        }}</template>
      </el-table-column>

      <el-table-column prop="title" label="文章名称" width="150" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="博客预览图"
            width="230"
            trigger="hover"
          >
            <el-image
              style="width: 200px"
              :src="scope.row.thumb"
              fit="contain"
              :preview-src-list="srcList"
            ></el-image>
            <a
              href="#"
              target="_blacn"
              @click.prevent="goToTitleHandle(scope.row)"
              slot="reference"
              >{{ scope.row.title }}</a
            >
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        prop="description"
        label="文章描述"
        width="150"
        align="center"
      >
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>

      <el-table-column prop="scanNumber" label="浏览数" align="center">
        <template slot-scope="scope">{{ scope.row.scanNumber }}</template>
      </el-table-column>

      <el-table-column prop="commentNumber" label="评论量" align="center">
        <template slot-scope="scope">{{ scope.row.commentNumber }}</template>
      </el-table-column>

      <el-table-column prop="name" label="所属分类" align="center">
        <template slot-scope="scope">
          {{ scope.row.category === null ? '未分类' : scope.row.category.name }}
        </template>
      </el-table-column>

      <el-table-column prop="createDate" label="创建日期" align="center">
        <template slot-scope="scope">{{ scope.row.createDate }}</template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editBlogHandle(scope.row)"
            ></el-button>
          </el-tooltip>
          <!-- 删除按钮 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="deleteBlog(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      background
      style="margin-top: 30px"
      :page-size="eachPage"
      :page-sizes="[5, 10, 20]"
      :current-page.sync = "pagerCurrentPage"
      layout="prev, pager, next, total, ->, sizes, jumper"
      :total="count"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="handlePrev"
      @next-click="handleNext"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getBlogList, delOneBlog } from "@/api/blog.js";
import { formatData } from "@/utils/tool.js";
import { server_URL, frontEnd_URL } from "@/urlConfig.js";

export default {
  data() {
    return {
      data: [],
      srcList: [], // 预览图数组
      eachPage: 5, // 每一页页数
      currentPage: 1, // 当前页码，默认进来是第一页
      totalPage: 0, // 总页数
      count: 0, // 数据总条数
      pagerCurrentPage: 1, //分页栏的当前页码
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getBlogList(this.currentPage, this.eachPage).then(({ data }) => {
        this.data = data.rows;
        for (let item of this.data) {
          item.createDate = formatData(item.createDate);
          item.thumb = server_URL + item.thumb;
          this.srcList.push(item.thumb);
        }
        this.count = data.total;
        this.totalPage = Math.ceil(this.count / this.eachPage);

        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage;
          this.fetchData();
        }
      });
    },
    // 跳到具体的文章
    goToTitleHandle(blogInfo) {
      window.open(`${frontEnd_URL}/article/${blogInfo.id}`);
    },

    // 删除文章
    deleteBlog(blogInfo) {
      this.$confirm(
        "删除该文章会将该文章下面的评论一并删除，是否继续?",
        "是否删除此篇文章",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          delOneBlog(blogInfo.id).then(() => {
            this.fetchData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //编辑文章
    editBlogHandle(blogInfo) {
      this.$router.push(`/editBlog/${blogInfo.id}`);
    },

    // 分页相关事件
    // 当前一页显示多少条数据
    handleSizeChange(pageNum) {
      this.eachPage = parseInt(pageNum);
      this.currentPage = 1;
      this.pagerCurrentPage = 1;
      this.fetchData();
    },
    // 页面点击跳转
    handleCurrentChange(pageNum) {
      this.currentPage = parseInt(pageNum);
      this.fetchData();
    },
    // 上一页
    handlePrev() {
      this.currentPage -= 1;
    },
    // 下一页
    handleNext() {
      this.currentPage += 1;
    },
  },
};
</script>

<style>
</style>