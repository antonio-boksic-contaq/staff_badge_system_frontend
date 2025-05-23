<template>
  <v-select
    v-model="selectedValue"
    :reduce="(element) => element.id"
    :multiple="multiple"
    :options="fetchedData"
    placeholder="Scrivi per cercare un elemento..."
    :label="label"
    transition="slide-down"
    @search="fetchOptions">
    <template #no-options>Non ci sono opzioni disponibili</template>
  </v-select>
  <input type="hidden" v-model="selectedValue" :id="field" :name="field" />
</template>
<script>
import { ref, watch } from "vue";
import { useAuthStore } from "@/store/auth";
import { useFormStore } from "@/store/forms";
import { get } from "@/utils/axios";

export default {
  name: "AutocompleteSelect",
  props: [
    "apiRoute",
    "field",
    "formDataField",
    "label",
    "multiple",
    "options",
    "textValue",
    "value",
  ],
  emits: ["selectedValueChange"],
  setup(props, context) {
    const authStore = useAuthStore();
    const formStore = useFormStore();
    const selectedValue = ref(props.value);
    const fetchedData =
      formStore.data !== null
        ? ref(Array(formStore.data[props.formDataField]))
        : ref([]);
    watch(selectedValue, (selectedValue, oldValue) => {
      if (selectedValue != oldValue) {
        context.emit("selectedValueChange", selectedValue);
      }
    });

    const fetchOptions = async (search, loading) => {
      if (search.length >= 2) {
        loading(true);
        const response = await get(
          authStore.accessToken,
          process.env.VUE_APP_API_URL +
            props.apiRoute +
            "?" +
            props.label +
            "=" +
            search
        );
        fetchedData.value = response.data;
        loading(false);
      }
    };

    return { fetchedData, fetchOptions, selectedValue };
  },
};
</script>
