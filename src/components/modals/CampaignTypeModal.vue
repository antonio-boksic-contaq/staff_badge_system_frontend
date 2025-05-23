<template>
  <Modal>
    <template #content>
      <campaign-type-form
        :url="url"
        @emptyTable="emptyTable"
        @fetchData="fetchData($event)" />
    </template>
  </Modal>
</template>
<script>
import Modal from "@/components/shared/Modal.vue";
import CampaignTypeForm from "@/components/forms/CampaignTypeForm.vue";

export default {
  name: "CampaignTypeModal",
  props: ["url"],
  emits: ["emptyTable", "fetchData"],
  components: {
    CampaignTypeForm,
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
