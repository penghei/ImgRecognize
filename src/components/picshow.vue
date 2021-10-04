<template>
  <div>
    <div class="pic" v-if="show">
      <div align="center">
        <el-image
          v-for="(imgSrc, index) in imgs"
          class="imgpreview"
          :key="index"
          :src="imgSrc"
          :style="{ width: picwidth + 'px', height: picwidth + 'px' }"
          :preview-src-list="imgs"
        ></el-image>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  name: "picshow",
  data() {
    return {
      show: false,
      imgs: [],
      urls: [],
      srcList: [],
      picwidth: 200,
    };
  },
  methods: {
    getImgEncoded() {
      ipcRenderer.removeAllListeners("getImg");
      ipcRenderer.send(
        "imgEncoding",
        this.urls.map((e) => ({
          name: "dummy",
          url: e,
        }))
      );
      ipcRenderer.on("getImg", (event, result) => {
        this.imgs = result.map((e) => e.url);
      });
    },
    getPicNum() {
      let picnum = this.urls.length;
      switch (picnum) {
        case 0:
          break;
        case 1:
          this.picwidth = 800;
          break;
        case 2:
          this.picwidth = 400;
          break;
        case 3:
          this.picwidth = 300;
          break;
        default:
          this.picwidth = 200;
          break;
      }
    },
    geturls() {
      if (
        this.urls.length == 0 &&
        this.srcList.length == 0 &&
        this.imgs.length == 0
      ) {
        if (
          document.getElementsByClassName("el-message--warning").length === 0
        ) {
          this.$message({
            type: "warning",
            message: "没有搜到哦",
          });
        }
      }
    },
  },
  mounted() {
    this.bus.$on("inputmess", (data) => {
      this.show = data[0];
    });
    this.bus.$on("resultPicUrls", (resulturls) => {
      this.imgs = [];
      this.urls = [];
      this.srcList = [];
      //插入渲染数组
      for (let i = 0; i < resulturls.length; i++) {
        this.urls.push(resulturls[i]);
        this.srcList.push(resulturls[i]);
      }
      this.getImgEncoded();
      this.geturls();
      this.getPicNum();
    });
  },
};
</script>

<style>
.pic {
  padding-top: 50px;
  width: 100%;
  height: 80%;
  overflow-y: scroll;
}
.pic::-webkit-scrollbar {
  width: 0.75rem;
  height: 0.75rem;
  background-color: #302e2e;
}

.pic::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0.375rem #999;
  border-radius: 0.625rem;
  background-color: rgb(32, 32, 32);
}

.pic::-webkit-scrollbar-thumb {
  border-radius: 0.625rem;
  box-shadow: inset 0 0 0.375rem #999;
  background-color: #333;
}
</style>
