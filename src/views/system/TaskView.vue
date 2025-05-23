<template>
  <default-page :icon="['fas', 'list-check']">
    <template #title>Task</template>
    <template #subtitle>
      La lista dei task da poter associare ad uno startup.
    </template>
    <template #content>
      <div class="card filters">
        <standard-action
          itemText="task"
          item="task"
          :url="url"
          @fetchData="fetchData($event)"
          @emptyTable="emptyRows"></standard-action>
      </div>
      <task-table
        :rows="rows"
        :url="url"
        @fetchData="fetchData($event)"
        @emptyTable="emptyRows" />
      <task-modal
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
import TaskModal from "@/components/modals/TaskModal.vue";
import TaskTable from "@/components/tables/TaskTable.vue";
export default {
  name: "TaskView",
  components: {
    DefaultPage,
    TaskTable,
    TaskModal,
    StandardAction,
  },
  setup() {
    const apiStore = useApiStore();
    const url = process.env.VUE_APP_API_URL + "/tasks";
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
