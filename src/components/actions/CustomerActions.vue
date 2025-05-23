<template>
  <div
    v-if="
      !Object.prototype.hasOwnProperty.call(props.row, 'deleted_at') &&
      authStore.user.permissions.includes('update ' + item)
    "
    class="inline">
    <Button
      icon="pi pi-table"
      class="p-button-rounded p-button-warning p-button-text mr-2 mb-2"
      v-tooltip.top="'Modifica mappatura'"
      @mouseover="changeTooltipColor('warning')"
      @click="openModal(props, itemText)" />
  </div>
</template>
<script>
import { useAuthStore } from "@/store/auth";
import { useApiStore } from "@/store/api";
import { useModalStore } from "@/store/modals";
import { useFormStore } from "@/store/forms";
import { changeTooltipColor } from "@/utils/buttons";

export default {
  name: "CustomerActions",
  props: ["url", "item", "itemText", "props"],
  setup(props) {
    const authStore = useAuthStore();
    const apiStore = useApiStore();
    const modalStore = useModalStore();
    const formStore = useFormStore();

    const openModal = async (item, itemText = null) => {
      const itemUrl =
        process.env.VUE_APP_API_URL + "/map-fields?db_name=" + item.row.db_name;
      const response = await apiStore.select(itemUrl);
      const data = [
        ...response.data,
        {
          db_name: item.row.db_name,
        },
      ];
      modalStore.modalToShow = props.item;
      formStore.formToShow = "map field";
      formStore.data = data;
      formStore.fill("edit", itemUrl);
      modalStore.title = "Modifica mappatura campi";
      modalStore.icon = "pi-table";
      modalStore.open(itemText, "warning");
    };

    return {
      authStore,
      changeTooltipColor,
      openModal,
    };
  },
};
</script>
