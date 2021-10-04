<template>
  <div>
    <div
      class="input"
      align="center"
      v-bind:style="{ 'padding-top': top + 'px' }"
    >
      <el-input
        type="text"
        placeholder="请输入"
        id="inputin"
        v-model="input"
        ref="elInput"
      ></el-input>
      <el-button
        class="elbutton"
        icon="el-icon-search"
        circle
        @click="inputchange()"
      >
      </el-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "inputs",
  data() {
    return {
      top: 250,
      show: false,
      input: "",
      InputInf: "",
      captions: [],
      ifFile: false,
      ifFindFile: false,
      ifButton: false
    };
  },
  methods: {
    picshow() {
      if (this.show == true) {
        return;
      } else {
        this.show = !this.show;
      }
      this.SendMessTopicshow();
    },
    inputchange() {
      var inf = this.$refs.elInput.value;
      if (inf == "") {
        this.$message({
          type: "error",
          message: "请先输入，不能为空",
        });
        this.show = false;
        return;
      } else if (!this.ifFile) {
        this.$message({
          type: "warning",
          message: "还没有上传图片，请先上传",
        });
        return;
      }

      inf = inf.replace(/\s+/g, " ");
      inf = inf.toLowerCase();
      this.input = "";
      inf = inf.replaceAll(",", " ,");
      inf = inf.replaceAll(".", " .");
      inf = inf.replaceAll("!", " !");
      inf = inf.replaceAll(":", " :");
      inf = inf.replaceAll(";", " ;");
      inf = inf.replaceAll("?", " ?");
      inf = inf.replaceAll("&", " &");
      this.InputInf = inf;
      this.ifButton = true;
      this.picshow();
      this.inputcsschange();
      this.Gettextcaption();
    },
    inputcsschange() {
      this.top = 50;
    },
    Gettextcaption() {
      var url =
        "http://localhost:8000/get_text_caption?query=" +
        this.InputInf.toString();
      axios
        .get(url)
        .then((response) => response.data.data)
        .then((data) => {
          this.captions = [];
          for (var i = 0; i < data.length; i++) {
            this.captions.push(data[i]);
          }
          this.SendMessTodrawer();
        })
        .catch((error) => {
          this.$message.error("上传错误 重试一下试试？");
          console.log(error);
        });
    },

    SendMessTopicshow() {
      this.bus.$emit("inputmess", [this.show, this.ifButton]);
    },
    SendMessTodrawer() {
      this.bus.$emit("sentenceCaption", this.captions);
    },
  },
  mounted() {
    this.bus.$on("ifFile", (data) => {
      //来自drawer
      this.ifFile = data;
    });
    this.bus.$on("ifFindFile", (data) => {
      //来自picshow
      this.ifFindFile = data;
    });
  },
};
</script>

<style>
.el-input {
  position: relative;
  width: 50%;
  line-height: 5%;
}

.input {
  position: relative;
}
.el-input__inner {
  border: 2px solid black;
  height: 45px;
  background-color: rgb(96, 96, 97);
  font-size: larger;
  color: black;
}
.el-input__inner:active {
  border: 2px solid gold;
}

.el-input__inner::-webkit-input-placeholder {
  font-size: larger;
  color: black;
}

.elbutton {
  border: 2px solid black;
  background-color: gold;
  font-weight: bolder;
  color: black;
}
.elbutton:hover {
  background-color: gold;
}
.elbutton:active {
  background-color: gold;
}
</style>