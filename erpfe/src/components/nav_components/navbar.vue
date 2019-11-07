<template>
<div>
  <div class="logo_div"> Logo And Login </div>
  <el-menu class="nav_el_menu"
    background-color="#545c64"
text-color="#fff"
active-text-color="#ffd04b"
    @select="handleSelect">
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>导航一</span>
      </template>
      <el-menu-item-group>
        <template slot="title">分组一</template>
        <el-menu-item index="1-1">选项1</el-menu-item>
        <el-menu-item index="1-2">选项2</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="分组2">
        <el-menu-item index="1-3">选项3</el-menu-item>
      </el-menu-item-group>
      <el-submenu index="1-4">
        <template slot="title">选项4</template>
        <el-menu-item index="1-4-1">选项1</el-menu-item>
      </el-submenu>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>导航二</span>
      </template>
      <el-menu-item-group>
        <template slot="title">分组一</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="分组2">
        <el-menu-item index="2-3">选项3</el-menu-item>
      </el-menu-item-group>
      <el-submenu index="2-4">
        <template slot="title">选项4</template>
        <el-menu-item index="2-4-1">选项1</el-menu-item>
      </el-submenu>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>导航三</span>
      </template>
      <el-menu-item-group>
        <template slot="title">分组一</template>
        <el-menu-item index="3-1">选项1</el-menu-item>
        <el-menu-item index="3-2">选项2</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="分组2">
        <el-menu-item index="3-3">选项3</el-menu-item>
      </el-menu-item-group>
      <el-submenu index="3-4">
        <template slot="title">选项4</template>
        <el-menu-item index="3-4-1">选项1</el-menu-item>
      </el-submenu>
    </el-submenu>
    <el-submenu index="4">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>导航四</span>
      </template>
      <el-menu-item-group>
        <template slot="title">分组一</template>
        <el-menu-item index="4-1">选项1</el-menu-item>
        <el-menu-item index="4-2">选项2</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="分组2">
        <el-menu-item index="4-3">选项3</el-menu-item>
      </el-menu-item-group>
      <el-submenu index="4-4">
        <template slot="title">选项4</template>
        <el-menu-item index="4-4-1">选项1</el-menu-item>
      </el-submenu>
    </el-submenu>
  </el-menu>
</div>
</template>

<script>
export default {
  name: 'NavBar',
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style>
.logo_div {
background-color: green;
margin: 20px;
}
.nav_el_menu {
margin-right: -1px;
}
</style>
