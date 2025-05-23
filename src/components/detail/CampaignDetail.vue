<template>
  <div v-if="item !== null">
    <div class="md:grid md:grid-cols-12 md:gap-7">
      <div class="md:col-start-1 md:col-end-8">
        <h2 class="mb-5 uppercase text-black">
          <font-awesome-icon icon="headset" class="fa-fw text-info" />
          Dati campagna
        </h2>
        <div class="m-0 md:grid md:grid-cols-3 md:gap-7">
          <div class="col-start-1 col-end-2">
            <strong>ID</strong>
          </div>
          <div class="col-start-2 col-end-4">
            {{ item.id }}
          </div>
        </div>
        <div class="mx-0 mt-5 md:grid md:grid-cols-3 md:gap-7">
          <div class="col-start-1 col-end-2">
            <strong>Nome</strong>
          </div>
          <div class="col-start-2 col-end-4">
            {{ item.name }}
          </div>
        </div>
        <div class="mx-0 mt-5 md:grid md:grid-cols-3 md:gap-7">
          <div class="col-start-1 col-end-2">
            <strong>Data</strong>
          </div>
          <div class="col-start-2 col-end-4">
            {{
              item.end_date != null
                ? parseItDateTime(item.start_date) +
                  " - " +
                  parseItDateTime(item.end_date)
                : parseItDateTime(item.start_date)
            }}
          </div>
        </div>
        <div class="mx-0 mt-5 md:grid md:grid-cols-3 md:gap-7">
          <div class="col-start-1 col-end-2">
            <strong>Cliente</strong>
          </div>
          <div class="col-start-2 col-end-4">
            {{ item.customer.name }}
          </div>
        </div>
        <div class="mx-0 mt-5 md:grid md:grid-cols-3 md:gap-7">
          <div class="col-start-1 col-end-2">
            <strong>Tipo campagna</strong>
          </div>
          <div class="col-start-2 col-end-4">
            {{ item.campaign_type.description }}
          </div>
        </div>
        <div class="mx-0 mt-5 md:grid md:grid-cols-3 md:gap-7">
          <div class="col-start-1 col-end-2">
            <strong>Inbound</strong>
          </div>
          <div class="col-start-2 col-end-4">
            <font-awesome-icon
              icon="check"
              class="text-success"
              v-if="item.inbound == 1"></font-awesome-icon>
            <font-awesome-icon
              icon="times"
              class="text-danger"
              v-else></font-awesome-icon>
          </div>
        </div>
        <div class="mx-0 mt-5 md:grid md:grid-cols-3 md:gap-7">
          <div class="col-start-1 col-end-2">
            <strong>RPO</strong>
          </div>
          <div class="col-start-2 col-end-4">
            <font-awesome-icon
              icon="check"
              class="text-success"
              v-if="item.rpo == 1"></font-awesome-icon>
            <font-awesome-icon
              icon="times"
              class="text-danger"
              v-else></font-awesome-icon>
          </div>
        </div>
        <div class="mx-0 mt-5 md:grid md:grid-cols-3 md:gap-7">
          <div class="col-start-1 col-end-2">
            <strong>Fullfillment</strong>
          </div>
          <div class="col-start-2 col-end-4">
            <font-awesome-icon
              icon="check"
              class="text-success"
              v-if="item.fullfillment == 1"></font-awesome-icon>
            <font-awesome-icon
              icon="times"
              class="text-danger"
              v-else></font-awesome-icon>
          </div>
        </div>
        <div
          v-if="item.note !== null"
          class="mx-0 mt-5 md:grid md:grid-cols-3 md:gap-7">
          <div class="col-start-1 col-end-2">
            <strong>Note</strong>
          </div>
          <div class="col-start-2 col-end-4">
            {{ item.note }}
          </div>
        </div>
      </div>
      <div class="md:col-start-8 md:col-end-13">
        <h2 class="mb-5 uppercase text-black">
          <font-awesome-icon icon="paperclip" class="fa-fw text-info" />
          Allegati
        </h2>
        <div class="m-0 md:grid md:grid-cols-1 md:gap-7">
          <ul
            v-if="item.docs.length > 0"
            class="space-y-3 ml-7 text-gray-600 list-disc marker:text-blue-600">
            <li v-for="doc in item.docs" :key="doc.id">
              <a :href="urlApi + doc.path" target="_blank">{{
                doc.file_name
              }}</a>
            </li>
          </ul>
          <p v-else>Non ci sono allegati per questa campagna.</p>
        </div>
        <h2 class="my-5 uppercase text-black">
          <font-awesome-icon icon="list-check" class="fa-fw text-info" />
          Task
        </h2>
        <div class="relative overflow-x-auto">
          <table class="w-full text-left text-gray-500 dark:text-gray-400">
            <thead
              class="text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th>Descrizione</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody v-if="item.tasks.length > 0">
              <TransitionGroup appear name="scale-in">
                <tr v-for="task in item.tasks" :key="task.pivot.task_id">
                  <td>
                    <span
                      class="tags"
                      :class="
                        task.completed === 1 ? 'tags-success' : 'tags-warning'
                      ">
                      {{ task.description }}
                      <font-awesome-icon
                        :icon="task.completed === 1 ? 'check' : 'clock'"
                        class="text-white"></font-awesome-icon>
                    </span>
                  </td>
                  <td>
                    <font-awesome-icon
                      icon="check"
                      class="text-success"
                      v-if="task.completed == 1"></font-awesome-icon>
                    <font-awesome-icon
                      icon="times"
                      class="text-danger"
                      v-else></font-awesome-icon>
                  </td>
                  <td>
                    {{ task.date !== null ? parseItDate(task.date) : "" }}
                  </td>
                </tr>
              </TransitionGroup>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="4">Non ci sono elementi presenti</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useApiStore } from "@/store/api";
import { useModalStore } from "@/store/modals";
import { useLoadingStore } from "@/store/loadings";
import { onBeforeMount, ref } from "vue";
import { parseItDate, parseItDateTime } from "@/utils/date";

export default {
  name: "CampaignDetail",
  setup() {
    const apiStore = useApiStore();
    const modalStore = useModalStore();
    const loadingStore = useLoadingStore();
    const item = ref(null);
    const urlApi = process.env.VUE_APP_BACKEND_URL;

    onBeforeMount(async () => {
      loadingStore.load();
      item.value = await apiStore.fetch(
        process.env.VUE_APP_API_URL + "/campaigns/" + modalStore.detailId
      );
      loadingStore.stop();
    });

    return { item, parseItDate, parseItDateTime, urlApi };
  },
};
</script>
