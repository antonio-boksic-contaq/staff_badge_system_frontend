<template>
  <default-page icon="users">
    <template #title>Impostazioni Profilo</template>
    <template #subtitle>
      <!-- Il calendario con tutti i colloqui fissati per i candidati. -->
    </template>
    <template #content>
        <div class="text-right"> 
            <!-- <Button class="text-black mx-2 bg-green-500 hover:bg-green-700 border-black" @click="addUser">
                Aggiungi Utente
            </Button>     -->
                <!-- <div class="bottoni">
      <Button class="text-black mx-2 bg-green-500 hover:bg-green-700 border-black" @click="checkIn" >Check-in</Button>
      <Button class="text-black mx-2 bg-red-500 hover:bg-red-700 border-black" @click="checkOut">Check-out</Button>
    </div> -->
        </div>

        <div class="text-2xl" v-if="user">

  
          <div >
              <strong>Email:</strong> {{ user.email }}
          </div>
          <div>
              <strong>Nome:</strong> {{ user.name }}
          </div>
          <div>
              <strong>Cognome:</strong> {{ user.surname }}
          </div>
          <div>
              <strong>Ruolo:</strong> {{ user.role }}
          </div>

          <div class="text-right">
            <Button class="text-black mx-2 bg-blue-500 hover:bg-blue-700 border-black" @click="updateProfile">
                Modifica
            </Button>  
          </div>

        </div>
        <!-- MODALE PER MODIFICA -->
            <user-modal 
            :url="url"
            @fetchData="fetchData($event)"
            @emptyTable="emptyRows"></user-modal>
  
    </template>
  </default-page>
</template>

<script>
import { useApiStore } from "@/store/api";
import { useModalStore } from "@/store/modals";
import { useAuthStore } from "@/store/auth";
import { useFormStore } from "@/store/forms";
// import { useLoadingStore } from "@/store/loadings";
import { onBeforeMount, ref } from "vue";
import DefaultPage from "@/components/layouts/DefaultPage.vue";
import UserModal from "@/components/modals/UserModal";



export default {
  name: "SettingsView",
  components: {
    DefaultPage,
    UserModal

  },
  setup() {
    const modalStore = useModalStore();
    const authStore = useAuthStore();
    const formStore = useFormStore();
    const apiStore = useApiStore();
    // const loadingStore = useLoadingStore();
    const usersOptions = ref([]);
    const customersOptions = ref([]);
    const filters = ref(null);

    const user = ref()
    const url = process.env.VUE_APP_API_URL + "/users/" + authStore.user.id;

    onBeforeMount(async () => {
      const response = await apiStore.fetch(url);
      user.value = response
    });

    const updateProfile = async () => {

      formStore.data = user;
      openModal()
        
    }

    const openModal = () => {
      modalStore.open("utente", "edit");
      formStore.formToShow = "user";
      modalStore.modalToShow = "user";
      modalStore.size = "modal-xl";
      formStore.fill("edit", url);
    };





    const fetchData = (event) => {
      filters.value = event;
    };



    return {
      customersOptions,
      fetchData,
      filters,
      usersOptions,
    //   url,
      user,
      authStore,
      updateProfile
    };
  },
};
</script>
