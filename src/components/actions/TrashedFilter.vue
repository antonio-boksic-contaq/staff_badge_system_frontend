<template>
  <div class="flex h-full justify-between align-middle items-center p-2">
    <div class="radio-group">
      <input
        type="radio"
        :id="idActive"
        :name="'trashed_' + field"
        value="0"
        class="radio-group-input"
        checked
        @click="filter" />
      <label class="radio-group-label" :for="idActive">
        Attivi
        <span class="radio-group-button"> </span>
      </label>
    </div>
    <div class="radio-group">
      <input
        type="radio"
        :id="idTrashed"
        :name="'trashed_' + field"
        value="2"
        class="radio-group-input"
        @click="filter" />
      <label class="radio-group-label" :for="idTrashed">
        Cancellati
        <span class="radio-group-button"> </span>
      </label>
    </div>
    <div class="radio-group">
      <input
        type="radio"
        :id="idAll"
        :name="'trashed_' + field"
        value="1"
        class="radio-group-input"
        @click="filter" />
      <label class="radio-group-label" :for="idAll">
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
  name: "TrashedFilter",
  props: ["url", "field"],
  emits: ["fetchData", "emptyTable"],
  setup(props, context) {
    const apiStore = useApiStore();

    const idActive =
      props.field === undefined ? "active" : "active_" + props.field;
    const idTrashed =
      props.field === undefined ? "trashed" : "trashed_" + props.field;
    const idAll = props.field === undefined ? "all" : "all_" + props.field;

    const filter = async (e) => {
      apiStore.isLoading = true;
      context.emit("emptyTable", true);
      const response = await filterRadioButton(e, apiStore, props);
      context.emit("fetchData", response);
    };

    return { filter, idActive, idAll, idTrashed };
  },
};
</script>
