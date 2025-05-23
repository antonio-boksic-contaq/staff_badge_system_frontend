<template>
  <default-page icon="user">
    <template #title>Anagrafica utenti</template>
    <template #subtitle>
      La lista di tutti gli utenti registrati sul nostro sistema.
    </template>
    <template #content>
      <div class="card filters">
        <standard-action
          itemText="utente"
          item="user"
          :url="url"
          @fetchData="fetchData($event)"
          @emptyTable="emptyRows"></standard-action>
      </div>
      <user-table
        :rows="rows"
        :url="url"
        :request="request"
        @fetchData="fetchData($event)"
        @emptyTable="emptyRows" />
      <user-modal
        :url="url"
        @fetchData="fetchData($event)"
        @emptyTable="emptyRows" />
    </template>
  </default-page>
</template>

<script>
import { onBeforeMount, ref } from "vue";
import { useApiStore } from "@/store/api";
import { useFormStore } from "@/store/forms";
import DefaultPage from "@/components/layouts/DefaultPage.vue";
import UserTable from "@/components/tables/UserTable.vue";
import UserModal from "@/components/modals/UserModal.vue";
import StandardAction from "@/components/actions/StandardAction.vue";

export default {
  name: "UserView",
  components: {
    DefaultPage,
    StandardAction,
    UserModal,
    UserTable,
  },
  setup() {
    const apiStore = useApiStore();
    const formStore = useFormStore();
    const url = process.env.VUE_APP_API_URL + "/users";
    const request = "?show_operator=1";
    const rows = ref([]);
    formStore.formToShow = "user";

    onBeforeMount(async () => {
      apiStore.isLoading = true;
      rows.value = await apiStore.fetch(url);
    });

    const emptyRows = () => {
      rows.value = [];
    };

    const fetchData = (event) => {
      rows.value = event;
      apiStore.isLoading = false;
    };

    return { emptyRows, fetchData, request, rows, url };
  },
};
</script>
