<template>
  <div class="main">
    <menus />
    <inputs />
    <drawer />
    <picshow />
  </div>
</template>

<script>
import menus from "./components/menu.vue";
import drawer from "./components/drawer.vue";
import inputs from "./components/input.vue";
import picshow from "./components/picshow.vue";

export default {
  name: "App",
  components: {
    menus,
    drawer,
    inputs,
    picshow,
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}
.main {
  display: block;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  background-image: url("../src/assets/stardust.png");
  margin: 0;
  padding: 0;
  user-select: none;
  -webkit-user-select: none;
}
</style>
