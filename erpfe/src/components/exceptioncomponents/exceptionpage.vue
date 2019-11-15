<template>
<div>
  <navbar/>
  <router-view/>
</div>
</template>

<script>
import NavBar from '@/components/pathbarcomponents/pathbarcomp.vue'

export default {
  name: 'ExceptionPage',
  components: {
    'navbar': NavBar
  }
}
</script>

<style>
</style>
