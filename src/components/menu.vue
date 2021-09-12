<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      style="position: sticky"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="1" style="font-size: larger"
        >首页
      </el-menu-item>
      <el-menu-item index="2" @click="Beginuse" style="font-size: larger"
        >开始使用
      </el-menu-item>
      <el-menu-item
        index="3"
        @click="dialogTableVisible = true"
        style="font-size: larger"
        >关于我们
      </el-menu-item>
      <el-menu-item
        index="4"
        @click="open()"
        type="primary"
        style="font-size: larger; color: goldenrod"
      >
        点我刷新</el-menu-item
      >
    </el-menu>
    <div>
      <el-dialog
        title="关于我们"
        :visible.sync="dialogTableVisible"
        :append-to-body="true"
      >
        <div align="center" style="text-align: center; height: 200px">
          <p style="font-size: 25px; color: rgb(163, 140, 6)">
            @微光大创李家豪项目小组
          </p>
          <span class="demonstration" style="padding: 10px; font-size: larger"
            >打个分吧</span
          >
          <el-rate
            v-model="value2"
            :colors="colors"
            style="margin: 10px"
            @change="scoreChange()"
          >
          </el-rate>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "menus",
  data() {
    return {
      drawer: false,
      activeIndex: "2",
      dialogTableVisible: false,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      value2:null,
    };
  },
  methods: {
    Beginuse() {
      this.drawer = !this.drawer;
      this.SendMessTodrawer();
    },
    open() {
      this.$confirm("是否重新打开该页面？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "刷新成功",
          });
          //this.RestartPage();
        })
        .catch(() => {});
    },
    scoreChange() {
      this.$message("收到你的反馈");
    },
    SendMessTodrawer() {
      this.bus.$emit("drawermess", this.drawer);
    },
  },
};
</script>


<style>
.el-menu-item:hover {
  background-color: rgb(36, 35, 35);
}

.el-menu {
  background-color: rgb(8, 8, 8);
  padding: 0;
  margin: 0;
}
</style>
