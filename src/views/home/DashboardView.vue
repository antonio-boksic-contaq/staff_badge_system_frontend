<template>
  <loading />
  <div class="grid grid-cols-1 gap-7 mx-0 mt-0 mb-10 md:grid-cols-3">
    <div>
      <Transition name="scale-in" appear>
        <card-alert
          title="Contratti in scadenza"
          icon="copy"
          color="orange"
          route="dashboard"
          link-text="Vai ai contratti"
          :text="
            expiringContracts === 1
              ? 'C\'è ' + expiringContracts + ' contratto in scadenza'
              : 'Ci sono ' + expiringContracts + ' contratti in scadenza'
          " />
      </Transition>
    </div>
    <div>
      <Transition name="scale-in" appear>
        <card-alert
          title="Colloqui in giornata"
          icon="briefcase"
          color="blue"
          route="dashboard"
          link-text="Vai al calendario"
          :text="
            jobApplicationsOfTheDay === 1
              ? 'C\'è ' + jobApplicationsOfTheDay + ' colloquio fissato'
              : 'Ci sono ' + jobApplicationsOfTheDay + ' colloqui fissati'
          " />
      </Transition>
    </div>
    <div>
      <Transition name="scale-in" appear>
        <card-alert
          title="Candidati senza colloqui"
          icon="id-card"
          color="indigo"
          route="dashboard"
          link-text="Vai all'anagrafica"
          :text="
            candidatesWithoutJobApplication === 1
              ? 'C\'è ' +
                candidatesWithoutJobApplication +
                ' candidate senza colloquio'
              : 'Ci sono ' +
                candidatesWithoutJobApplication +
                ' candidati senza colloquio'
          " />
      </Transition>
    </div>
  </div>
  <div class="grid grid-cols-1 gap-7 mx-0 mb-10 md:grid-cols-2">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <user-update-password-modal
    :show="passwordModalStore.isOpen"
    @closeModal="closeModal" />
</template>

<script>
import { onBeforeMount, ref } from "vue";
// import { useApiStore } from "@/store/api";
import { useLoadingStore } from "@/store/loadings";
import { usePasswordModalStore } from "@/store/password-modal";
import Loading from "@/components/shared/Loading.vue";
import CardAlert from "@/components/dashboard/CardAlert.vue";
import UserUpdatePasswordModal from "@/components/modals/UserUpdatePasswordModal.vue";

export default {
  name: "DashboardView",
  components: {
    CardAlert,
    Loading,
    UserUpdatePasswordModal,
  },
  setup() {
    // const apiStore = useApiStore();
    const loadingStore = useLoadingStore();
    const expiringContracts = ref(0);
    const jobApplicationsOfTheDay = ref(0);
    const candidatesWithoutJobApplication = ref(0);
    const passwordModalStore = usePasswordModalStore();
    const closeModal = () => {
      passwordModalStore.isOpen = false;
    };

    onBeforeMount(async () => {
      loadingStore.load();
      // expiringContracts.value = await apiStore.fetch(
      //   process.env.VUE_APP_API_URL + "/report/hr/expiring-contracts"
      // );
      // jobApplicationsOfTheDay.value = await apiStore.fetch(
      //   process.env.VUE_APP_API_URL + "/report/hr/job-applications-of-the-day"
      // );
      // candidatesWithoutJobApplication.value = await apiStore.fetch(
      //   process.env.VUE_APP_API_URL +
      //     "/report/hr/candidates-with-no-job-application"
      // );
      loadingStore.stop();
    });

    return {
      candidatesWithoutJobApplication,
      closeModal,
      expiringContracts,
      jobApplicationsOfTheDay,
      passwordModalStore,
    };
  },
};
</script>
