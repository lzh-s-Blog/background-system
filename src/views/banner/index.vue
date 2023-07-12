<template>
  <div class="app-container">
    <template>
      <!-- 获取首页标语  -->
      <el-table :data="data" style="width: 100%" border>
        <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="标题" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="描述">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="中图预览" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 100px"
              :src="scope.row.midImg1"
              fit="fill"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="大图预览" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 100px"
              :src="scope.row.bigImg1"
              fit="fill"
            ></el-image
          ></template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
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
                @click="editBannerHandle(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑表单 -->
      <el-dialog title="请编辑信息" :visible.sync="dialogFormVisible"  top="5vh">
        <el-form :model="form">

          <!-- 标题 -->
          <el-form-item label="标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>

          <!-- 描述 -->
          <el-form-item label="描述">
            <el-input v-model="form.description"></el-input>
          </el-form-item>

          <!-- 中图 & 大图 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="首页中图">
                <Upload v-model="form.midImg"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="首页大图" >
                <Upload v-model="form.bigImg"/>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogForm"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import { getBanner, setBanner } from "@/api/banner.js";
import { server_URL } from "@/urlConfig.js";
import Upload from "@/components/Upload.vue";

export default {
  data() {
    return {
      data: [],
      form: {
        id: '',
        title: '',
        description: '',
        midImg: '',
        bigImg: '',
      },
      dialogFormVisible: false,
    };
  },
  components: {
    Upload,
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getBanner().then((res) => {
        this.data = res.data;
        for (let item of this.data) {
          item.midImg1 = server_URL + item.midImg;
          item.bigImg1 = server_URL + item.bigImg;
        }
      });
    },
    editBannerHandle(bannerInfo) {
      this.form = {...bannerInfo};
      this.dialogFormVisible = true;
    },
    dialogForm() {
      let arr = [...this.data];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === this.form.id) {
          arr[i] = this.form;
        }
      }
      setBanner(arr).then((res) => {
        this.dialogFormVisible = false;
        this.$message({
          message: '修改成功',
          type: 'success'
        });
        this.fetchData();
      })
    }
  },
};
</script>

<style>
</style>