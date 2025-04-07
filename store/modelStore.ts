import { defineStore } from 'pinia'
import {useAuthStore} from "./authStore";


export const useModelStore = defineStore('model', {

    state: () => ({
        chosenModel : localStorage.getItem('chosenModel') || null,
        modelsList: []
    }),

    actions : {
        async fetchModels()  {
            const authStore = useAuthStore()
            if (!authStore.isAuthenticated) return
            //@ts-ignore
            const response = await fetch(import.meta.env.VITE_MODELS_ENDPOINT)
            if(!response.ok) return  alert("Erreur recuperation des models")
            const data = await  response.json()
            this.modelsList = data.models
            if(!this.chosenModel) this.setChosenModel(this.modelsList[0])
        },

        setChosenModel (model : string) {
            localStorage.setItem("chosenModel", model)
            this.chosenModel = model
        }

    }
})