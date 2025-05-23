<template>
  <vue-good-table
    :columns="columns"
    :rows="punches"
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
      <span v-if="props.column.field === 'actionsColumn'">
        <action-column
          :props="props"
          :url="url"
          :request="request"
          :actions="actions"
          field="name"
          item="user" />
      </span>
    </template>
  </vue-good-table>
  <Confirm @fetchData="fetchData($event)" @emptyTable="emptyTable" />
</template>
<script>
import { VueGoodTable } from "vue-good-table-next";
import "vue-good-table-next/dist/vue-good-table-next.css";
import { ref, onBeforeMount } from "vue";

import Confirm from "@/components/shared/Confirm";
import ActionColumn from "@/components/shared/ActionColumn";
import { useApiStore } from "@/store/api";
import { useConfirmStore } from "@/store/confirms";
import { useModalStore } from "@/store/modals";
import { emptyState, paginationOptions, searchOptions } from "@/utils/tables";

export default {
  name: "PunchTable",
  components: {
    ActionColumn,
    VueGoodTable,
    Confirm,
  },
  props: ["rows", "url", "request"],
  emits: ["emptyTable", "fetchData"],
  setup(props, context) {
    const apiStore = useApiStore();
    const confirmStore = useConfirmStore();
        const modalStore = useModalStore();
    const actions = ["update", "delete", "restore","detail-modal"];
    const emptyTable = () => {
      context.emit("emptyTable", true);
    };

        const url =  process.env.VUE_APP_API_URL + "/getAllPunches" + "?exactDate=" + modalStore.date;
        const punches = ref([])

    onBeforeMount(async() => {

    
      console.log("STO MONTANDO PUNCHTABLEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
       punches.value = await apiStore.fetch(url)

       console.log("PUNCHESSSS", punches.value)

    }
    )

    const fetchData = (event) => {
      context.emit("fetchData", event);
    };

    const columns = ref([
    //   { label: "Cognome", field: "surname" },
        { label: "Nome", field: "name" },
         { label: "Cognome", field: "surname" },
        { label: "Entrata", field: "check_in" },
        { label: "Uscita", field: "check_out" },
    ]);

    return {
      actions,
      apiStore,
      columns,
      confirmStore,
      emptyState,
      emptyTable,
      fetchData,
      paginationOptions,
      searchOptions, 
      punches
    };
  },
};
</script>
