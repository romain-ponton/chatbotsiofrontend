<script setup lang="ts">

import {ref} from "vue";
import {useRouter} from "vue-router"
import Alert from "../components/Alert.vue";
import {useAuthStore} from "../../store/authStore.ts";

const router = useRouter()
const authStore = useAuthStore()
const errorLoginRef = ref(false)
const emailRef = ref("")
const passwordRef = ref("")


async function onSubmit () {
  const data = {
    email : emailRef.value,
    password : passwordRef.value
  }

  const response = await  fetch(import.meta.env.VITE_LOGIN_ENDPOINT, {
    method : "POST",
    headers : {"Content-Type" : "application/json"},
    body : JSON.stringify(data)
  })

  if(!response.ok) {
    errorLoginRef.value = true
    return
  }
  const resData = await  response.json()
  authStore.setToken(resData.token)
  authStore.decodeJwt()
  const user = authStore.decodeJwt()!
  if(user.role === "admin") {
    await router.push("/admin/dashboard")
  }
  else {
    await router.push("/")
  }


}

</script>

<template>
  <Alert v-if="errorLoginRef" class="alert-error" value="Erreur lors de la connexion"/>
  <h1 class="text-4xl text-center">Login page</h1>
  <form class="w-1/2 mx-auto my-48" @submit.prevent="onSubmit">
    <div>
      <label for="email">Email</label>
      <input v-model="emailRef" id="email" type="email" class="input input-bordered w-full" required />
    </div>

    <div>
      <label for="password">Password</label>
      <input v-model="passwordRef" id="password" type="password" class="input input-bordered w-full"  required/>
    </div>

    <button type="submit" class="btn btn-primary my-4">Login</button>
  </form>

</template>

<style scoped>

</style>