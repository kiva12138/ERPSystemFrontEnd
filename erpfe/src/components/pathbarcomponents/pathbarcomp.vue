<template>
<div class='path_bar_class'>
  <h3>{{displayText}}</h3>
</div>
</template>

<script>
import menuData from '../../config/menu.js'

export default {
  name: 'PathBarComponent',
  data () {
    return {
      displayText: '',
      navItems: menuData
    }
  },
  methods: {
    getPath () {
      this.displayText = '您的位置：'
      this.displayText += this.navItems[this.$cookies.get('path1')].name
      if (this.$cookies.get('path2') + '' !== 'undefined') {
        this.displayText += '>'
        this.displayText += this.navItems[this.$cookies.get('path1')].submenu[this.$cookies.get('path2')].name
      }
    }
  },
  mounted () {
    this.getPath()
  },
  watch: {
    '$route' (to) {
      this.getPath()
    }
  }
}
</script>

<style>
.path_bar_class {
  color: #606266;
  padding: 5px;
}
</style>
