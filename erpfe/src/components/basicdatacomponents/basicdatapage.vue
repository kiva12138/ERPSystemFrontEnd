<template>
<div>
  <pathbar />
  <router-view></router-view>
</div>
</template>

<script>
import PathBar from '@/components/pathbarcomponents/pathbarcomp.vue'

export default {
  name: 'BasicDataPage',
  components: {
    'pathbar': PathBar
  }
}
</script>

<style>
</style>
