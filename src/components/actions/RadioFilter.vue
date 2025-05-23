<template>
  <div class="col-start-1 col-end-12">
    <label :for="name" class="font-medium block mb-2"> {{ label }} </label>
  </div>
  <div class="flex h-full justify-between align-middle items-center p-2">
    <div class="radio-group">
      <input
        type="radio"
        :id="name + '_yes'"
        :name="name"
        value="1"
        class="radio-group-input"
        @click="filter" />
      <label class="radio-group-label" :for="name + '_yes'">
        Sì
        <span class="radio-group-button"> </span>
      </label>
    </div>
    <div class="radio-group">
      <input
        type="radio"
        :id="name + '_no'"
        :name="name"
        value="0"
        class="radio-group-input"
        @click="filter" />
      <label class="radio-group-label" :for="name + '_no'">
        No
        <span class="radio-group-button"> </span>
      </label>
    </div>
    <div class="radio-group">
      <input
        type="radio"
        :id="name + '_all'"
        :name="name"
        value="all"
        class="radio-group-input"
        checked
        @click="filter" />
      <label class="radio-group-label" :for="name + '_all'">
        Tutti
        <span class="radio-group-button"> </span>
      </label>
    </div>
  </div>
</template>
<script>
import { useApiStore } from "@/store/api";
import { filterRadioButton } from "@/utils/filter";

export default {
  name: "RadioFilter",
  props: ["label", "name", "url"],
  emits: ["changeColumn", "emptyTable", "fetchData"],
  setup(props, context) {
    const apiStore = useApiStore();

    const filter = async (e) => {
      apiStore.isLoading = true;
      context.emit("emptyTable", true);
      const response = await filterRadioButton(e, apiStore, props);
      context.emit("changeColumn", e.target.value);
      context.emit("fetchData", response);
    };

    return { filter };
  },
};
</script>
