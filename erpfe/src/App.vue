<template>
  <div class='app_class'>

    <div class='navbar_class'>
      <navbar/>
    </div>

    <router-view class='router_view_class'/>

  </div>
</template>

<script>

import navbar from './components/nav_components/navbar.vue'

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
}
.router_view_class {
  margin-left: 15%;
  width: 84%;
  height: 100%;
  position: fixed;
  background-color: #F2F6FC;
  display: inline-block;
  vertical-align: top;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #566573;
}

::-webkit-scrollbar-track {
  border-radius:10px;
  background-color:#566573;
}

::-webkit-scrollbar-thumb {
  border-radius:10px;
  background-color: #273746;
}
</style>
