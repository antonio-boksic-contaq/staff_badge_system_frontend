<template>
  <div :id="id" :class="css">
    <input-switch
      v-model="switchValue"
      class="mt-1"
      :id="id"
      :disabled="disabled" />
    <input type="hidden" :name="fieldName" v-model="fieldValue" />
  </div>
</template>
<script>
import { useApiStore } from "@/store/api";
import { ref, watch } from "vue";

export default {
  name: "SwitchCheckbox",
  props: ["css", "disabled", "fieldName", "id", "value"],
  emits: ["checkedValueChange"],
  setup(props, context) {
    const apiStore = useApiStore();
    const switchValue = ref(props.value === 1 ? true : false);
    const fieldValue = ref(switchValue.value === true ? 1 : 0);

    watch(
      () => props.value,
      (value) => {
        switchValue.value = value;
      }
    );

    watch(switchValue, (switchValue, oldValue) => {
      if (switchValue != oldValue) {
        apiStore.isLoading = true;
        fieldValue.value = switchValue ? 1 : 0;
        context.emit("checkedValueChange", switchValue);
      }
    });

    return { fieldValue, switchValue };
  },
};
</script>
