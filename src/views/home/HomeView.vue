<template>
  <loading />
 <div class="grid grid-cols-1 ">

  <div v-if="isLastCheckOutControlSuccesful" class="timbratura text-center">
    <h2>Timbratura</h2>
    
    <div class="orari my-5">
      <p>Orario di entrata: <strong>{{ timeLogs.check_in || '-' }}</strong></p>
      <p>Orario di uscita: <strong>{{ timeLogs.check_out || '-' }}</strong></p>
      <!-- <p>{{isLastCheckOutControlSuccesful}}</p> -->
  <p v-if="timeLogs.notes">
    Note: <strong>{{ timeLogs.notes }}</strong>
  </p>
  <div v-else class="flex justify-center items-center gap-2">
    <label for="note" class="text-gray-700 font-medium">Note:</label>
    <input
      id="note"
      v-model="noteInput"
      type="text"
      placeholder="Inserisci una nota"
      class="border border-gray-300 rounded px-3 py-1 w-64"
    />
    <button
      @click="submitNote"
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-1 rounded"
    >
      Salva
    </button>
  </div>
    </div>

    <div class="bottoni">
      <Button class="text-black mx-2 bg-green-500 hover:bg-green-700 border-black" @click="checkIn" >Check-in</Button>
      <Button class="text-black mx-2 bg-red-500 hover:bg-red-700 border-black" @click="checkOut(false)">Check-out</Button>
    </div>
  </div>

  <div v-else class="text-center">
    <h2>Checkout per il {{ authStore.user.date_of_last_checkin }}</h2>
    <div class="text-lg">Manca il check-out per ultima data con check-in!</div>

    <div class="my-4">
    <label for="late-checkout-time" class="mr-2">Orario di uscita:</label>
    <input
      id="late-checkout-time"
      v-model="lateCheckoutTime"
      type="time"
      class="border border-gray-300 rounded px-3 py-1 text-lg"
      required
    />
  </div>

    <div>
      <Button class="text-black mx-2 bg-red-500 hover:bg-red-700 border-black" @click="checkOut(true)">Check-out</Button>
    </div>

  </div>

  </div>


<!--   
  <user-update-password-modal
    :show="passwordModalStore.isOpen"
    @closeModal="closeModal" /> -->
</template>

<script>
import axios from "axios";
import { onBeforeMount, ref, computed } from "vue";
import { useApiStore } from "@/store/api";
import { useAuthStore } from "@/store/auth";
import { useLoadingStore } from "@/store/loadings";
import { usePasswordModalStore } from "@/store/password-modal";
import Loading from "@/components/shared/Loading.vue";
// import CardAlert from "@/components/dashboard/CardAlert.vue";
// import UserUpdatePasswordModal from "@/components/modals/UserUpdatePasswordModal.vue";

export default {
  name: "DashboardView",
  components: {
    Loading,
  },
  setup() {
    const apiStore = useApiStore();
    const loadingStore = useLoadingStore();
    const expiringContracts = ref(0);
    const jobApplicationsOfTheDay = ref(0);
    const candidatesWithoutJobApplication = ref(0);
    const passwordModalStore = usePasswordModalStore();
    const authStore = useAuthStore();
    const closeModal = () => {
      passwordModalStore.isOpen = false;
    };

    const timeLogs = ref({})

    const noteInput = ref("");

    const lateCheckoutTime = ref("");



    onBeforeMount(async () => {
      loadingStore.load();
      await getTimeLogs()
      // jobApplicationsOfTheDay.value = await apiStore.fetch(
      //   process.env.VUE_APP_API_URL + "/report/hr/job-applications-of-the-day"
      // );
      // candidatesWithoutJobApplication.value = await apiStore.fetch(
      //   process.env.VUE_APP_API_URL +
      //     "/report/hr/candidates-with-no-job-application"
      // );
      loadingStore.stop();
    });

const isLastCheckOutControlSuccesful = computed(() => {
   const today = new Date().toISOString().split('T')[0];
   const lastCheckIn = authStore.user.date_of_last_checkin;
   const lastCheckOut = authStore.user.date_of_last_checkout;

    console.log("today", today)
    console.log("lastCheckIn", lastCheckIn)
    console.log("lastCheckOut", lastCheckOut)

   return today === lastCheckIn ? 1 : authStore.user.date_of_last_checkin === authStore.user.date_of_last_checkout ? 1 : 0;
   
});

    const getTimeLogs = async () => {
        timeLogs.value = await apiStore.fetch(
            process.env.VUE_APP_API_URL + "/get-time-logs"
        );
        console.log("timelogs",timeLogs.value);
    }

    const checkIn = async () => {
        loadingStore.load();
        await apiStore.store(
            process.env.VUE_APP_API_URL + "/check-in", null,null
        );
        getTimeLogs()
        loadingStore.stop();
    }

    const getAxiosHeaders = (token) => ({
      headers: {
        Authorization: "Bearer " + token,
        // "Content-Type": "multipart/form-data",
      },
    });

    const checkOut = async (forPreviousDate) => {
        loadingStore.load();
        if (!forPreviousDate) {
          await apiStore.store(
              process.env.VUE_APP_API_URL + "/check-out", null,null
          );
        } else {
          console.log("sto cercando di fare checkout per giornata passata alle ore", lateCheckoutTime.value)
          const payload = {
            time: lateCheckoutTime.value,
          };

          const response = await axios.create(getAxiosHeaders(authStore.accessToken)).put(
          process.env.VUE_APP_API_URL + "/late-check-out",
          payload
          );
            console.log("Risposta dal server:", response.data);
        }
        refreshUserData()
        getTimeLogs()
        loadingStore.stop();
    }

    const submitNote = async () => {
        loadingStore.load();
        await apiStore.store(
            process.env.VUE_APP_API_URL + "/create-note",  { notes: noteInput.value },null
        );
        getTimeLogs()
        loadingStore.stop();
    
    }

    const refreshUserData = () => {
      console.log("qua devo refreshare dati utente")
      authStore.refreshUser()
    }

    return {
      candidatesWithoutJobApplication,
      closeModal,
      expiringContracts,
      jobApplicationsOfTheDay,
      passwordModalStore,
      timeLogs,
      checkIn,
      checkOut,
      submitNote,
      noteInput,
      isLastCheckOutControlSuccesful,
      authStore,
      lateCheckoutTime
    };
  },
};
</script>
