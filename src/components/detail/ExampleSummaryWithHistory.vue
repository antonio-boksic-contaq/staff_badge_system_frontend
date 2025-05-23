<template>
  <div v-if="item !== null" class="grid md:grid-cols-2 md:gap-x-7 p-4">
    <div>
      <h2 class="mb-5 uppercase">
        <i class="pi pi-copy mr-1 text-3xl"></i>
        Attuale
      </h2>
      <div class="mb-3 grid-cols-1 md:grid md:grid-cols-3 md:gap-x-7">
        <div class="col-start-1 col-end-2">
          <strong>Utente</strong>
        </div>
        <div class="col-start-2 col-end-4">
          {{ item.causer.name }}
        </div>
      </div>
      <div class="mb-3 md:grid md:grid-cols-3 md:gap-x-7">
        <div class="col-start-1 col-end-2">
          <strong>Sede</strong>
        </div>
        <div class="col-start-2 col-end-4">
          {{ item.headquarter.name }}
        </div>
      </div>
      <div class="mb-3 md:grid md:grid-cols-3 md:gap-x-7">
        <div class="col-start-1 col-end-2">
          <strong>Settore</strong>
        </div>
        <div class="col-start-2 col-end-4">
          {{ item.item_sector.description }}
        </div>
      </div>
      <div class="mb-3 md:grid md:grid-cols-3 md:gap-x-7">
        <div class="col-start-1 col-end-2">
          <strong>Classificazione</strong>
        </div>
        <div class="col-start-2 col-end-4">
          {{ item.item_classification.description }}
        </div>
      </div>
      <div class="mb-3 md:grid md:grid-cols-3 md:gap-x-7">
        <div class="col-start-1 col-end-2">
          <strong>Mansione</strong>
        </div>
        <div class="col-start-2 col-end-4">
          {{ item.item_duty.description }}
        </div>
      </div>
      <div class="mb-3 md:grid md:grid-cols-3 md:gap-x-7">
        <div class="col-start-1 col-end-2">
          <strong>Categoria protetta</strong>
        </div>
        <div class="col-start-2 col-end-4">
          <span v-if="item.protected_category === 1"
            ><i class="pi pi-check text-success"></i
          ></span>
          <span v-else><i class="pi pi-times text-danger"></i></span>
        </div>
      </div>

      <div class="mb-3 md:grid md:grid-cols-3 md:gap-x-7">
        <div class="col-start-1 col-end-2">
          <strong>Inizio</strong>
        </div>
        <div class="col-start-2 col-end-4">
          {{ parseItDate(item.start_date) }}
        </div>
      </div>
      <div class="mb-3 md:grid md:grid-cols-3 md:gap-x-7">
        <div class="col-start-1 col-end-2">
          <strong>Fine</strong>
        </div>
        <div class="col-start-2 col-end-4">
          {{ item.end_date === null ? "" : parseItDate(item.end_date) }}
        </div>
      </div>
      <div v-if="item.item_type.id === 2">
        <div class="mb-3 md:grid md:grid-cols-3 md:gap-x-7">
          <div class="col-start-1 col-end-2">
            <strong>Paga oraria</strong>
          </div>
          <div class="col-start-2 col-end-4">{{ item.hourly_pay }} €</div>
        </div>
      </div>
      <div v-else>
        <div class="mb-3 md:grid md:grid-cols-3 md:gap-x-7">
          <div class="col-start-1 col-end-2">
            <strong>R.A.L.</strong>
          </div>
          <div class="col-start-2 col-end-4">{{ item.gap }} €</div>
        </div>
        <div class="mb-3 md:grid md:grid-cols-3 md:gap-x-7">
          <div class="col-start-1 col-end-2">
            <strong>Contingenza</strong>
          </div>
          <div class="col-start-2 col-end-4">{{ item.contingency }}</div>
        </div>
        <div class="mb-3 md:grid md:grid-cols-3 md:gap-x-7">
          <div class="col-start-1 col-end-2">
            <strong>EDR</strong>
          </div>
          <div class="col-start-2 col-end-4">{{ item.edr }}</div>
        </div>
        <div class="mb-3 md:grid md:grid-cols-3 md:gap-x-7">
          <div class="col-start-1 col-end-2">
            <strong>ERS</strong>
          </div>
          <div class="col-start-2 col-end-4">{{ item.ers }}</div>
        </div>
        <div class="mb-3 md:grid md:grid-cols-3 md:gap-x-7">
          <div class="col-start-1 col-end-2">
            <strong>Mensilità</strong>
          </div>
          <div class="col-start-2 col-end-4">
            {{ item.monthly_payment }}
          </div>
        </div>
      </div>
    </div>
    <div>
      <h2 class="mb-5 uppercase">
        <i class="pi pi-list mr-1 text-3xl"></i>
        Storico
      </h2>
      <div class="relative overflow-x-auto">
        <table class="w-full text-left text-gray-500 dark:text-gray-400">
          <thead
            class="text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th>Data inizio</th>
              <th>Data fine</th>
              <th>Tipologia</th>
              <th>Mansione</th>
            </tr>
          </thead>
          <tbody v-if="allItems.length > 0">
            <TransitionGroup appear name="scale-in">
              <tr v-for="item in allItems" :key="item.id">
                <td>field</td>
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
</template>
<script>
import { parseItDate } from "@/utils/date";
import { useApiStore } from "@/store/api";
import { useModalStore } from "@/store/modals";
import { useLoadingStore } from "@/store/loadings";
import { onBeforeMount, ref } from "vue";

export default {
  name: "ExampleSummary",
  setup() {
    const apiStore = useApiStore();
    const modalStore = useModalStore();
    const loadingStore = useLoadingStore();
    const item = ref(null);
    const allItems = ref([]);

    onBeforeMount(async () => {
      loadingStore.load();
      item.value = await apiStore.fetch(
        process.env.VUE_APP_API_URL + "/url/" + modalStore.detailId
      );
      allItems.value = await apiStore.fetch(
        process.env.VUE_APP_API_URL + "/url?causer_id=" + item.value.causer.id
      );
      loadingStore.stop();
    });

    return { allItems, item, parseItDate };
  },
};
</script>
