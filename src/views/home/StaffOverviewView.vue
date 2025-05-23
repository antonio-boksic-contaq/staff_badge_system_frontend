<template>
  <default-page icon="magnifying-glass">
    <template #title>Staff Overview</template>
    <template #subtitle>
      <!-- Il calendario con tutti i colloqui fissati per i candidati. -->
    </template>
    <template #content>
      qua inserisco tabella dove posso vedere tutte le risorse per la giornata selezionata
      <!-- NON MI SERVE DEFAULT ACTION PER CALENDARIO, ALMENO INIZIALMENTE -->
      <!-- <div class="card filters ">
        <default-action>
          <template #content>
            <div class="grid grid-cols-2 mt-2 gap-7">
              <div>
                <select-filter
                  label="Cliente"
                  text="name"
                  :selectedValue="[]"
                  :options="customersOptions"
                  field="customer_id"
                  @fetchData="fetchData($event)" />
              </div>
              <div>
                <Button
                  icon="pi pi-plus"
                  class="p-button-rounded float-right p-button-primary p-button-text mt-12 mr-3"
                  label="Aggiungi campagna"
                  @click="openModal"></Button>
              </div>
            </div>
          </template>
        </default-action>
      </div> -->
      <!-- <campaign-calendar :filters="filters" /> -->
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
// import CampaignCalendar from "@/components/calendar/CampaignCalendar.vue";
// import DefaultAction from "@/components/layouts/DefaultAction.vue";
// import SelectFilter from "@/components/actions/SelectFilter.vue";

export default {
  name: "StaffOverviewView",
  components: {
    // DefaultAction,
    DefaultPage,
    // CampaignCalendar,
    // SelectFilter,
  },
  setup() {
    const modalStore = useModalStore();
    const formStore = useFormStore();
    const apiStore = useApiStore();
    const loadingStore = useLoadingStore();
    const usersOptions = ref([]);
    const customersOptions = ref([]);
    const filters = ref(null);

    const punches = ref([])

    // const url = process.env.VUE_APP_API_URL + "/campaigns";
    // const urlUsers = process.env.VUE_APP_API_URL + "/users?role=Sales";
    // const urlCustomers = process.env.VUE_APP_API_URL + "/customers";
    const url = process.env.VUE_APP_API_URL + "/getAllPunches";

    onBeforeMount(async () => {
      loadingStore.load();

      console.log("sto dentro componente calendario, qua dovrò caricare badgiature")
      
      //usersOptions.value = await apiStore.fetch(urlUsers);
      //customersOptions.value = await apiStore.fetch(urlCustomers);

      punches.value = await apiStore.fetch(url)
      loadingStore.stop();
    });

    const openModal = () => {
      modalStore.open("campagna", "add");
      formStore.formToShow = "campaign";
      modalStore.modalToShow = "campaign";
      modalStore.size = "modal-xl";
      formStore.fill("add", url);
    };

    const fetchData = (event) => {
      filters.value = event;
    };

    return {
      customersOptions,
      fetchData,
      filters,
      usersOptions,
      openModal,
      url,
      punches
    };
  },
};
</script>
