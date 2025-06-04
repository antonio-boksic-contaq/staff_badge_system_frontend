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
      <span v-if="props.column.field === 'convalida'">
      <Button
      icon="pi pi-check"
      class="p-button-rounded p-button-success p-button-text text-center"
      v-tooltip.top="'CONVALIDA'"
      @click="convalidatePunch(props, itemTitle)"></Button>
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
import { useAuthStore } from "@/store/auth";
import { emptyState, paginationOptions, searchOptions } from "@/utils/tables";
import axios from "axios";

export default {
  name: "PunchTable",
  components: {
    ActionColumn,
    VueGoodTable,
    Confirm,
  },
  props: ["rows", "url", "request","notConvalidated"],
  emits: ["emptyTable", "fetchData"],
  setup(props, context) {
    const apiStore = useApiStore();
    const confirmStore = useConfirmStore();
        const modalStore = useModalStore();
                const authStore = useAuthStore();
    const actions = ["update", "delete", "restore","detail-modal"];
    const emptyTable = () => {
      context.emit("emptyTable", true);
    };

            let url = process.env.VUE_APP_API_URL + "/getAllPunches";


        const punches = ref([])

        const getAxiosHeaders = (token) => ({
      headers: {
        Authorization: "Bearer " + token,
        // "Content-Type": "multipart/form-data",
      },
    });

    onBeforeMount(async() => {
      console.log("STO MONTANDO PUNCH TABLE")
        if (props.notConvalidated === 1) {

          columns.value = [...columns.value, { label: "Convalida", field: "convalida", sortable: false, tdClass: 'text-center', } ]

          url += "?not-convalidated=1";

        } else {

          url += "?exactDate=" + modalStore.date;
        
        }

    // console.log("props.notconvalidated", props.notConvalidated)
      // console.log("STO MONTANDO PUNCHTABLEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
      if(props.notConvalidated !== 1){
        punches.value = await apiStore.fetch(url)
      } else {
        // console.log("STO NEL IF DI NOT CONVALIDATEDDDDDDDDDDDDDDDDDDDD")
        punches.value= await apiStore.fetch(url)
      }



      //  console.log("PUNCHESSSS", punches.value)

    }
    )

    const fetchData = (event) => {
      context.emit("fetchData", event);
    };

    const convalidatePunch = async  (props, itemTitle)=> {
      console.log("convalidate punch", props.row, itemTitle)
      const response = await axios.create(getAxiosHeaders(authStore.accessToken)).put(
              process.env.VUE_APP_API_URL + "/convalidate-punch",
               { id: props.row.id }
              );
            console.log("Risposta dal server:", response.data);
    }

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
      punches,
      convalidatePunch
    };
  },
};
</script>
