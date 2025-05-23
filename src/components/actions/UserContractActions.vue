<template>
  <div
    v-if="
      !Object.prototype.hasOwnProperty.call(props.row, 'deleted_at') &&
      authStore.user.permissions.includes('update user contract')
    "
    class="inline">
    <Button
      icon="pi pi-file-pdf"
      class="p-button-rounded p-button-secondary p-button-text mr-2 mb-2"
      v-tooltip.top="'Scarica PDF'"
      @click="downloadPDF"
      @mouseover="changeTooltipColor('secondary')" />
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
import { useLoadingStore } from "@/store/loadings";
import { changeTooltipColor } from "@/utils/buttons";
import { pdf } from "@/utils/axios";

export default {
  name: "UserContractActions",
  props: ["url", "item", "itemText", "props"],
  setup(props) {
    const authStore = useAuthStore();
    const apiStore = useApiStore();
    const loadingStore = useLoadingStore();
    const modalStore = useModalStore();
    const formStore = useFormStore();

    const urlPDF =
      process.env.VUE_APP_BACKEND_URL +
      "/api/user-contracts/" +
      props.props.row.id +
      "/pdf";

    const namePDF =
      "contratto_" +
      props.props.row.user.lastname +
      "_" +
      props.props.row.user.name +
      ".pdf";

    const contractType = {
      type:
        props.props.row.contract_type.id === 1 ? "employed" : "collaborators",
    };

    const downloadPDF = async () => {
      loadingStore.load();
      await pdf(authStore.accessToken, urlPDF, contractType, namePDF);
      loadingStore.stop();
    };

    const refuseItem = async (item, itemText = null) => {
      const itemUrl = props.url + "/" + item.row.id;
      const response = await apiStore.select(itemUrl);
      modalStore.modalToShow = "rejection reason";
      formStore.formToShow = "rejection reason";
      formStore.data = response.data;
      formStore.fill("edit", itemUrl);
      modalStore.title = "Rifiuta contratto";
      modalStore.icon = "pi-times";
      modalStore.open(itemText, "warning");
    };

    return {
      authStore,
      changeTooltipColor,
      downloadPDF,
      refuseItem,
      urlPDF,
    };
  },
};
</script>
