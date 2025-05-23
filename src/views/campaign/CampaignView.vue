<template>
  <default-page :icon="['fas', 'headset']">
    <template #title>Campagne</template>
    <template #subtitle> Tutte le campagne registrate nel sistema. </template>
    <template #content>
      <div class="card filters">
        <standard-action
          itemText="campagna"
          item="campaign"
          :url="url"
          @fetchData="fetchData($event)"
          @emptyTable="emptyRows"></standard-action>
        <div class="ml-0 mt-7 grid grid-cols-1 gap-7 md:grid-cols-12">
          <div class="md:col-start-1 md:col-end-3">
            <select-filter
              label="Anno"
              text="year"
              :selectedValue="new Date().getFullYear()"
              :url="url"
              :options="yearOptions"
              field="year"
              @emptyTable="emptyRows"
              @fetchData="fetchData($event)" />
          </div>
          <div class="md:col-start-3 md:col-end-8">
            <select-filter
              label="Mese"
              text="month"
              :selectedValue="[]"
              :multiple="true"
              :url="url"
              :options="monthOptions"
              :combo="false"
              field="month"
              @emptyTable="emptyRows"
              @fetchData="fetchData($event)" />
          </div>
          <div class="md:col-start-8 md:col-end-13">
            <select-filter
              label="Cliente"
              text="name"
              :selectedValue="[]"
              :url="url"
              :options="customerOptions"
              :combo="false"
              :multiple="true"
              field="customers"
              @emptyTable="emptyRows"
              @fetchData="fetchData($event)" />
          </div>
        </div>
      </div>
      <campaign-table
        :rows="rows"
        :url="url"
        @fetchData="fetchData($event)"
        @emptyTable="emptyRows" />
      <campaign-modal
        :url="url"
        @fetchData="fetchData($event)"
        @emptyTable="emptyRows" />
    </template>
  </default-page>
</template>

<script>
import { onBeforeMount, ref } from "vue";
import { useApiStore } from "@/store/api";
import { monthOptions } from "@/utils/filter";
import DefaultPage from "@/components/layouts/DefaultPage.vue";
import StandardAction from "@/components/actions/StandardAction.vue";
import CampaignModal from "@/components/modals/CampaignModal.vue";
import CampaignTable from "@/components/tables/CampaignTable.vue";
import SelectFilter from "@/components/actions/SelectFilter.vue";

export default {
  name: "CampaignView",
  components: {
    DefaultPage,
    CampaignTable,
    CampaignModal,
    StandardAction,
    SelectFilter,
  },
  setup() {
    const apiStore = useApiStore();
    apiStore.params = { year: new Date().getFullYear() };
    const url = process.env.VUE_APP_API_URL + "/campaigns";
    const customerOptions = ref([]);
    const yearOptions = ref([]);
    const rows = ref([]);

    onBeforeMount(async () => {
      apiStore.isLoading = true;
      const response = await apiStore.fetch(
        url + "?year=" + new Date().getFullYear()
      );
      yearOptions.value = await apiStore.fetch(
        process.env.VUE_APP_API_URL + "/campaigns/years"
      );
      customerOptions.value = await apiStore.fetch(
        process.env.VUE_APP_API_URL + "/customers"
      );
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

    return {
      customerOptions,
      emptyRows,
      fetchData,
      monthOptions,
      rows,
      url,
      yearOptions,
    };
  },
};
</script>
