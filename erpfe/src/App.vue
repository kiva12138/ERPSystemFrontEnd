<template>
  <div class='app_class'>

    <div class='navbar_class'>
      <navbar/>
    </div>

    <keep-alive>
      <router-view class='router_view_class'/>
    </keep-alive>

  </div>
</template>

<script>

import navbar from './components_new/nav_components/navbar.vue'

export default {
  name: 'App',
  components: {
    'navbar': navbar
  },
  watch: {
    '$route' (to, from) {
    }
  }
}

</script>

<style>
body{
  margin: 0px;
}
.navbar_class {
  width: 15%;
  height: 100%;
  position: fixed;
  display: inline-block;
  background-color: #545c64;
  overflow-x: hidden;
  overflow-y: auto;
  vertical-align: top;
  z-index: 10;
}
.router_view_class {
  margin-left: 15%;
  width: 84%;
  height: 100%;
  position: fixed;
  overflow-y: auto;
  overflow-x: auto;
  background-color: #F2F6FC;
  display: inline-block;
  vertical-align: top;
  z-index: 1;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #F2F6FC;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #E4E7ED;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #C0C4CC;
}
</style>
