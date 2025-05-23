<template>
  <div v-if="item !== null">
    <div class="m-0 md:grid md:grid-cols-3 md:gap-7">
      <div class="col-start-1 col-end-2">
        <strong>Nome</strong>
      </div>
      <div class="col-start-2 col-end-4">
        {{ item.name }}
      </div>
    </div>
    <div class="mx-0 mt-5 md:grid md:grid-cols-3 md:gap-7">
      <div class="col-start-1 col-end-2">
        <strong>Cognome</strong>
      </div>
      <div class="col-start-2 col-end-4">
        {{ item.lastname }}
      </div>
    </div>
    <div class="mx-0 mt-5 md:grid md:grid-cols-3 md:gap-7">
      <div class="col-start-1 col-end-2">
        <strong>Email</strong>
      </div>
      <div class="col-start-2 col-end-4">
        {{ item.email }}
      </div>
    </div>
    <div class="mx-0 mt-5 md:grid md:grid-cols-3 md:gap-7">
      <div class="col-start-1 col-end-2">
        <strong>Telefono</strong>
      </div>
      <div class="col-start-2 col-end-4">
        {{ item.telephone }}
      </div>
    </div>
    <div class="mx-0 mt-5 md:grid md:grid-cols-3 md:gap-7">
      <div class="col-start-1 col-end-2">
        <strong>Competenze</strong>
      </div>
      <div class="col-start-2 col-end-4">
        <span v-for="rel in item.rels" :key="rel.id" class="tags tags-primary">
          {{ rel.description }}
        </span>
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
</template>
<script>
import { parseItDate } from "@/utils/date";
import { useApiStore } from "@/store/api";
import { useModalStore } from "@/store/modals";
import { useLoadingStore } from "@/store/loadings";
import { onBeforeMount, ref } from "vue";

export default {
  name: "ExampleSummaryWithRelationship",
  setup() {
    const apiStore = useApiStore();
    const modalStore = useModalStore();
    const loadingStore = useLoadingStore();
    const item = ref(null);

    onBeforeMount(async () => {
      loadingStore.load();
      item.value = await apiStore.fetch(
        process.env.VUE_APP_API_URL + "/url/" + modalStore.detailId
      );
      loadingStore.stop();
    });

    return { item, parseItDate };
  },
};
</script>
