<template>
<div class='login_text_class'>
  {{displayText}}
</div>
</template>

<script>
export default {
  name: 'LoginPage',
  data () {
    return {
      loginText: '欢迎 ',
      notLoginText: '请先点击左侧导航栏登录',
      userName: '',
      displayText: ''
    }
  },
  mounted () {
    if (this.$cookies.isKey('login')) {
      this.userName = this.$cookies.get('userName')
      this.displayText = this.loginText + this.userName
    } else {
      this.displayText = this.notLoginText
    }
  }
}
</script>

<style>
.login_text_class {
  color: #606266;
  text-align: center;
  font-size: 200%;
  padding-top: 20%;
}
</style>
