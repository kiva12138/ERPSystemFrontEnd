<template>
<div>
  <div class="navhead_logo">
    <i class="el-icon-help"></i>
  </div>
  <el-dropdown class="navhead_head">
    <i class="el-icon-user-solid" style="margin-right: 15px" />
    <el-dropdown-menu>
      <ul class="navhead_head_items">
        <li v-for="(navhead_item, index) in navHeadItemsLogin"
            v-bind:key='index'
            v-if="login"
            v-on:click='handleHeadEventClicked(navhead_item)'>
          <el-dropdown-item >{{navhead_item}}</el-dropdown-item>
        </li>
        <li v-for="(navhead_item, index) in navHeadItemsNotLogin"
            v-bind:key='index'
            v-if="!login"
            v-on:click='handleHeadEventClicked(navhead_item)'>
          <el-dropdown-item >{{navhead_item}}</el-dropdown-item>
        </li>
      </ul>
    </el-dropdown-menu>
  </el-dropdown>
</div>
</template>

<script>
export default {
  name: 'NavHead',
  data () {
    return {
      login: false,
      navHeadItemsLogin: ['登出', '修改资料', '修改密码'],
      navHeadItemsNotLogin: ['登录']
    }
  },
  methods: {
    handleHeadEventClicked: function (navheadItem) {
      if (!this.login && navheadItem === '登录') {
        console.log('Log In')
        this.login = true
      } else if (this.login && navheadItem === '登出') {
        console.log('Log Out')
        this.login = false
      } else if (this.login) {
        console.log(navheadItem)
      }
    }
  }
}
</script>

<style>
.navhead_logo {
  display: inline-block;
  font-size: 200%;
  margin-left: 10%;
  margin-right: 40%;
  color: white;
}
.navhead_head {
  display: inline-block;
  font-size: 200%;
  color: white;
}
.navhead_head_items {
  list-style-type:none;
  padding-left: 0px;
  padding-right: 0px;
}
</style>
