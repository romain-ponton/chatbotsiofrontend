<script setup lang="ts">
const props = defineProps(['value', 'class'])
</script>

<template>

  <div role="alert" class="w-1/2 mx-auto alert" :class="props.class">
    <span>{{props.value}}</span>
  </div>
</template>

<style scoped>

</style>