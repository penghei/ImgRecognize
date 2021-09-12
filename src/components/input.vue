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
      ></el-input>
      <el-button
        class="elbutton"
        icon="el-icon-search"
        circle
        @click="picshow(), inputchange(), inputcsschange()"
      >
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "inputs",
  data() {
    return {
      top: 250,
      show:false,
      input:''
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
      var inf = document.getElementById("inputin").value;
      inf = inf.replace(/\s+/g, " ");
      inf = inf.toLowerCase();
      console.log(inf);
      this.input = "";
      inf = inf.replaceAll(",", " ,");
      inf = inf.replaceAll(".", " .");
      inf = inf.replaceAll("!", " !");
      inf = inf.replaceAll(":", " :");
      inf = inf.replaceAll(";", " ;");
      inf = inf.replaceAll("?", " ?");
      inf = inf.replaceAll("&", " &");
      this.InputInf = inf;
    },
    inputcsschange() {
      this.top = 50;
    },
    SendMessTopicshow(){
           this.bus.$emit('inputmess',this.show)
       }
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