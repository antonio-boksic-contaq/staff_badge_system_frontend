<template>
  <Modal>
    <template #content>
      <task-form
        :url="url"
        @emptyTable="emptyTable"
        @fetchData="fetchData($event)" />
    </template>
  </Modal>
</template>
<script>
import Modal from "@/components/shared/Modal.vue";
import TaskForm from "@/components/forms/TaskForm.vue";

export default {
  name: "TaskModal",
  props: ["url"],
  emits: ["emptyTable", "fetchData"],
  components: {
    TaskForm,
    Modal,
  },
  setup(props, context) {
    const emptyTable = () => {
      context.emit("emptyTable", true);
    };

    const fetchData = (event) => {
      context.emit("fetchData", event);
    };

    return { emptyTable, fetchData };
  },
};
</script>
