<script setup lang="ts">


import {onMounted, ref, watch} from "vue";
import {useAuthStore} from "../../../store/authStore.ts";
import {useRoute} from "vue-router";

const routes = useRoute()

const usersRef = ref([])
const searchUsernameRef = ref("");
const currentPageRef = ref(routes.query.page || 1)
const totalPagesRef = ref(0)
const totalUsersRef = ref(0)
const authStore = useAuthStore()


function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement;
  searchUsernameRef.value = target.value;
  getUsers();
}

async  function handleDeleteUser(userId: string) {
  const ok = confirm("Are you sure you want to delete this user?")
  const deleteUserEndpoint = `${import.meta.env.VITE_ADMIN_DELETE_USER}/${userId}/delete`
  if(!ok) return

  const response = await fetch(deleteUserEndpoint, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${authStore.token}` }
  })

  if (!response.ok) {
    alert("ERROR WHEN Deleting USER ");
    return;
  }
  await getUsers();

}




async function getUsers(username: string = searchUsernameRef.value) {
  let getUsersEndPoint: string = import.meta.env.VITE_ADMIN_GET_USERS_LIST;
  let queryParams = `?page=${currentPageRef.value}`;

  if (username) queryParams += `&username=${username}`;
  getUsersEndPoint += queryParams;

  const response = await fetch(getUsersEndPoint, {
    headers: { Authorization: `Bearer ${authStore.token}` }
  });

  if (!response.ok) {
    alert("ERROR WHEN FETCHING USERS LIST");
    return;
  }

  const data = await response.json();
  usersRef.value = data.users;
  totalPagesRef.value = data.totalPages;
  totalUsersRef.value = data.totalUsers;
}


watch(() => routes.query.page, (newPage) => {
  // @ts-ignore
  currentPageRef.value = parseInt(newPage)
 getUsers();
  window.scrollTo({ top: 0, behavior: "smooth" });
})


onMounted(() =>{
  getUsers()

})
</script>

<template>


  <div class="container mx-auto">
    <h1 class="text-center text-4xl my-2">Dashboard admin</h1>

    <h2 class="text-center text-2xl my-2">Numbers of users : {{totalUsersRef}}</h2>
    <input
        type="search"
        class="input input-bordered w-full max-w-x"
        placeholder="Search users"
        @input="handleSearchInput"
    >
    <div class="overflow-x-auto rounded-box border rounded-2xl my-6">
      <table class="table 4">
        <!-- head -->
        <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <!-- row 1 -->
        <tr v-for="user in usersRef">
          <td>
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="mask mask-squircle h-12 w-12">
                  <img v-if="!user.thumbnail"
                      src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                      alt="Default Avatar" />
                  <img v-if="user.thumbnail"
                       :src="`http://localhost:3000/${user.thumbnail}`"
                       alt="user thumbnail" />
                </div>

              </div>
              <div>
                <div class="font-bold">{{user.username}}</div>
              </div>
            </div>
          </td>
          <td>{{user.email}}</td>

          <td>{{user.role}}</td>
          <th v-if="user.role !== 'admin'">
            <button
                @click="handleDeleteUser(user._id)"
                class="btn btn-error btn-outline rounded btn-xs">Delete</button>
          </th>
        </tr>

        </tbody>
      </table>
    </div>
  </div>
<div class="flex justify-center ">
  <div class="join" v-if="totalPagesRef > 1">
    <RouterLink
        v-for="page in totalPagesRef"
        :to="`/admin/dashboard?page=${page}&username=${searchUsernameRef}`"
        class="join-item btn"
        :class="page === currentPageRef ? 'btn-active' : ''">
      {{page}}
    </RouterLink>
  </div>
</div>

</template>

<style scoped>

</style>