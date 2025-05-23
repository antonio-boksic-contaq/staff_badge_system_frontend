<template>
  <label :for="name" class="font-medium block mb-2"> Combo </label>
  <div :class="css">
    <switch-checkbox
      :fieldName="name"
      :value="false"
      :disabled="disabled"
      :id="name"
      @checkedValueChange="changeData($event)" />
  </div>
</template>
<script>
import { useApiStore } from "@/store/api";
import { filterParams } from "@/utils/filter";
import SwitchCheckbox from "@/components/shared/SwitchCheckbox";

export default {
  name: "MultipleComboCheckbox",
  props: ["css", "disabled", "name", "url"],
  emits: ["fetchData", "emptyTable"],
  components: { SwitchCheckbox },
  setup(props, context) {
    const apiStore = useApiStore();

    const changeData = async (event) => {
      apiStore.isLoading = true;
      context.emit("emptyTable", true);
      const value = event ? 1 : 0;
      const response = await filterParams(props.name, value, apiStore, props);
      context.emit("fetchData", response);
    };

    return { changeData };
  },
};
</script>
