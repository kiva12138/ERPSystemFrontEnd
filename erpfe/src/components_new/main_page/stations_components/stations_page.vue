<template>
<div>
  <navbar/>
  <router-view/>
</div>
</template>

<script>
import NavBar from '@/components_new/main_page/pathbar_components/pathbarcomp.vue'

export default {
  name: 'StationsPage',
  components: {
    'navbar': NavBar
  }
}
</script>

<style>
</style>
