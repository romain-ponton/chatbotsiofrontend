<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import {useRouter} from "vue-router";
const router = useRouter()
</script>


<template>
  <Navbar @home-page="router.push('/')" />
  <RouterView/>
</template>

