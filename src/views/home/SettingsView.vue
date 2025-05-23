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


        <div>
            <strong>Email:</strong> {{ authStore.user.email }}
        </div>
        <div>
            <strong>Nome:</strong> {{ authStore.user.name }}
        </div>
        <div>
            <strong>Cognome:</strong> {{ authStore.user.surname }}
        </div>
        <div>
            <strong>Ruolo:</strong> {{ authStore.user.role }}
        </div>
  
    </template>
  </default-page>
</template>

<script>
// import { useApiStore } from "@/store/api";
// import { useModalStore } from "@/store/modals";
import { useAuthStore } from "@/store/auth";
// import { useFormStore } from "@/store/forms";
// import { useLoadingStore } from "@/store/loadings";
import { onBeforeMount, ref } from "vue";
import DefaultPage from "@/components/layouts/DefaultPage.vue";



export default {
  name: "SettingsView",
  components: {
    DefaultPage,


  },
  setup() {
    // const modalStore = useModalStore();
    const authStore = useAuthStore();
    // const formStore = useFormStore();
    // const apiStore = useApiStore();
    // const loadingStore = useLoadingStore();
    const usersOptions = ref([]);
    const customersOptions = ref([]);
    const filters = ref(null);

    const users = ref([])
    // const url = process.env.VUE_APP_API_URL + "/users";

    onBeforeMount(async () => {

    });



    const fetchData = (event) => {
      filters.value = event;
    };



    return {
      customersOptions,
      fetchData,
      filters,
      usersOptions,
    //   url,
      users,
      authStore
    };
  },
};
</script>
