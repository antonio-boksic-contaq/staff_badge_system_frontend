<template>
  <div class="col-start-1 col-end-12">
    <label :for="name" class="font-medium block mb-2"> {{ label }} </label>
  </div>
  <switch-checkbox
    :fieldName="name"
    css="mt-3"
    :value="value"
    :disabled="disabled"
    :id="name"
    @checkedValueChange="changeData($event)" />
</template>
<script>
import { ref, watch } from "vue";
import { useApiStore } from "@/store/api";
import { filterParams } from "@/utils/filter";
import SwitchCheckbox from "@/components/shared/SwitchCheckbox";

export default {
  name: "CheckboxFilter",
  components: { SwitchCheckbox },
  props: ["disabled", "label", "name", "url"],
  emits: ["changeColumn", "emptyTable", "fetchData"],
  setup(props, context) {
    const apiStore = useApiStore();

    const value = ref(false);

    const changeData = async (event) => {
      context.emit("emptyTable", true);
      value.value = event;
      const boolEvent = event ? 1 : 0;
      context.emit("changeColumn", boolEvent);
      const response = await filterParams(
        props.name,
        boolEvent,
        apiStore,
        props
      );
      context.emit("fetchData", response);
    };

    watch(
      () => props.disabled,
      (val) => {
        if (val == true) value.value = false;
      }
    );

    return { changeData, value };
  },
};
</script>
