<template>
  <Modal size="modal-xl">
    <template #content>
      <customer-form
        :url="url"
        @emptyTable="emptyTable"
        @fetchData="fetchData($event)" />
    </template>
  </Modal>
</template>
<script>
import Modal from "@/components/shared/Modal.vue";
import CustomerForm from "@/components/forms/CustomerForm.vue";

export default {
  name: "CustomerModal",
  props: ["url"],
  emits: ["emptyTable", "fetchData"],
  components: {
    CustomerForm,
    Modal,
  },
  setup(props, context) {
    const emptyTable = () => {
      context.emit("emptyTable", true);
    };

    const fetchData = (event) => {
      context.emit("fetchData", event);
    };

    return { emptyTable, fetchData };
  },
};
</script>
