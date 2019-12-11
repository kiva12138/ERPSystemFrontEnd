<template>
<div>
  <pathbar />
  <router-view></router-view>
</div>
</template>

<script>
import PathBar from '@/components_new/main_page/pathbar_components/pathbarcomp.vue'

export default {
  name: 'MaterialPage',
  components: {
    'pathbar': PathBar
  }
}
</script>

<style>
</style>
