<script setup lang="ts">


import {computed, ref, onMounted, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

import {useAuthStore} from "../../store/authStore.ts";
import {useModelStore} from "../../store/modelStore.ts";
import Alert from "../components/Alert.vue";
import {marked} from "../utils/marked.ts";
import type {History, Message} from "../types";
import {useUserStore} from "../../store/userStore.ts";


const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const modelStore = useModelStore()
const userStore = useUserStore()

const disableSubmitButton = ref(false)
const userInput = ref("")
const messages = ref<Message[]>([])
const chatId = ref("")
const errorChat = ref(false)
const chatHistories = ref<History[]>([])
const chatContainerRef = ref<HTMLElement|null>(null)




const onChatAdd = () => {
  messages.value = []
  router.push("/")
}


const onDeleteChat = async (id : string) => {
  const ok = confirm("etes vous sur de vouloir supprimer le chat")
  if(!ok) return

  const response = await fetch(import.meta.env.VITE_DELETE_CHAT_ENDPOINT+`/${id}` ,{
    method: "DELETE",
    headers: {Authorization: `Bearer ${authStore.token}`},
  })
  if(!response.ok) return alert("erreur suppression du chat")
  chatHistories.value = chatHistories.value.filter(history => history._id !== id)
  await router.push("/")
  messages.value = []

}

const getLastChat = async () => {
  const response = await fetch(import.meta.env.VITE_LAST_CHAT_ENDPOINT,{
    headers: {Authorization: `Bearer ${authStore.token}`},
  })
  const data = await response.json()

  await router.push(`/chat/${data._id}`)
  await getChatByID(data._id)
  await getHistory()
}



async function getHistory() {
  const response = await fetch(import.meta.env.VITE_HISTORY_ENDPOINT, {
    headers: {Authorization: `Bearer ${authStore.token}`},
  })
  if(!response.ok) return alert("Erreur chargement historique")
  chatHistories.value = await response.json()
}


// GET CHAT BY ID
const getChatByID = async (id: string) => {
  const response = await fetch(`${import.meta.env.VITE_CHAT_ENDPOINT}/${id}`, {
    headers: {Authorization: `Bearer ${authStore.token}`},
  })
  const data = await response.json()
  messages.value = data.contents
}


async  function onSubmit () {
  if(!userInput.value.trim()) return
  disableSubmitButton.value = true
  const userMessage = {content: userInput.value, role: 'user'}
  userInput.value = ""

  // @ts-ignore
  messages.value.push(userMessage)

  const body = JSON.stringify({
    chatId: chatId.value,
    aiModel: modelStore.chosenModel,
    contents: messages.value
  })


  const response = await fetch(import.meta.env.VITE_CHAT_ENDPOINT, {
    method: "POST",
    headers: {Authorization: `Bearer ${authStore.token}`, 'Content-Type' : 'application/json'},
    body: body
  })

  if (!response.ok) {
    errorChat.value = true
    return
  }

  const modelMessage = {content: '', role: 'assistant'}
  // @ts-ignore
  messages.value.push(modelMessage)

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()


  while (true) {
    const {done, value} = await reader.read()
    if (done) {
      if(!chatId.value) {
        await getLastChat()
      }
      break
    }

    const text = decoder.decode(value)
    modelMessage.content += text
    messages.value = [...messages.value]
  }

  disableSubmitButton.value = false

}

function scrollToBottom() {
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
  }
}

const bubblePosition = computed(() => (role: string) => role === 'user' ? 'chat-end' : 'chat-start');

onMounted(() => {
  getHistory()
  chatId.value = (route.params.id || "" ) as string
  if(chatId.value) getChatByID(chatId.value)
})

// Watch URL ID update
watch(() => route.params.id, (newId) => {
  chatId.value = newId as string;
  if(chatId.value) getChatByID(chatId.value)
});

// Trigger Scroll to Bottom
watch(messages, () => {
  scrollToBottom();
}, { deep: true });


</script>

<template>


  <div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <!-- Page content here -->
      <template v-if="messages.length === 0 && !chatId">
        <h1 class="text-xl text-center"> bonjour {{userStore.username}} Comment puis-je vous aider ?</h1>
      </template>
      <Alert v-if="errorChat" value="Erreur Stream chat" class="alert-error"/>

      <main ref="chatContainerRef" class=" rounded p-10 my-10 min-h-[70vh] max-h-[70vh] overflow-scroll ">
        <div v-for="message in messages" :key="message._id"   class="chat" :class="bubblePosition(message.role)">
          <div class="chat-bubble " v-html="marked.parse(message.content)"></div>
        </div>
      </main>
      <form @submit.prevent="onSubmit"
            class=" relative bottom-0 left-0 right-0 w-2/3 mx-auto flex items-center gap-2 justify-center">
        <textarea
            @keydown.prevent.exact.enter="onSubmit"
            @keydown.enter.shift.exact.stop="userInput += '\n'"
            v-model="userInput"
            class="textarea w-full h-[48px] textarea-bordered"
            placeholder="CHAT HERE !!"
            required
        ></textarea>

        <button :disabled="disableSubmitButton || !userInput" type="submit" class="btn btn-outline btn-accent">Send</button>
      </form>

    </div>
    <div class="drawer-side">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
        <!-- Sidebar content here -->
         <template v-if="chatHistories.length > 0">

           <button class=" mb-4  btn btn-primary btn-outline" @click="onChatAdd">Nouvelle conversation</button>
          <li> <h2 class="text-2xl mb-4">Historique</h2></li>
          <li class="flex items-center justify-between flex-row" v-for="history in chatHistories">
            <RouterLink
                :title="history.title"
                class="flex-10"
                :to="{ name: 'chat', params: { id: history._id } }"
                :class="history._id === chatId ? 'active' : ''">
              {{ history.title.length > 20 ? history.title.substring(0, 20) + '...'  : history.title }}
            </RouterLink>
            <span class="text-error flex-1" @click="onDeleteChat(history._id)">&#128465;</span>
          </li>
         </template>
         <template v-else><span>Historique vide</span></template>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>