<template>
  <Transition name="bounce">
    <div
      class="rounded-md bg-danger p-3 shadow-lg mb-14 relative"
      v-if="errorStore.display">
      <button class="absolute top-3 right-5" @click="errorStore.hide">X</button>
      <ul>
        <li v-for="error in errorStore.errors" :key="error">
          {{ error }}
        </li>
      </ul>
    </div>
  </Transition>
</template>
<script>
import { useErrorsStore } from "@/store/errors";

export default {
  name: "Errors",
  setup() {
    const errorStore = useErrorsStore();

    return { errorStore };
  },
};
</script>
