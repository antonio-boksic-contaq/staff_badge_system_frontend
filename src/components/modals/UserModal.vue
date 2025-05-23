<template>
  <Modal size="modal-xl">
    <template #content>
      <user-form
        :url="url"
        v-if="formStore.formToShow === 'user'"
        @emptyTable="emptyTable"
        @fetchData="fetchData($event)" />
    </template>
  </Modal>
</template>
<script>
import Modal from "@/components/shared/Modal.vue";
import UserForm from "@/components/forms/UserForm.vue";
import { useFormStore } from "@/store/forms";
import { onMounted} from "vue";

export default {
  name: "UserModal",
  props: [ "url"],
  emits: ["emptyTable", "fetchData"],
  components: {
    UserForm,
    Modal,
  },
  setup(props, context) {
    const formStore = useFormStore();

    onMounted(async () => {
     

      console.log("URL in UserModal",props.url)
      // rolesOptions.value = await apiStore.fetch(
      //   process.env.VUE_APP_API_URL + "/roles"
      // );

     
    });


    const emptyTable = () => {
      context.emit("emptyTable", true);
    };

    const fetchData = (event) => {
      context.emit("fetchData", event);
    };

    return { emptyTable, fetchData, formStore };
  },
};
</script>
