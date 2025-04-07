<script setup lang="ts">


import {ref} from "vue";
import {useRouter} from "vue-router"
import Alert from "../components/Alert.vue";

const router = useRouter()
const usernameInput = ref("")
const emailInput = ref("")
const passwordInput = ref("")

const errorRegisterRef = ref(false)
const  successRegisterRef = ref(false)

async function onSubmit() {

  const data = {
    username : usernameInput.value,
    email : emailInput.value,
    password : passwordInput.value,
  }
 const response =  await fetch( import.meta.env.VITE_REGISTER_ENDPOINT, {
    method : "POST",
    headers : {
      "Content-Type" : "application/json"
    },
    body : JSON.stringify(data)
  })

  if(!response.ok) {
    errorRegisterRef.value = true
    return
  }

  successRegisterRef.value = true
  setTimeout(() => router.push("/login"), 3000 )

}


</script>

<template>
  <Alert v-if="errorRegisterRef" value="Erreur lors de l'inscription" class="alert-error"/>
  <Alert v-if="successRegisterRef" value="Inscription Ok" class="alert-success"/>

  <h1 class="text-4xl text-center">Register page</h1>
  <form class="w-1/2 mx-auto my-48" @submit.prevent="onSubmit">
     <div>
       <label for="username">Username</label>
       <input v-model="usernameInput" id="username" type="text" class="input input-bordered w-full" required />
     </div>

    <div>
      <label for="email">Email</label>
      <input v-model="emailInput" id="email" type="email" class="input input-bordered w-full" required />
    </div>

    <div>
      <label for="password">Password</label>
      <input v-model="passwordInput" id="password" type="password" class="input input-bordered w-full" required />
    </div>

    <button type="submit" class="btn btn-primary my-4">Register</button>
  </form>
</template>

<style scoped>

</style>