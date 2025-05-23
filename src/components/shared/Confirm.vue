<template>
  <Transition name="fade">
    <div
      v-if="confirmStore.isOpen"
      @click="close"
      class="w-full absolute top-0 left-0 bottom-0 bg-black bg-opacity-60 z-1000"
      :style="{ height: confirmStore.calcHeight + 'px' }"></div>
  </Transition>
  <!-- confirm -->
  <Transition name="fade-from-top">
    <div
      v-if="confirmStore.isOpen"
      class="confirm-container bg-white rounded-lg shadow-lg z-1000">
      <!-- confirm header -->
      <div class="confirm-header h-20 p-3 flex justify-between items-center">
        <h2 :class="'text-' + confirmStore.color">
          <i class="pi text-2xl fw-bold" :class="confirmStore.icon"></i>
          {{ confirmStore.title }}
        </h2>
      </div>
      <!-- confirm body -->
      <div class="py-10 px-5">
        <p>{{ confirmStore.confirmText }}</p>
      </div>
      <div
        class="confirm-footer h-20 flex justify-center items-center w-100 p-3">
        <Button
          icon="pi pi-times mt-1"
          label="Annulla"
          class="p-button-secondary p-button-text font-semibold"
          @click="confirmStore.close" />

        <Button
          :icon="
            confirmStore.type === 'update'
              ? 'pi pi-check mt-1'
              : 'pi ' + confirmStore.icon + ' mt-1'
          "
          label="Conferma"
          class="p-button-text font-semibold"
          :class="'p-button-' + confirmStore.color"
          @click="confirm" />
      </div>
    </div>
  </Transition>
</template>
<script>
import { useConfirmStore } from "@/store/confirms";
import { useApiStore } from "@/store/api";

export default {
  name: "Confirm",
  props: ["fetchUrl", "preventFetch"],
  emits: ["emptyTable", "fetchData"],
  setup(props, context) {
    const confirmStore = useConfirmStore();
    const apiStore = useApiStore();
    const close = () => {
      confirmStore.close();
    };

    const confirm = async () => {
      if (confirmStore.type === "restore")
        await apiStore.restore(confirmStore.route, confirmStore.itemId);
      if (confirmStore.type === "update")
        await apiStore.update(confirmStore.route, new FormData());
      if (confirmStore.type === "delete")
        await apiStore.delete(confirmStore.route, confirmStore.itemId);
      apiStore.isLoading = true;
      context.emit("emptyTable", true);
      if (props.preventFetch === undefined) {
        if (props.fetchUrl !== undefined) {
          const response = await apiStore.fetch(
            props.fetchUrl,
            apiStore.params
          );
          context.emit("fetchData", response);
        } else {
          const response = await apiStore.fetch(
            confirmStore.route,
            apiStore.params
          );
          context.emit("fetchData", response);
        }
      } else {
        context.emit("fetchData", true);
      }
      confirmStore.close();
      apiStore.isLoading = false;
    };

    return { confirmStore, close, confirm };
  },
};
</script>
