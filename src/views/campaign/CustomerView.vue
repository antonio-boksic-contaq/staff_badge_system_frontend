<template>
  <default-page :icon="['fas', 'user-tie']">
    <template #title>Clienti</template>
    <template #subtitle> I clienti da poter associare alle campagne. </template>
    <template #content>
      <div class="card filters">
        <standard-action
          itemText="cliente"
          item="create customer"
          :url="url"
          @fetchData="fetchData($event)"
          @emptyTable="emptyRows"></standard-action>
      </div>
      <customer-table
        :rows="rows"
        :url="url"
        @fetchData="fetchData($event)"
        @emptyTable="emptyRows" />
      <customer-modal
        :url="url"
        @fetchData="fetchData($event)"
        @emptyTable="emptyRows" />
    </template>
  </default-page>
</template>

<script>
import { onBeforeMount, ref } from "vue";
import { useApiStore } from "@/store/api";
import DefaultPage from "@/components/layouts/DefaultPage.vue";
import StandardAction from "@/components/actions/StandardAction.vue";
import CustomerModal from "@/components/modals/CustomerModal.vue";
import CustomerTable from "@/components/tables/CustomerTable.vue";
export default {
  name: "CustomerView",
  components: {
    DefaultPage,
    CustomerTable,
    CustomerModal,
    StandardAction,
  },
  setup() {
    const apiStore = useApiStore();
    const url = process.env.VUE_APP_API_URL + "/customers";
    const rows = ref([]);
    onBeforeMount(async () => {
      apiStore.isLoading = true;
      const response = await apiStore.fetch(url);
      rows.value = response;
      apiStore.isLoading = false;
    });

    const emptyRows = () => {
      rows.value = [];
    };

    const fetchData = (event) => {
      rows.value = event;
      apiStore.isLoading = false;
    };

    return { emptyRows, fetchData, rows, url };
  },
};
</script>
