<template>
  <default-page icon="users">
    <template #title>Utenti</template>
    <template #subtitle>
      <!-- Il calendario con tutti i colloqui fissati per i candidati. -->
    </template>
    <template #content>
        <div class="text-right"> 
            <Button class="text-black mx-2 bg-green-500 hover:bg-green-700 border-black" @click="addUser">
                Aggiungi Utente
            </Button>    
                <!-- <div class="bottoni">
      <Button class="text-black mx-2 bg-green-500 hover:bg-green-700 border-black" @click="checkIn" >Check-in</Button>
      <Button class="text-black mx-2 bg-red-500 hover:bg-red-700 border-black" @click="checkOut">Check-out</Button>
    </div> -->
        </div>
           <user-table
            :rows="users"
            :url="url"
            @fetchData="fetchData($event)"
            @emptyTable="emptyRows"
            />
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
import { useFormStore } from "@/store/forms";
import { useLoadingStore } from "@/store/loadings";
import { onBeforeMount, ref } from "vue";
import DefaultPage from "@/components/layouts/DefaultPage.vue";
import UserTable from "@/components/tables/UserTable";
import UserModal from "@/components/modals/UserModal";


export default {
  name: "StaffOverviewView",
  components: {
    DefaultPage,
    UserTable,
    UserModal

  },
  setup() {
    const modalStore = useModalStore();
    const formStore = useFormStore();
    const apiStore = useApiStore();
    const loadingStore = useLoadingStore();
    const usersOptions = ref([]);
    const customersOptions = ref([]);
    const filters = ref(null);

    const users = ref([])
    const url = process.env.VUE_APP_API_URL + "/users";

    onBeforeMount(async () => {
      loadingStore.load();

      users.value = await apiStore.fetch(url)
      console.log("users", users.value)
      loadingStore.stop();
    });

    const openModal = () => {
      modalStore.open("utente", "add");
      formStore.formToShow = "user";
      modalStore.modalToShow = "user";
      modalStore.size = "modal-xl";
      formStore.fill("add", url);
    };

    const fetchData = (event) => {
      filters.value = event;
    };

    const addUser = () => {
        openModal()
    }

    return {
      customersOptions,
      fetchData,
      filters,
      usersOptions,
      openModal,
      url,
      users,
      addUser
    };
  },
};
</script>
