<template>
  <Transition name="fade">
    <div
      v-if="modalStore.isOpen && !loadingStore.isLoading"
      @click="close"
      class="w-full absolute top-0 left-0 bottom-0 bg-black bg-opacity-60 z-1000"
      :style="{ height: modalStore.calcHeight - 1 + 'px' }"></div>
  </Transition>
  <!-- modal -->
  <Transition name="fade-from-top">
    <div
      v-if="modalStore.isOpen"
      class="modal-container bg-white shadow-lg z-1100"
      :class="modalStore.size || modalSize + ' ' + modalStore.color">
      <!-- modal header -->
      <div
        class="modal-header h-20 border-b p-3 flex justify-between items-center">
        <h2 :class="'text-' + modalStore.color" class="ml-4">
          <i class="pi text-2xl fw-bold" :class="modalStore.icon"></i>
          {{ modalStore.title }}
        </h2>
        <Button
          icon="pi pi-times"
          @click="close"
          class="p-button-rounded p-button-danger p-button-text absolute top-3 right-3"></Button>
      </div>
      <!-- modal body -->
      <div
        class="p-5 modal-content"
        :class="
          modalSize !== undefined && modalSize.includes('h-full') ? 'h-2/4' : ''
        "
        :style="
          modalSize !== undefined && modalSize.includes('h-full')
            ? 'overflow-y: unset'
            : ''
        ">
        <slot name="content" />
      </div>
    </div>
  </Transition>
</template>
<script>
import { ref, watch } from "vue";
import { useModalStore } from "@/store/modals";
import { useLoadingStore } from "@/store/loadings";
import { useErrorsStore } from "@/store/errors";
import { useFormStore } from "@/store/forms";

export default {
  name: "Modal",
  props: ["item", "size"],
  setup(props) {
    const modalStore = useModalStore();
    const loadingStore = useLoadingStore();
    const errorStore = useErrorsStore();
    const formStore = useFormStore();
    const modalSize = ref(
      modalStore.size === null
        ? props.size === null
          ? "modal-md"
          : props.size
        : modalStore.size
    );

    watch(
      () => props.size,
      (value) => (modalSize.value = value)
    );

    const close = () => {
      modalStore.close();
      formStore.empty();
      errorStore.hide();
    };
    return { close, errorStore, loadingStore, modalSize, modalStore };
  },
};
</script>
