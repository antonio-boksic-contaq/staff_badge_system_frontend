<template>
  <Modal size="modal-xl">
    <template #content>

        <div v-if="authStore.user.role == 'Staff'">
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
            <strong>USCITA:</strong> {{ new Date(modalStore.item.end).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) }}
            </div>

            <div>
            <strong>NOTE:</strong> {{modalStore.item.extendedProps.notes}}
            </div>
       
        </div>
        <div v-else>
            <punch-table :rows="punches"></punch-table>
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
