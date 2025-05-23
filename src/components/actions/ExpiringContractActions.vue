<template>
  <div class="inline">
    <Button
      icon="pi pi-cog"
      class="p-button-rounded p-button-secondary p-button-text mr-2 mb-2"
      v-tooltip.top="'Gestisci'"
      @click="manageItem(props)" />
  </div>
</template>
<script>
import { useModalStore } from "@/store/modals";
import { useFormStore } from "@/store/forms";

export default {
  name: "ContractExtensionActions",
  props: ["url", "contract_id"],
  setup(props) {
    const modalStore = useModalStore();
    const formStore = useFormStore();

    const manageItem = async () => {
      formStore.data = {
        id: props.contract_id,
      };
      formStore.fill("add", props.url);
      modalStore.open("", "add");
      modalStore.title = "Gestisci scadenza contratto";
    };

    return {
      manageItem,
    };
  },
};
</script>
