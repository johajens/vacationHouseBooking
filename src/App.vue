<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  metaInfo: {
    title: 'Feriefiks',
    titleTemplate: '%s | Feriefiks'
  }
})
</script>
