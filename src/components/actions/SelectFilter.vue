<template>
  <div
    class="col-start-1"
    :class="combo === true ? 'md:col-end-12 col-end-10' : 'col-end-13'">
    <label :for="field" class="font-medium block mb-2"> {{ label }} </label>
    <vue-select
      :value="selectedValue"
      :label="text"
      :options="options"
      :multiple="multiple"
      :placeholder="placeholderValue"
      @selectedValueChange="changeData($event, field)"
      :field="field"></vue-select>
  </div>
</template>
<script>
import { filterParams } from "@/utils/filter";
import { useApiStore } from "@/store/api";
import { ref } from "vue";
import VueSelect from "@/components/shared/VueSelect.vue";

export default {
  name: "SelectFilter",
  components: {
    VueSelect,
  },
  emits: ["fetchData", "emptyTable", "enableCombo"],
  props: [
    "combo",
    "field",
    "label",
    "multiple",
    "placeholder",
    "options",
    "selectedValue",
    "text",
    "url",
  ],
  setup(props, context) {
    const apiStore = useApiStore();
    const disabled = ref(true);

    const placeholderValue =
      props.placeholder === undefined ? "Tutti" : props.placeholder;

    const emptyTable = () => {
      context.emit("emptyTable", true);
    };

    const fetchData = (event) => {
      context.emit("fetchData", event);
    };

    const changeData = async (event) => {
      if (props.url !== undefined) {
        apiStore.isLoading = true;
        context.emit("emptyTable", true);
        if (props.combo) {
          if (event.length > 1) context.emit("enableCombo", false);
          else context.emit("enableCombo", true);
        }
        if (event === 0 || event == null) {
          const response = await filterParams(props.field, [], apiStore, props);
          context.emit("fetchData", response);
        } else {
          const response = await filterParams(
            props.field,
            event,
            apiStore,
            props
          );
          context.emit("fetchData", response);
        }
      } else {
        context.emit("fetchData", event);
      }
    };

    return { changeData, disabled, emptyTable, fetchData, placeholderValue };
  },
};
</script>
