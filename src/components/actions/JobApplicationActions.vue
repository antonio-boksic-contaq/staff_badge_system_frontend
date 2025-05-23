<template>
  <div
    v-if="
      !Object.prototype.hasOwnProperty.call(props.row, 'deleted_at') &&
      authStore.user.permissions.includes('update ' + item)
    "
    class="inline">
    <router-link
      v-if="
        authStore.user.permissions.includes('see ' + item) &&
        props.row.performed === 0
      "
      :to="{
        name: 'svolgimento-colloquio',
        params: { id: props.row.id },
      }">
      <Button
        icon="pi pi-play"
        class="p-button-rounded p-button-info p-button-text mr-2 mb-2"
        v-tooltip.top="'Svolgi'"
        @mouseover="changeTooltipColor('info')" />
    </router-link>
    <Button
      v-else
      icon="pi pi-search"
      class="p-button-rounded p-button-info p-button-text mr-2 mb-2"
      v-tooltip.top="'Dettaglio'"
      @click="detailItem(props)"
      @mouseover="changeTooltipColor('info')" />
    <a :href="urlPDF" target="_blank">
      <Button
        icon="pi pi-file-pdf"
        class="p-button-rounded p-button-secondary p-button-text mr-2 mb-2"
        v-tooltip.top="'Scarica CV'"
        @mouseover="changeTooltipColor('secondary')" />
    </a>
    <Button
      icon="pi pi-times"
      class="p-button-rounded p-button-warning p-button-text mr-2 mb-2"
      v-tooltip.top="'Rifiuta'"
      @mouseover="changeTooltipColor('warning')"
      @click="refuseItem(props, itemText)" />
  </div>
</template>
<script>
import { useAuthStore } from "@/store/auth";
import { useApiStore } from "@/store/api";
import { useModalStore } from "@/store/modals";
import { useFormStore } from "@/store/forms";
import { changeTooltipColor } from "@/utils/buttons";

export default {
  name: "JobApplicationActions",
  props: ["url", "item", "itemText", "props"],
  setup(props) {
    const authStore = useAuthStore();
    const apiStore = useApiStore();
    const modalStore = useModalStore();
    const formStore = useFormStore();

    const urlPDF = process.env.VUE_APP_BACKEND_URL + props.props.row.file_path;

    const detailItem = (item) => {
      modalStore.detailId = item.row.id;
      modalStore.modalToShow = "job application detail";
      modalStore.open("Dettaglio domanda di lavoro", "detail");
    };

    const refuseItem = async (item, itemText = null) => {
      const itemUrl = props.url + "/" + item.row.id;
      const response = await apiStore.select(itemUrl);
      modalStore.modalToShow = props.item;
      formStore.formToShow = "rejection reason";
      formStore.data = response.data;
      formStore.fill("edit", itemUrl);
      modalStore.title = "Rifiuta domanda di lavoro";
      modalStore.icon = "pi-times";
      modalStore.open(itemText, "warning");
    };

    return {
      authStore,
      changeTooltipColor,
      detailItem,
      refuseItem,
      urlPDF,
    };
  },
};
</script>
