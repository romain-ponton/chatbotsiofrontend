<script setup lang="ts">

  import {ref} from "vue";
  import {useAuthStore} from "../../store/authStore.ts";
  import Alert from "../components/Alert.vue";
  import {useUserStore} from "../../store/userStore.ts";
  const newUserNameRef = ref("")

  const oldPasswordRef =ref("")
  const newPasswordRef= ref("")
  const newThumbnailRef = ref("")

  const authStore = useAuthStore()
  const userStore = useUserStore()


  const errorUpdateUsernameRef = ref(false)
  const successUpdateUsernameRef = ref(false)
  const errorUpdatePasswordRef =ref(false)
  const successUpdatePasswordRef =ref(false)
  const errorUpdateThumbnailRef = ref(false)
  const successUpdateThumbnailRef = ref(false)


  const onSubmitNewUserName = async () => {
    const response = await  fetch(import.meta.env.VITE_UPDATE_USERNAME, {
      method : "PUT",
      headers : {"Content-Type" : "application/json", Authorization: `Bearer ${authStore.token}`},
      body : JSON.stringify({newUsername : newUserNameRef.value})
    })

    if (!response.ok) {
      errorUpdateUsernameRef.value = true;
      setTimeout(() => {
        errorUpdateUsernameRef.value = false
      }, 3000)
      return
    }
    successUpdateUsernameRef.value = true
    const data= await response.json()
    userStore.setUsername(data.username)
    setTimeout(() => {
      successUpdateUsernameRef.value = false
    }, 3000)
  }


  const onSubmitNewPassword = async () => {

    const response = await  fetch(import.meta.env.VITE_UPDATE_PASSWORD, {
      method : "PUT",
      headers : {"Content-Type" : "application/json", Authorization: `Bearer ${authStore.token}`},
      body : JSON.stringify({oldPassword : oldPasswordRef.value, newPassword: newPasswordRef.value})
    })

    if (!response.ok) {
      errorUpdatePasswordRef.value = true;

      setTimeout(() => {
        errorUpdatePasswordRef.value = false
      }, 3000)
      return
    }
    successUpdatePasswordRef.value = true
    setTimeout(() => {
      successUpdatePasswordRef.value = false
    }, 3000)
  }



  const onChangeThumbnail = (event : Event) => {
    // @ts-ignore
    newThumbnailRef.value = event.target.files[0]
  }

  const onSubmitNewThumbnail = async () => {
    const formData = new FormData()
    formData.append("image", newThumbnailRef.value)

    const response = await  fetch(import.meta.env.VITE_UPDATE_THUMBNAIL, {
      method : "PUT",
      headers : {Authorization: `Bearer ${authStore.token}`},
      body : formData
    })


    if (!response.ok) {
      errorUpdateThumbnailRef.value = true;
      setTimeout(() => {
        errorUpdateThumbnailRef.value = false
      }, 3000)
      return
    }
    const data = await response.json()

    userStore.setThumbnail(import.meta.env.VITE_BASE_URL + '/' +  data.thumbnail)
    successUpdateThumbnailRef.value = true
    setTimeout(() => {
      successUpdateThumbnailRef.value = false
    }, 3000)
  }



</script>

<template>
  <Alert v-if="errorUpdateUsernameRef" value="Erreur lors de la mise à jour de votre nom d'utilisateur" class="alert-error"/>
  <Alert v-if="successUpdateUsernameRef" value="Mise à jour de votre nom d'utilisateur validé" class="alert-success"/>

  <Alert v-if="errorUpdatePasswordRef" value="Erreur lors de la mise à jour de votre mot de passe" class="alert-error"/>
  <Alert v-if="successUpdatePasswordRef" value="Mise à jour de votre mot de passe est  validé" class="alert-success"/>

  <Alert v-if="errorUpdateThumbnailRef" value="Erreur lors de la mise à jour de la photo de profile" class="alert-error"/>
  <Alert v-if="successUpdateThumbnailRef" value="Mise à jour de votre mot de la photo de profile validé" class="alert-success"/>

  <h1 class="text-center text-4xl my-2">Page de profile</h1>

  <div class="w-1/3 mx-auto bordered rounded-2xl p-6 bg-error">
    <h2 class="text-center">Update username</h2>
    <form class="mx-auto" @submit.prevent="onSubmitNewUserName">
      <div>
        <label for="username">Username</label>
        <input v-model="newUserNameRef" id="username" type="text" class="input input-bordered w-full" required />
      </div>
      <button type="submit" class="btn btn-warning my-4">Update</button>
    </form>
  </div>




  <div class="my-6 w-1/3 mx-auto bordered rounded-2xl p-6 bg-error">
    <h2 class="text-center">Update password</h2>
    <form class="mx-auto" @submit.prevent="onSubmitNewPassword">
      <div>
        <label for="old-password">Old Password</label>
        <input v-model="oldPasswordRef" id="old-password" type="password" class="input input-bordered w-full" required minlength="6" />
      </div>

      <div>
        <label for="new-password">New Password</label>
        <input v-model="newPasswordRef" id="new-password" type="password" class="input input-bordered w-full" required min="6" />
      </div>
      <button type="submit" class="btn btn-warning my-4">Update</button>
    </form>
  </div>





  <div class="my-6 w-1/3 mx-auto bordered rounded-2xl p-6 bg-error">
    <h2 class="text-center">Update thumbnail</h2>
    <form class="mx-auto" @submit.prevent="onSubmitNewThumbnail">
      <div>
        <label for="thumbnail">Thumbnail</label>
        <input @change="onChangeThumbnail" id="thumbnail" type="file" class="file-input file-input-bordered w-full"  required/>
      </div>
      <button type="submit" class="btn btn-warning my-4">Update</button>
    </form>
  </div>



</template>

<style scoped>

</style>