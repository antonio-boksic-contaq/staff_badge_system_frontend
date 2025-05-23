<template>
  <default-page :icon="['fas', 'sliders']">
    <template #title>Tipo campagna</template>
    <template #subtitle>
      I tipi di campagna da poter associare alle campagne.
    </template>
    <template #content>
      <div class="card filters">
        <standard-action
          itemText="tipo campagna"
          item="campaign type"
          :url="url"
          @fetchData="fetchData($event)"
          @emptyTable="emptyRows"></standard-action>
      </div>
      <campaign-type-table
        :rows="rows"
        :url="url"
        @fetchData="fetchData($event)"
        @emptyTable="emptyRows" />
      <campaign-type-modal
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
import CampaignTypeModal from "@/components/modals/CampaignTypeModal.vue";
import CampaignTypeTable from "@/components/tables/CampaignTypeTable.vue";
export default {
  name: "CampaignTypeView",
  components: {
    DefaultPage,
    CampaignTypeTable,
    CampaignTypeModal,
    StandardAction,
  },
  setup() {
    const apiStore = useApiStore();
    const url = process.env.VUE_APP_API_URL + "/campaign-types";
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
