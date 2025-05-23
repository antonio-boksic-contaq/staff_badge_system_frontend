<template>
  <Transition name="fade">
    <div
      v-if="loadingStore.isLoading"
      class="w-full absolute top-0 left-0 bottom-0 bg-black bg-opacity-60 z-max"
      :style="{ height: loadingStore.calcHeight - 1 + 'px' }">
      <div class="loading">
        <i class="pi pi-cog pi-spin text-primary text-9xl"></i>
      </div>
    </div>
  </Transition>
</template>
<script>
import { useLoadingStore } from "@/store/loadings";
export default {
  name: "Loading",
  setup() {
    const loadingStore = useLoadingStore();

    return { loadingStore };
  },
};
</script>
