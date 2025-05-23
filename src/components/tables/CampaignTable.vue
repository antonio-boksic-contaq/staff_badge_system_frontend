<template>
  <vue-good-table
    :columns="columns"
    :rows="rows"
    :fixed-header="true"
    max-height="60rem"
    totalRecords
    :pagination-options="paginationOptions"
    :search-options="searchOptions"
    styleClass="vgt-table condensed">
    <template #emptystate>
      <div class="text-center text-4xl"><span v-html="emptyState"></span></div>
    </template>
    <template #table-column="props">
      <span
        v-if="props.column.field === 'actionsColumn'"
        v-tooltip.top="'Azioni'"
        class="text-center block">
        <i class="pi pi-th-large text-2xl"></i>
      </span>
    </template>
    <template #table-row="props">
      <span v-if="props.column.field === 'user.lastname'">
        {{ props.row.user.lastname }} {{ props.row.user.name }}
      </span>
      <span v-if="props.column.field === 'start_date'">
        {{ parseItDate(props.row.start_date) }}
      </span>
      <span v-if="props.column.field === 'actionsColumn'">
        <action-column
          :props="props"
          :url="url"
          :actions="actions"
          field="name"
          item="campaign" />
      </span>
    </template>
  </vue-good-table>
  <Confirm @fetchData="fetchData($event)" @emptyTable="emptyTable" />
</template>
<script>
import { VueGoodTable } from "vue-good-table-next";
import "vue-good-table-next/dist/vue-good-table-next.css";
import { ref } from "vue";

import Confirm from "@/components/shared/Confirm";
import ActionColumn from "@/components/shared/ActionColumn";
import { useApiStore } from "@/store/api";
import { emptyState, searchOptions, paginationOptions } from "@/utils/tables";
import { parseItDate } from "@/utils/date";

export default {
  name: "CampaignTable",
  props: ["rows", "url"],
  emits: ["emptyTable", "fetchData"],
  components: {
    ActionColumn,
    VueGoodTable,
    Confirm,
  },
  setup(props, context) {
    const apiStore = useApiStore();
    const actions = ["update", "delete", "restore", "detail-modal"];

    const emptyTable = () => {
      context.emit("emptyTable", true);
    };

    const fetchData = (event) => {
      context.emit("fetchData", event);
    };

    const columns = ref([
      { label: "ID", field: "id" },
      { label: "Nome", field: "name" },
      { label: "Utente", field: "user.lastname" },
      { label: "Tipo campagna", field: "campaign_type.description" },
      { label: "Cliente", field: "customer.name" },
      { label: "Data", field: "start_date" },
      {
        label: "Azioni",
        field: "actionsColumn",
        width: "12rem",
        sortable: false,
      },
    ]);

    return {
      actions,
      apiStore,
      columns,
      emptyState,
      emptyTable,
      fetchData,
      paginationOptions,
      parseItDate,
      searchOptions,
    };
  },
};
</script>
