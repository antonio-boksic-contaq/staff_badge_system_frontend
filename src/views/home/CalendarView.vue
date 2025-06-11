<template>
  <default-page icon="calendar">
    <template #title>Calendario timbrature</template>
    <template #subtitle>
      <!-- Il calendario con tutti i colloqui fissati per i candidati. -->
    </template>
    <template #content>
      <!-- NON MI SERVE DEFAULT ACTION PER CALENDARIO, ALMENO INIZIALMENTE -->
      <!-- questo lo posso utilizzare sia per export che per vedere timbrature di un utente specifico -->
      <div v-if="authStore.user.role == 'Admin'" class="card filters ">
        <default-action>
          <template #content>
            <div class="grid grid-cols-4 mt-2 gap-7">
              <!-- seleziona utenti -->
              <div>
                <select-filter
                  label="Utente"
                  text="complete_name"
                  :selectedValue="[]"
                  :options="usersOptions"
                  field="user_id"
                  @fetchData="fetchData($event)" />
              </div>
              <!-- Da data -->
              <div>
                <label for="start-date" class="block text-sm font-medium text-gray-700">Da data</label>
                <input
                  id="start-date"
                  type="date"
                  v-model="startDate"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <!-- A data -->
              <div>
                <label for="end-date" class="block text-sm font-medium text-gray-700">A data</label>
                <input
                  id="end-date"
                  type="date"
                  v-model="endDate"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <Button
                  icon="pi pi-plus"
                  class="p-button-rounded float-right p-button-primary p-button-text mt-12 mr-3"
                  label="Aggiungi campagna"
                  @click="getExport">genera export</Button>
              </div>
            </div>
          </template>
        </default-action>
      </div>
      <campaign-calendar :userIdToLookFor="userIdToLookFor" :startDate="startDate" :endDate="endDate" :punches="punches"/>
      <punch-modal></punch-modal>
      <BadgePopup :numberOfNotConvalidatedPunches="numberOfNotConvalidatedPunches.length"></BadgePopup>
    </template>
  </default-page>
</template>

<script>
import { useApiStore } from "@/store/api";
import { excel} from "@/utils/axios";
import { useModalStore } from "@/store/modals";
import { useFormStore } from "@/store/forms";
import { useAuthStore } from "@/store/auth";
import { usePopupStore } from "@/store/popups";
import { useLoadingStore } from "@/store/loadings";
import { onBeforeMount, ref, watch, computed } from "vue";
import DefaultPage from "@/components/layouts/DefaultPage.vue";
import CampaignCalendar from "@/components/calendar/CampaignCalendar.vue";
import DefaultAction from "@/components/layouts/DefaultAction.vue";
import SelectFilter from "@/components/actions/SelectFilter.vue";
import PunchModal from "@/components/modals/PunchModal";
import BadgePopup from "@/components/popups/BadgePopup";


export default {
  name: "CalendarView",
  components: {
    DefaultAction,
    DefaultPage,
    CampaignCalendar,
    SelectFilter,
    PunchModal,
    BadgePopup
  },
  setup() {
    const modalStore = useModalStore();
    const formStore = useFormStore();
    const authStore = useAuthStore();
    const apiStore = useApiStore();
    const popupStore = usePopupStore();
    const loadingStore = useLoadingStore();
    const usersOptions = ref([]);
    // const customersOptions = ref([]);
    const filters = ref(null);
    const userIdToLookFor = ref(null)

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based: gennaio = 0

  // Primo giorno del mese corrente
  const startOfMonth = new Date(year, month, 1);
  // console.log("startofmonth",startOfMonth)

  // Ultimo giorno del mese corrente
  const endOfMonth = new Date(year, month + 1, 0); // Giorno 0 del mese successivo = ultimo del mese corrente

  const setNoon = (date) => {
    const d = new Date(date);
    d.setHours(12, 0, 0, 0); // mezzogiorno per evitare slittamenti UTC
    return d;
  };

  // Convertili in stringa 'YYYY-MM-DD' per il campo <input type="date" />
  const formatDate = (date) => setNoon(date).toISOString().split('T')[0];

  const startDate = ref(formatDate(startOfMonth));
  // console.log("startdate", startDate)
  const endDate = ref(formatDate(endOfMonth));

    const punches = ref([])

    const numberOfNotConvalidatedPunches = computed (() => {
      // console.log("punches in computed n non convalidati", punches.value)
      // console.log("n non convalidati che passo a popup",punches.value.filter((punch) => {return punch.co_accepted == 0}))
      return punches.value.filter((punch) => {return punch.co_accepted == 0})
    })

    // const url = process.env.VUE_APP_API_URL + "/campaigns";
    const urlUsers = process.env.VUE_APP_API_URL + "/users?role=Staff";
    // const urlCustomers = process.env.VUE_APP_API_URL + "/customers";
    const url = process.env.VUE_APP_API_URL + "/getAllPunches";
    let urlWithParams = url + "?startDate=" + startDate.value + "&endDate=" + endDate.value;

    onBeforeMount(async () => {

      // 
      if (authStore.user.role === "Admin") {

        window.Echo.channel('punch-channel')
        .listen('.punch.created', async  (e) => {
            console.log('Evento ricevuto dal backend:', e.message);

            // UA DOVREI AGGIORNARE I PUNCH A QUESTO PUNTO E NON CAMBIARE LOGICA DEL POPUP
            punches.value = await apiStore.fetch(urlWithParams)
            popupStore.open()
            // Esegui azioni qui, ad esempio mostrare una notifica
        });
      }

      // console.log("sto dentro componente calendario, qua dovrò caricare badgiature")
      
      //quando admin logga viene reindirizzato qui con showPopupJustAfterLogin = true 
      // questa è la logica che gli da il popup iniziale per timbrature non convalidate



      // loadingStore.stop();
      //customersOptions.value = await apiStore.fetch(urlCustomers);

      loadingStore.load();
      punches.value = await apiStore.fetch(urlWithParams)
      console.log("punches nella view", punches.value)



      if (authStore.user.role === "Admin" && authStore.showPopupJustAfterLogin == true) {
        // console.log("ADMIN STA IN CALENDARVIEW CONSOLELOG")
        // console.log("mostro popup dopo login?", authStore.showPopupJustAfterLogin)
        popupStore.open()
        authStore.showPopupJustAfterLogin = false
      }


      usersOptions.value = await apiStore.fetch(urlUsers);
      loadingStore.stop();
    });

    const openModal = () => {
      modalStore.open("campagna", "add");
      formStore.formToShow = "campaign";
      modalStore.modalToShow = "campaign";
      modalStore.size = "modal-xl";
      formStore.fill("add", url);
    };

    const fetchData = async (event) => {
      console.log("la select chiama fetch data, vediamo event che emette", event)
      // filters.value = event;
      //       loadingStore.load();
      userIdToLookFor.value = event
      //     const url = process.env.VUE_APP_API_URL + "/getAllPunches";
      //     let urlWithParams = url + "?startDate=" + startDate.value + "&endDate=" + endDate.value + "&user_id=" + userIdToLookFor.value;

      
      //   let response = await apiStore.fetch(urlWithParams);
      //   punches.value = response
      //         loadingStore.stop();
    };

    watch([startDate, endDate], async ([newStart, newEnd]) => {
    // console.log("startDate o endDate cambiati:");
    // console.log("Nuova startDate:", newStart);
    // console.log("Nuova endDate:", newEnd);
    loadingStore.load();
    const dynamicUrl = url + "?startDate=" + newStart + "&endDate=" + newEnd;

    punches.value = await apiStore.fetch(dynamicUrl)
    loadingStore.stop();
    // console.log("punches nella view", punches.value)

    });

    const getExport = async () => {
      console.log("sto cercando di ottenere export")
      // apiStore.export(urlWithParams, "presenze ayvens data x") // mi dava problemi con params non mi andava di fare refactoring
      let urlWithParams = url + "?startDate=" + startDate.value + "&endDate=" + endDate.value;
      const dynamicUrl = urlWithParams + "&export=1"
      const filename = `presenze_ayvens_da_${startDate.value}_a_${endDate.value}`;
       await excel(authStore.accessToken, dynamicUrl, null, filename);
    }

    return {
      // customersOptions,
      fetchData,
      filters,
      usersOptions,
      openModal,
      url,
      punches,
      authStore,
      userIdToLookFor,
      startDate,
      endDate,
      getExport,
      numberOfNotConvalidatedPunches
    };
  },
};
</script>
