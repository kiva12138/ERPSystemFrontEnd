<template>
<div>
  <navhead class="nav_head"/>
  <el-menu class="nav_el_menu"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <div
      v-for="(navitem, index) in navItems"
      v-bind:key='index+""'
    >
    <el-submenu 
      :index='index+""'
      v-if="navitem.submenu.length!==0">
      <template slot="title">
        <i  class="el-icon-s-operation"></i>
        <span>{{navitem.name}}</span>
      </template>
      <el-menu-item
        class="nav_el_sub_menu_item"
        v-for="(navsubitem, indexsub) in navitem.submenu"
        :index="index+'-'+indexsub"
        v-bind:key='indexsub'>
          {{navsubitem}}
      </el-menu-item>
    </el-submenu>
    <el-menu-item
        :index='index+""'
        v-else
      >
      <template slot="title">
        <i  class="el-icon-s-operation"></i>
        <span>{{navitem.name}}</span>
      </template>
      </el-menu-item>
    </div>

    
  </el-menu>
</div>
</template>

<script>

import navhead from './navhead.vue'
import menuData from '../../config/menu.js'

export default {
  name: 'NavBar',
  data () {
    return {
      navItems:menuData
    }
  },
  components: {
    'navhead': navhead
  },
  methods: {
    handleSelect () {
      console.log('Select')
    }
  }
}
</script>

<style>
.nav_head {
margin: 5px;
}
.nav_el_menu {
margin-right: -1px;
}
.nav_el_sub_menu_item {
margin-left: 30px;
}
</style>
