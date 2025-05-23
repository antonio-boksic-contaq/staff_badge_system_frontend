<template>
  <div
    v-if="
      Object.prototype.hasOwnProperty.call(props.row, 'deleted_at') &&
      props.row.deleted_at !== null
    ">
    <Button
      v-if="
        actions.includes('restore') &&
        authStore.user.permissions.includes('restore ' + item)
      "
      icon="pi pi-undo"
      class="p-button-rounded p-button-warning p-button-text mr-2 mb-2"
      v-tooltip.top="'Recupera'"
      @mouseover="changeTooltipColor('warning')"
      @click="restoreItem(props, itemTitle)"></Button>
  </div>
  <div class="inline" v-else>
    <Button
      v-if="
        actions.includes('update') &&
        authStore.user.role === 'Admin'
      "
      icon="pi pi-pencil"
      class="p-button-rounded p-button-success p-button-text mr-2 mb-2"
      v-tooltip.top="'Modifica'"
      @mouseover="changeTooltipColor('success')"
      @click="editItem(props, itemTitle)"></Button>

    <Button
      v-if="
        actions.includes('detail-modal') &&
       authStore.user.role === 'Admin'
      "
      icon="pi pi-search"
      class="p-button-rounded p-button-info p-button-text mr-2 mb-2"
      v-tooltip.top="'Dettaglio'"
      @mouseover="changeTooltipColor('info')"
      @click="detailItem(props, itemTitle, item)"></Button>

    <router-link
      v-if="
        actions.includes('detail-page') &&
        authStore.user.role === 'Admin'
      "
      :to="{
        name: detailPage,
        params: { id: props.row.id },
      }">
      <Button
        icon="pi pi-search"
        class="p-button-rounded p-button-info p-button-text mr-2 mb-2"
        @mouseover="changeTooltipColor('info')"
        v-tooltip.top="'Dettaglio'"></Button>
    </router-link>

    <Button
      v-if="
        actions.includes('delete') &&
       authStore.user.role === 'Admin'
      "
      icon="pi pi-trash"
      class="p-button-rounded p-button-danger p-button-text mr-2 mb-2"
      v-tooltip.top="'Cancella'"
      @mouseover="changeTooltipColor('danger')"
      @click="deleteItem(props, itemTitle)"></Button>
  </div>
</template>
<script>
import { useAuthStore } from "@/store/auth";
import { useApiStore } from "@/store/api";
import { useModalStore } from "@/store/modals";
import { useConfirmStore } from "@/store/confirms";
import { useFormStore } from "@/store/forms";
import { changeTooltipColor } from "@/utils/buttons";

export default {
  name: "ActionColumn",
  props: [
    "actions",
    "actionUrl",
    "detail-page",
    "field",
    "item",
    "itemText",
    "props",
    "request",
    "url",
  ],
  setup(props) {
    const authStore = useAuthStore();
    const apiStore = useApiStore();
    const confirmStore = useConfirmStore();
    const modalStore = useModalStore();
    const formStore = useFormStore();

    const itemTitle = props.itemText !== undefined ? props.itemText : null;
    const url = props.actionUrl === undefined ? props.url : props.actionUrl;

    const editItem = async (rowItem, itemText = null) => {
      formStore.formToShow = props.item;
      modalStore.modalToShow = props.item;
      const itemUrl = url + "/" + rowItem.row.id;
      const selectUrl =
        props.request !== undefined ? itemUrl + props.request : itemUrl;
      const response = await apiStore.select(selectUrl);
      formStore.data = response.data;
      formStore.fill("edit", itemUrl);
      const itemValue = itemText !== null ? itemText : rowItem.row[props.field];
      modalStore.open(itemValue, "edit");
    };

    const deleteItem = (rowItem, itemText = null) => {
      confirmStore.route = url;
      confirmStore.open(rowItem, "delete", props.field, itemText);
    };

    const restoreItem = (rowItem, itemText = null) => {
      confirmStore.route = url;
      confirmStore.open(rowItem, "restore", props.field, itemText);
    };

    const detailItem = (rowItem, itemText, modalToShow) => {
      const itemValue = itemText !== null ? itemText : rowItem.row[props.field];
      modalStore.detailId = rowItem.row.id;
      formStore.formToShow = null;
      modalStore.modalToShow = modalToShow;
      modalStore.open(itemValue, "detail");
    };

    return {
      authStore,
      changeTooltipColor,
      editItem,
      detailItem,
      deleteItem,
      itemTitle,
      restoreItem,
    };
  },
};
</script>
