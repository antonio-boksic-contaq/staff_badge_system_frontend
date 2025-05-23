<template>
  <loading />
 <div class="grid grid-cols-1 ">

  <div class="timbratura text-center">
    <h2>Timbratura</h2>
    
    <div class="orari my-5">
      <p>Orario di entrata: <strong>{{ timeLogs.check_in || '-' }}</strong></p>
      <p>Orario di uscita: <strong>{{ timeLogs.check_out || '-' }}</strong></p>
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
      <Button class="text-black mx-2 bg-red-500 hover:bg-red-700 border-black" @click="checkOut">Check-out</Button>
    </div>
  </div>

  </div>

  <div class="grid grid-cols-1 gap-7 mx-0 mb-10 md:grid-cols-2">

  </div>
<!--   
  <user-update-password-modal
    :show="passwordModalStore.isOpen"
    @closeModal="closeModal" /> -->
</template>

<script>
import { onBeforeMount, ref } from "vue";
import { useApiStore } from "@/store/api";
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
    const closeModal = () => {
      passwordModalStore.isOpen = false;
    };

    const timeLogs = ref({})

    const noteInput = ref("");


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

    const checkOut = async () => {
        loadingStore.load();
        await apiStore.store(
            process.env.VUE_APP_API_URL + "/check-out", null,null
        );
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
      noteInput
    };
  },
};
</script>
