<template>
  <default-action>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div class="md:col-start-1 col-end-2">
          <trashed-filter
            :field="field"
            :url="url"
            @fetchData="fetchData($event)"
            @emptyTable="emptyTable" />
        </div>
        <action-standard-buttons
          :url="url"
          :actionUrl="actionUrl"
          :item="item"
          :itemText="itemText" />
      </div>
    </template>
  </default-action>
</template>
<script>
import DefaultAction from "@/components/layouts/DefaultAction.vue";
import TrashedFilter from "@/components/actions/TrashedFilter.vue";
import ActionStandardButtons from "@/components/shared/ActionStandardButtons.vue";

export default {
  name: "StandardAction",
  components: {
    ActionStandardButtons,
    DefaultAction,
    TrashedFilter,
  },
  props: ["actionUrl", "field", "url", "item", "itemText"],
  emits: ["fetchData", "emptyTable"],
  setup(props, context) {
    const emptyTable = () => {
      context.emit("emptyTable", true);
    };

    const fetchData = (event) => {
      context.emit("fetchData", event);
    };

    return { fetchData, emptyTable };
  },
};
</script>
