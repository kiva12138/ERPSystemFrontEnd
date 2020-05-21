<template>
<div>
  <div class="navhead_logo">
    <i class="el-icon-s-opportunity"/>
  </div>
  <el-dropdown class="navhead_head" trigger="hover">
    <i class="el-icon-user-solid" style="margin-right: 15px; cursor: pointer"/>
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
    :modal="false"
    width="30%">
      <el-row>
        <div class='idtip'>名称：</div>
        <div class='idinput'>
          <el-input placeholder="请输入您的用户名"
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
    :modal="false"
    width="30%">
      <el-row>
        <div class='oldpasstip'>旧密码：</div>
        <div class='oldpassinput'>
          <el-input placeholder="请输入您的旧密码"
                  v-model="oldpass"
                  type='password'
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
        <el-button type="primary" @click="handleModifyPassword"
          :disabled="modifyPassDisable">修 改</el-button>
      </span>
  </el-dialog>
  <el-dialog
    class="modify_password_dialog_class"
    title="资料修改"
    :visible.sync="modifyNameDialogVisibe"
    :modal="false"
    width="30%">
      <el-row>
        <div class='newpasstip2'>新用户名：</div>
        <div class='newpassinput2'>
          <el-input placeholder="请输入新的用户名"
                  v-model="newname"
                  clearable/>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyNameDialogVisibe = false">取 消</el-button>
        <el-button type="primary" @click="handleModifyName"
          :disabled="modifyNameDisable">修 改</el-button>
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
      modifyNameDialogVisibe: false,
      userid: '',
      password: '',
      oldpass: '',
      newpass: '',
      newpass2: '',
      newname: '',
      navHeadItemsLogin: ['登出', '修改资料', '修改密码'],
      navHeadItemsNotLogin: ['登录']
    }
  },
  methods: {
    handleHeadEventClicked: function (navheadItem) {
      if (!this.$cookies.isKey('login') && navheadItem === '登录') {
        this.dialogVisible = true
      } else if (this.$cookies.isKey('login') && navheadItem === '登出') {
        this.$axios({
          method: 'post',
          url: this.GLOBAL.backEndIp + '/logout'
        }).then(response => {
          this.$notify.success({
            title: '成功退出',
            message: '如需操作需要进行登录。'
          })
        }).catch(error => {
          console.log(error)
          this.$message({
            message: '退出失败，请刷新页面',
            type: 'error'
          })
        })
        this.$cookies.remove('login')
        this.$cookies.remove('userName')
        this.$cookies.remove('userid')
        location.reload()
      } else if (this.$cookies.isKey('login') && navheadItem === '修改密码') {
        this.modifyDialogVisibe = true
      } else if (this.$cookies.isKey('login') && navheadItem === '修改资料') {
        this.modifyNameDialogVisibe = true
      }
      this.login = this.$cookies.isKey('login')
    },
    handleLogin (done) {
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/login',
        params: {
          name: this.userid,
          password: this.password
        }
      }).then(response => {
        if (response.data.status === 200) {
          this.dialogVisible = false
          this.$cookies.set('login', 'true', {expires: '1h'})
          this.$cookies.set('userName', this.userid, {expires: '1h'})
          this.$cookies.set('userid', response.data.userid, {expires: '1h'})
          location.reload()
          this.$notify.success({
            title: '登录成功',
            message: '您可以进行系统管理了。'
          })
        } else {
          this.$message({
            message: '登录失败，请检查用户名与密码。错误码-' + response.data.status,
            type: 'warning'
          })
        }
      }).catch(error => {
        this.$message({
          message: '登录失败，请检查用户名与密码。错误码-' + error.response.data.status,
          type: 'error'
        })
      })
    },
    handleModifyPassword (done) {
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/api/user/updatepassword',
        params: {
          id: this.$cookies.get('userid'),
          password: this.newpass
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.$notify.success({
            title: '修改成功',
            message: '您需要再次登录才能进行管理。'
          })
        } else {
          this.$message({
            message: '修改失败。错误码-' + response.data.code,
            type: 'warning'
          })
        }
      }).catch(error => {
        console.log(error)
        this.$message({
          message: '退出失败，请刷新页面',
          type: 'error'
        })
      })
      this.modifyDialogVisibe = false
      this.$cookies.remove('login')
      this.$cookies.remove('userName')
      this.$cookies.remove('userid')
      location.reload()
    },
    handleModifyName (done) {
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/api/user/updatename',
        params: {
          id: this.$cookies.get('userid'),
          name: this.newname
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.$notify.success({
            title: '修改成功',
            message: '您需要再次登录才能进行管理。'
          })
        } else {
          this.$message({
            message: '修改失败。错误码-' + response.data.code,
            type: 'warning'
          })
        }
      }).catch(error => {
        console.log(error)
        this.$message({
          message: '退出失败，请刷新页面',
          type: 'error'
        })
      })
      this.modifyNameDialogVisibe = false
      this.$cookies.remove('login')
      this.$cookies.remove('userName')
      this.$cookies.remove('userid')
      location.reload()
    }
  },
  mounted () {
    this.login = this.$cookies.isKey('login')
  },
  computed: {
    modifyNameDisable () {
      return this.newname === ''
    },
    modifyPassDisable () {
      return this.oldpass === '' || this.newpass === '' || this.newpass !== this.newpass2
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
