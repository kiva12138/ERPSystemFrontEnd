<template>
<div>
  <navbar/>
  <router-view/>
</div>
</template>

<script>
import NavBar from '@/components/pathbarcomponents/pathbarcomp.vue'

export default {
  name: 'EquipmentPage',
  components: {
    'navbar': NavBar
  }
}
</script>

<style>
</style>
