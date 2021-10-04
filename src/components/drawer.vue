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
        <el-button type="primary" @click="openFile" round class="uploadbtn1"
          >选择文件</el-button
        >
        <el-button type="success" @click="addToList" round class="uploadbtn2"
          >添加至列表</el-button
        >
        <input
          type="file"
          name="filename"
          id="open"
          style="display: none"
          multiple
        />
        <el-upload
          class="upload-demo"
          action="#"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="uploadsuccess"
          :on-error="uploadfail"
          :file-list="fileToBase"
          list-type="picture"
          :auto-upload="false"
        >
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </div>
    </el-drawer>
  </div>
</template>

<script>
var similarity = require("compute-cosine-similarity");
import { ipcRenderer } from "electron";
import axios from "axios";

export default {
  name: "drawer",
  data() {
    return {
      ifdrawer: false,
      direction: "ltr",
      localFile: "",
      ifupload: true,
      captions: [], //对象数组，captions[i].data才是128位数组
      sentenceCaptions: [], //正常128位数组
      fileDetails: [],
      fileToBase: [], //文件列表
      key: 0,
      opened: false,

      vectorlength1: 0, //计算用数据，每次计算都会刷新
      vectorlength2: 0,
      vectormutiply: 0,
      vectorresult: 0,

      ComputedResults: [], //一次搜索所有比较结果值
      targetfiles: [], //一次搜索选中图片数组，内容为
      conformedfiles: [], //一个没啥用的中间数组
      resultPicUrls: [], //搜索结果图片路径
    };
  },
  methods: {
    openFile() {
      //打开选择文件框
      var inputele = document.getElementById("open");
      inputele.click();
      //inputele.addEventListener('click',this.addToList)
      this.opened = true;
    },
    addToList() {
      //显示选择列表并上传
      if (this.opened) {
        const formData = new FormData();
        var inputele = document.getElementById("open");

        for (var i = 0; i < inputele.files.length; i++) {
          var fileObject = {
            key: this.key,
            name: inputele.files[i].name,
            url: inputele.files[i].path,
          };
          this.fileDetails.push(fileObject);
          this.bus.$emit("ifFile", true);//上传文件了就不会再提示没有上传  发给input
          formData.append("images", inputele.files[i]);
          this.key++;
        }
        this.picListToBase();
        this.submitUpload(formData);
        this.opened = false;
      } else {
        this.$message({
          message: "还没有选择文件哦",
          type: "warning",
        });
      }
    },
    picListToBase() {
      ipcRenderer.removeAllListeners("getImg")
      ipcRenderer.send("imgEncoding", this.fileDetails.map(f => ({
        name: f.name,
        url: f.url
      })))
      ipcRenderer.on("getImg", (_, result) => {
        this.fileToBase = result
      })
    },
    submitUpload(FormData) {
      //上传并获取返回值
      this.$message("请等待成功后再上传其他图片");
      axios
        .post("http://localhost:8000/get_image_caption", FormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => response.data)
        .then((data) => {
          for (var i = 0; i < data.data.length; i++) {
            this.captions.push(data.data[i]); //把data直接push进去，形式就是data对象的数组
          }
          this.uploadsuccess();
          this.handleAdd();
        })
        .catch((error) => {
          this.uploadfail();
          console.log(error);
        });
    },
    handleAdd() {
      // this.add(this.captions[i].name, this.captions[i].caption); //根据图片名称加入标注信息
      var arr = new Array();
      for (var i = 0; i < this.captions.length; i++) {
        arr.push(
          this.fileDetails.find(
            (fileObject) => fileObject.name == this.captions[i].name
          )
        );
        var path = arr[i].url;
        var caption = this.captions[i].caption;
        ipcRenderer.send("addImage", {
          name: this.captions[i].name,
          path: path,
          caption: caption,
        });
      }
    },
    handleRemove(file) {
      //按照名称删除数组中的元素
      var Filename = file.name.toString();
      let File = this.fileDetails.find(
        (fileObject) => fileObject.name === Filename
      );
      var capindex;
      for (let i = 0; i < this.captions.length; i++) {
        if (File.name == this.captions[i].name) {
          capindex = i;
        }
      }
      this.captions.splice(capindex, 1);
      var index = this.fileDetails.indexOf(File);
      var imgpath = File.url;
      this.fileDetails.splice(index, 1);
      ipcRenderer.send("removeImage", { path: imgpath });
    },
    handlePreview() {},

    //响应
    uploadsuccess() {
      this.$alert("您的图片已上传", "上传成功！", {
        confirmButtonText: "确定",
      });
    },
    uploadfail() {
      if (this.ifupload) {
        this.$alert("图片上传失败，请检查您的图片是否符合要求", "上传失败！", {
          confirmButtonText: "确定",
        });
        this.ifupload = false;
      }
    },
    //最终筛选
    OnceSearchResultCompare() {
      this.resultPicUrls = []
      for (let i = 0; i < this.ComputedResults.length; i++) {
        //computedresults数组是原先上传文件的顺序 所以可以按照这个原来的顺序直接选出文件
        if (this.ComputedResults[i].data >= 0.63) {
          let imgname = this.ComputedResults[i].name;
          let imgObject = this.fileDetails.find(
            (Object) => Object.name == imgname
          );
          ipcRenderer.send("findImage", imgObject.url);
          this.resultPicUrls.push(imgObject.url);
        }
      }
      this.SendMessTopicshow();
    },
    SendMessTopicshow() {
      //把图片信息发过去
      this.bus.$emit("resultPicUrls", this.resultPicUrls);
    },
    similaritycompute() {
      this.ComputedResults = [];
      this.captions.forEach((caption) => {
        let result = similarity(caption.caption[0], this.sentenceCaptions);
        this.ComputedResults.push({
          data: result,
          name: caption.name,
        });
      });
      this.OnceSearchResultCompare();
    },
  },

  mounted() {
    //传数据
    this.bus.$on("drawermess", (data) => {
      this.ifdrawer = data;
    });
    this.bus.$on("sentenceCaption", (data) => {
      this.sentenceCaptions = [...data[0]];
      this.similaritycompute();
    });
  },
  created() {
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
