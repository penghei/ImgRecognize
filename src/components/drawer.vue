<template>
  <div>
    <el-drawer
      :visible.sync="ifdrawer"
      :with-header="true"
      :direction="direction"
      class="eldrawer"
      :append-to-body="true"
    >
      <div id="beginuse" align="center">
        <el-upload
          class="upload-demo"
          ref="upload"
          action=""
          :on-preview="handlePreview"
          :on-change="onUploadChange"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          :on-success="uploadsuccess"
          :on-error="uploadfail"
          multiple
          list-type="picture"
        >
          <el-button
            slot="trigger"
            size="big"
            type="primary"
            @click="filesNumCount"
            class="uploadbtn1"
            >选取文件</el-button
          >
          <el-button
            style="margin-left: 10px"
            size="big"
            type="success"
            class="uploadbtn2"
            @click="submitUpload"
            >上传
          </el-button>
          <div slot="tip" class="el-upload__tip" style="padding: 5px">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </div>
    </el-drawer>
  </div>
</template>

<script>
//import fs from "fs/promises";
//import { constants } from "fs";

//const PATH = "./db.json";
var imgs = [];

export default {
  name: "drawer",
  data() {
    return {
      ifdrawer: false,
      direction: "ltr",
      fileList: [],
      localFile: "",
      ifupload: true,
      caption:[]
    };
  },
  methods: {
    submitUpload() {
      
    },
    handleRemove() {},
    handlePreview(file) {
      console.log(file);
    },

    onUploadChange(file){
        //上传校验
        const isIMAGE = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png');
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isIMAGE) {
            this.$message.error('只能上传jpg/png图片!');
            return false;
        }
        if (!isLt1M) {
            this.$message.error('上传文件大小不能超过 1MB!');
            return false;
        }
        //上传
        const formData = new FormData();
        formData.append("image", file);
      
      axios
        .post("http://localhost:7999/get_image_caption", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((data) => this.caption.push(data.data.toString()));//存入前端临时的caption数组里
        this.add(/*file.path,*/this.caption.pop());
    },

    uploadsuccess() {
      //console.log(response.path);
      //this.ImgPath = response.path;
      this.$alert("您的图片已上传", "上传成功！", {
        confirmButtonText: "确定",
        /*callback: action => {
                    this.$message({
                        type: 'info',
                        message: `action: ${action}`
                    });
                }*/
      });
    },
    uploadfail() {
      //console.log(response.path);
      //this.ImgPath = response.path;
      if (this.ifupload) {
        this.$alert("图片上传失败，请检查您的图片是否符合要求", "上传失败！", {
          confirmButtonText: "确定",
          /* callback: action => {
                            this.$message({
                                type: 'info',
                                message: `action: ${action}`
                            });
                        }*/
        });
        this.ifupload = false;
      }
    },
    filesNumCount() {
      this.FilesNum++;
    },
    imgsavepath(file) {
      this.localFile = file.raw;
    },
    //异步开始
    async init() {
      try {
        await fs.access(PATH, constants.F_OK);
        const data = await fs.readFile(PATH);
        imgs = JSON.parse(data);
      } catch {
        await fs.writeFile(PATH, JSON.stringify(imgs));
      }
    },
    async save() {
      await fs.writeFile(PATH, JSON.stringify(imgs));
    },

    async add(path, caption) {
      imgs.push({ path, caption });
      await save();
    },
    async remove(path) {
      imgs = imgs.filter((img) => !(img.path === path));
      await save();
    },
  },
  mounted() {
    this.bus.$on("drawermess", (data) => {
      this.ifdrawer = data;
    });
  },
};
</script>

<style>
.el-drawer {
  background-color: rgb(77, 76, 76);
}
.uploadbtn1,
.uploadbtn2 {
  color: gold;
  font-size: larger;
  background-color: black;
  border: rgb(44, 44, 44);
}
.uploadbtn1:hover,
.uploadbtn2:hover {
  background-color: rgb(38, 38, 39);
  border: black;
}
.el-upload__tip {
  color: whitesmoke;
  font-size: 20px;
}
#beginuse {
  padding-left: 5px;
  padding-right: 5px;
}
</style>