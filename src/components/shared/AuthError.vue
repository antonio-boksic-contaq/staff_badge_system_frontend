<template>
  <Transition name="bounce">
    <ul
      v-if="errorStore.errors != null"
      class="text-danger font-bold text-center">
      <li v-for="error in errorStore.errors" :key="error">
        {{ error }}
      </li>
    </ul>
  </Transition>
</template>
<script>
import { useErrorsStore } from "@/store/errors";

export default {
  name: "AuthError",
  setup() {
    const errorStore = useErrorsStore();
    errorStore.errors = null;

    return { errorStore };
  },
};
</script>
