<template>
  <default-page icon="circle-xmark">
    <template #title>Timbrature Da Convalidare</template>
    <template #subtitle>
      <!-- Il calendario con tutti i colloqui fissati per i candidati. -->
    </template>
    <template #content>
        
            <punch-table :rows="punches" :notConvalidated="1"></punch-table>
    </template>
  </default-page>
</template>

<script>
import { useApiStore } from "@/store/api";
import { useModalStore } from "@/store/modals";
import { useFormStore } from "@/store/forms";
import { useAuthStore } from "@/store/auth";
import { useLoadingStore } from "@/store/loadings";
import { onBeforeMount, ref } from "vue";
import DefaultPage from "@/components/layouts/DefaultPage.vue";
import PunchTable from "@/components/tables/PunchTable.vue";


export default {
  name: "CalendarView",
  components: {

    DefaultPage,
    PunchTable

  },
  setup() {
    const modalStore = useModalStore();
    const formStore = useFormStore();
    const authStore = useAuthStore();
    const apiStore = useApiStore();
    const loadingStore = useLoadingStore();
    const usersOptions = ref([]);
    // const customersOptions = ref([]);
    const filters = ref(null);
    const userIdToLookFor = ref(null)

    const punches = ref([])

    // const url = process.env.VUE_APP_API_URL + "/campaigns";
    //const urlUsers = process.env.VUE_APP_API_URL + "/users?role=Staff";
    // const urlCustomers = process.env.VUE_APP_API_URL + "/customers";
    const url = process.env.VUE_APP_API_URL + "/getAllPunches?not-convalidated=1";

    onBeforeMount( async () => {
      loadingStore.load();
      console.log("sto montando componente view--------------------------")

      // console.log("sto dentro componente calendario, qua dovrò caricare badgiature")
      
      //usersOptions.value = await apiStore.fetch(urlUsers);
      //customersOptions.value = await apiStore.fetch(urlCustomers);

      punches.value = await apiStore.fetch(url)
      console.log("response not convalidated punches", punches.value)
      loadingStore.stop();
      apiStore.isLoading = false
    });

    const openModal = () => {
      modalStore.open("campagna", "add");
      formStore.formToShow = "campaign";
      modalStore.modalToShow = "campaign";
      modalStore.size = "modal-xl";
      formStore.fill("add", url);
    };

    const fetchData = (event) => {
      console.log("la select chiama fetch data, vediamo event che emette", event)
      filters.value = event;
      userIdToLookFor.value = event
    };

    return {
      // customersOptions,
      fetchData,
      filters,
      usersOptions,
      openModal,
      url,
      punches,
      authStore,
      userIdToLookFor
    };
  },
};
</script>
