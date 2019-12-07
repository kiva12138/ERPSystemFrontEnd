<template>
<div>
  <div class="navhead_logo">
    <i class="el-icon-help"></i>
  </div>
  <el-dropdown class="navhead_head" trigger="hover">
    <i class="el-icon-user-solid" style="margin-right: 15px" />
    <el-dropdown-menu>
      <ul class="navhead_head_items">
        <li v-for="(navhead_item1, index1) in navHeadItemsLogin"
            v-bind:key='index1'
            v-if="login"
            v-on:click='handleHeadEventClicked(navhead_item1)'>
          <el-dropdown-item >{{navhead_item1}}</el-dropdown-item>
        </li>
        <li v-for="(navhead_item2, index2) in navHeadItemsNotLogin"
            v-bind:key='index2'
            v-if="!login"
            v-on:click='handleHeadEventClicked(navhead_item2)'>
          <el-dropdown-item >{{navhead_item2}}</el-dropdown-item>
        </li>
      </ul>
    </el-dropdown-menu>
  </el-dropdown>
  <el-dialog
    class="login_dialog_class"
    title="请输入管理用户以及密码"
    :visible.sync="dialogVisible"
    zIndex="top"
    width="30%">
      <el-row>
        <div class='idtip'>ID：</div>
        <div class='idinput'>
          <el-input placeholder="请输入您的ID"
                  v-model="userid"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='passwordtip'>密码：</div>
        <div class='passwordinput'>
          <el-input placeholder="请输入您的密码"
                  v-model="password"
                  clearable
                  type='password'/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleLogin">登 录</el-button>
      </span>
  </el-dialog>
  <el-dialog
    class="modify_password_dialog_class"
    title="密码修改"
    :visible.sync="modifyDialogVisibe"
    zIndex="top"
    width="30%">
      <el-row>
        <div class='oldpasstip'>旧密码：</div>
        <div class='oldpassinput'>
          <el-input placeholder="请输入您的旧密码"
                  v-model="oldpass"
                  clearable/>
        </div>
      </el-row>
      <el-row>
        <div class='newpasstip'>新密码：</div>
        <div class='newpassinput'>
          <el-input placeholder="请输入您的新密码"
                  v-model="newpass"
                  clearable
                  type='password'/>
        </div>
      </el-row>
      <el-row>
        <div class='newpasstip2'>确认密码：</div>
        <div class='newpassinput2'>
          <el-input placeholder="请确认您的新密码"
                  v-model="newpass2"
                  clearable
                  type='password'/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisibe = false">取 消</el-button>
        <el-button type="primary" @click="handleModifyPassword">修 改</el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: 'NavHead',
  data () {
    return {
      login: false,
      dialogVisible: false,
      modifyDialogVisibe: false,
      userid: '',
      password: '',
      oldpass: '',
      newpass: '',
      newpass2: '',
      navHeadItemsLogin: ['登出', '修改资料', '修改密码'],
      navHeadItemsNotLogin: ['登录']
    }
  },
  methods: {
    handleHeadEventClicked: function (navheadItem) {
      if (!this.$cookies.isKey('login') && navheadItem === '登录') {
        this.dialogVisible = true
      } else if (this.$cookies.isKey('login') && navheadItem === '登出') {
        console.log('Log Out')
        this.$cookies.remove('login')
        this.$cookies.remove('userName')
        location.reload()
      } else if (this.$cookies.isKey('login') && navheadItem === '修改密码') {
        this.modifyDialogVisibe = true
      }
      this.login = this.$cookies.isKey('login')
    },
    handleLogin (done) {
      console.log('Login')
      this.dialogVisible = false
      this.$cookies.set('login', 'true', {expires: '24h'})
      this.$cookies.set('userName', 'Tom', {expires: '24h'})
      location.reload()
    },
    handleModifyPassword (done) {
      console.log('Login')
      this.modifyDialogVisibe = false
      this.$cookies.remove('login')
      this.$cookies.remove('userName')
      location.reload()
    }
  },
  mounted () {
    this.login = this.$cookies.isKey('login')
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
  list-style-type: none;
  padding-left: 0px;
  padding-right: 0px;
}
.idtip {
  display: inline-block;
  text-align: center;
  width: 20%;
  margin-bottom: 10px;
}
.idinput {
  display: inline-block;
  width: 79%;
  margin-bottom: 10px;
}
.passwordtip {
  display: inline-block;
  text-align: center;
  width: 20%;
  margin-top: 10px;
}
.passwordinput {
  display: inline-block;
  width: 79%;
  margin-top: 10px;
}
.newpasstip {
  display: inline-block;
  text-align: center;
  width: 20%;
  margin-top: 10px;
}
.newpassinput {
  display: inline-block;
  width: 79%;
  margin-top: 10px;
}
.newpasstip2 {
  display: inline-block;
  text-align: center;
  width: 20%;
  margin-top: 10px;
}
.newpassinput2 {
  display: inline-block;
  width: 79%;
  margin-top: 10px;
}
.oldpasstip {
  display: inline-block;
  text-align: center;
  width: 20%;
  margin-top: 10px;
}
.oldpassinput {
  display: inline-block;
  width: 79%;
  margin-top: 10px;
}
</style>
