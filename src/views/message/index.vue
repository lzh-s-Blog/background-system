<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="data"
      style="width: 100%"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          {{ scope.$index + (currentPage - 1) * eachPage + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center" width="80">
        <template slot-scope="scope">
          <el-avatar
            shape="square"
            size="small"
            :src="scope.row.avatar2"
          ></el-avatar>
        </template>
      </el-table-column>

      <el-table-column label="昵称" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>

      <el-table-column label="内容" align="center">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>

      <el-table-column label="创建日期" align="center" width="230">
        <template slot-scope="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            content="删除"
            placement="top"
            :hide-after="1500"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteMessageHandle(scope.row)"
            >
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div class="block">
      <el-pagination
        background
        style="margin-top: 30px"
        :page-size="eachPage"
        :page-sizes="[5, 10, 15, 20]"
        :current-page.sync="pagerCurrentPage"
        layout="prev, pager, next, total, ->, sizes, jumper"
        :total="count"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @prev-click="handlePrev"
        @next-click="handleNext"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getMessage, delMessage } from "@/api/message.js";
import { server_URL } from "@/urlConfig.js";
import { formatData } from "@/utils/tool.js";

export default {
  data() {
    return {
      listLoading: false,
      data: [],
      eachPage: 5, //每一页页数
      currentPage: 1, //当前页码，默认进来是第一页
      totalPage: 0, // 总页数
      count: 0, // 数据总条数
      pagerCurrentPage: 1, // 分页栏当前页码
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getMessage().then(({ data }) => {
        this.data = data.rows;
        for (let i of this.data) {
          i.avatar2 = server_URL + i.avatar;
          i.createDate = formatData(i.createDate);
        }
        this.count = data.total;
        this.totalPage = Math.ceil(this.count / this.eachPage);
        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage;
          this.fetchData();
        }
      });
    },
    deleteMessageHandle(messageInfo) {
      this.$confirm("是否删除此条留言信息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delMessage(messageInfo.id).then(() => {
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

    // 分页相关事件
    // 当前一页显示多少条数据
    handleSizeChange(pageNum) {
      this.eachPage = parseInt(pageNum);
      this.currentPage = 1;
      this.pagerCurrentPage = 1; // 将分页组件重新回到第一页
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