<template>
  <Modal size="modal-xl">
    <template #content>
        <!-- overview per admin -->
        <div v-if="authStore.user.role == 'Admin' && modalStore.item.extendedProps.AdminLookingForUser == 0 ">
            <punch-table :rows="punches"></punch-table>
        </div>
        <!-- dettaglio singola timbratura, funziona sia per Admin sia per Staff -->
        <div v-else class="text-center">
            <strong>ID TIMBRATURA:</strong> {{ modalStore.detailId }}
            <!-- {{ modalStore.item.title }} -->
            <div>
            <strong>ENTRATA:</strong> {{ new Date(modalStore.item.start).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) }}
            </div>
             <div>
    <strong>USCITA:</strong>
    <span v-if="modalStore.item.end">
      {{ new Date(modalStore.item.end).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }) }}
    </span>
    <span v-else> - </span>
  </div>

            <div>
            <strong>NOTE:</strong> {{modalStore.item.extendedProps.notes}}
            </div>
       
        </div>

    

      <!-- <user-form
        :url="url"
        v-if="formStore.formToShow === 'user'"
        @emptyTable="emptyTable"
        @fetchData="fetchData($event)" /> -->
    </template>
  </Modal>
</template>
<script>
import Modal from "@/components/shared/Modal.vue";
import PunchTable from "@/components/tables/PunchTable.vue";
import { useFormStore } from "@/store/forms";
import { useAuthStore } from "@/store/auth";
// import { useApiStore } from "@/store/api";
import { useModalStore } from "@/store/modals"
import { onMounted, ref} from "vue";

export default {
  name: "PunchModal",
  props: [ "url"],
  emits: ["emptyTable", "fetchData"],
  components: {
    PunchTable,
    Modal,
  },
  setup(props, context) {
    const formStore = useFormStore();
    const modalStore = useModalStore();
    const authStore = useAuthStore();
    // const apiStore = useApiStore();

    const punches = ref([])

    // const url =  process.env.VUE_APP_API_URL + "/getAllPunches" + "?exactDate=" + modalStore.date;


    onMounted(async () => {
     

      console.log("URL in PunchModal",props.url)

      console.log("role", authStore.user.role)
      if (authStore.user.role == "Admin") {
        console.log("sei admin e stai aprendo modale")
            //   punches.value = await apiStore.fetch(url)
      } 


    });


    const emptyTable = () => {
      context.emit("emptyTable", true);
    };

    const fetchData = (event) => {
      context.emit("fetchData", event);
    };

    return { emptyTable, fetchData, formStore,modalStore,authStore, punches };
  },
};
</script>
