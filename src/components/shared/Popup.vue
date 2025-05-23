<template>
  <Transition name="fade">
    <div
      v-if="popupStore.isOpen"
      class="w-full absolute top-0 left-0 bottom-0 bg-black bg-opacity-70 z-1100"
      :style="{ height: popupStore.calcHeight + 'px' }"></div>
  </Transition>
  <!-- popup -->
  <Transition name="fade-from-top">
    <div
      v-if="popupStore.isOpen"
      class="popup-container bg-white shadow-lg z-1200"
      :class="size">
      <!-- popup header -->
      <div class="popup-header h-20 p-3 flex justify-between items-center">
        <h2 :class="'text-' + popupStore.color" class="ml-4">
          <i class="pi text-2xl fw-bold" :class="popupStore.icon"></i>
          {{ popupStore.title }}
        </h2>
        <Button
          icon="pi pi-times"
          @click="close"
          class="p-button-rounded p-button-danger p-button-text absolute top-3 right-3"></Button>
      </div>
      <!-- popup body -->
      <div class="p-3">
        <slot name="content" />
      </div>
      <div
        class="popup-footer h-20 flex justify-center items-center w-100 border-t p-3">
        <slot name="actions" />
      </div>
    </div>
  </Transition>
</template>
<script>
import { usePopupStore } from "@/store/popups";
import { useErrorsStore } from "@/store/errors";

export default {
  name: "Popup",
  props: ["item", "size"],
  setup() {
    const popupStore = usePopupStore();
    const errorStore = useErrorsStore();

    const close = () => {
      popupStore.close();
      errorStore.hide();
    };
    return { close, errorStore, popupStore };
  },
};
</script>
