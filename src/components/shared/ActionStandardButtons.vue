<template>
  <div class="md:col-end-7 col-span-3">
    <div
      class="md:text-right mobile-only:flex mobile-only:justify-between mobile-only:w-full">
      <Button
        v-if="
          authStore.user.permissions.includes('create ' + item) ||
          authStore.user.permissions.includes(item)
        "
        icon="pi pi-plus"
        class="p-button-rounded p-button-primary p-button-text mr-3"
        :label="'Aggiungi ' + itemText"
        @click="openModal"></Button>
      <Button
        icon="pi pi-file-excel text-3xl"
        class="p-button-rounded p-button-success p-button-text mr-2"
        @mouseover="changeTooltipColor('success')"
        v-tooltip.top="'Scarica'"
        @click="apiStore.export(url, fileName)" />
    </div>
  </div>
</template>
<script>
import { useModalStore } from "@/store/modals";
import { useApiStore } from "@/store/api";
import { useFormStore } from "@/store/forms";
import { useAuthStore } from "@/store/auth";
import { changeTooltipColor } from "@/utils/buttons";

export default {
  name: "ActionStandardButtons",
  props: ["actionUrl", "url", "item", "itemText"],
  setup(props) {
    const modalStore = useModalStore();
    const formStore = useFormStore();
    const apiStore = useApiStore();
    const authStore = useAuthStore();
    const urlModal =
      props.actionUrl === undefined ? props.url : props.actionUrl;
    const fileName = props.itemText.split(" ").join("_");

    const openModal = () => {
      modalStore.open(props.itemText, "add");
      formStore.formToShow = props.item;
      modalStore.modalToShow = props.item;
      formStore.fill("add", urlModal);
    };
    return { apiStore, authStore, changeTooltipColor, fileName, openModal };
  },
};
</script>
