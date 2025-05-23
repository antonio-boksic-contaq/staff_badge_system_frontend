<template>
  <div class="inline">
    <Button
      v-if="props.row.confirmed === 0"
      icon="pi pi-bell"
      class="p-button-rounded p-button-info p-button-text mr-2 mb-2"
      v-tooltip.top="'Conferma operazione'"
      @mouseover="changeTooltipColor('info')"
      @click="manageItem(props)" />
    <Button
      v-else
      icon="pi pi-undo"
      class="p-button-rounded p-button-warning p-button-text mr-2 mb-2"
      v-tooltip.top="'Annulla'"
      @mouseover="changeTooltipColor('warning')"
      @click="restoreItem(props)"></Button>
  </div>
</template>
<script>
import { useConfirmStore } from "@/store/confirms";
import { changeTooltipColor } from "@/utils/buttons";

export default {
  name: "ContractExtensionActions",
  props: ["url", "props"],
  setup(props) {
    const confirmStore = useConfirmStore();
    const manageItem = async (item) => {
      confirmStore.route = props.url + "/" + item.row.id + "/confirm";
      confirmStore.icon = "pi-bell";
      confirmStore.open(item, "info", null, "Conferma operazione");
      confirmStore.itemText = "Confermi di aver gestito la proroga?";
    };

    const restoreItem = async (item) => {
      await confirmStore.open(item, "info", null, "Annulla operazione");
      confirmStore.color = "warning";
      confirmStore.icon = "pi-undo";
      confirmStore.route = props.url + "/" + item.row.id + "/unconfirm";
      confirmStore.itemText =
        "Confermi di voler annulare la gestione della proroga?";
    };

    return {
      changeTooltipColor,
      manageItem,
      restoreItem,
    };
  },
};
</script>
