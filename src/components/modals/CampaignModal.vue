<template>
  <Modal size="modal-xl">
    <template #content>
      <campaign-form
        :url="url"
        v-if="formStore.formToShow != null"
        @emptyTable="emptyTable"
        @fetchData="fetchData($event)" />
      <campaign-detail v-else />
    </template>
  </Modal>
</template>
<script>
import Modal from "@/components/shared/Modal.vue";
import CampaignForm from "@/components/forms/CampaignForm.vue";
import CampaignDetail from "@/components/detail/CampaignDetail.vue";
import { useFormStore } from "@/store/forms";

export default {
  name: "CampaignModal",
  props: ["url"],
  emits: ["emptyTable", "fetchData"],
  components: {
    CampaignDetail,
    CampaignForm,
    Modal,
  },
  setup(props, context) {
    const formStore = useFormStore();

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
