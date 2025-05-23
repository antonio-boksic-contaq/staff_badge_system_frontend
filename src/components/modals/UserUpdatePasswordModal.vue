<template>
  <Transition name="fade">
    <div
      v-if="showModal && !loadingStore.isLoading"
      @click="close"
      class="w-full absolute top-0 left-0 bottom-0 bg-black bg-opacity-60 z-1000"
      :style="{ height: modalStore.calcHeight - 1 + 'px' }"></div>
  </Transition>
  <!-- modal -->
  <Transition name="fade-from-top">
    <div
      v-if="showModal"
      class="modal-container modal-md bg-white shadow-lg z-1100">
      <!-- modal header -->
      <div
        class="modal-header h-20 border-b p-3 flex justify-between items-center">
        <h2 class="text-success ml-4">
          <i class="pi text-2xl fw-bold pi-key"></i>
          Aggiorna password
        </h2>
        <Button
          icon="pi pi-times"
          @click="close"
          class="p-button-rounded p-button-danger p-button-text absolute top-3 right-3"></Button>
      </div>
      <!-- modal body -->
      <div class="p-5 modal-content">
        <user-update-password-form :url="url" />
      </div>
    </div>
  </Transition>
</template>
<script>
import { ref, watch } from "vue";
import { useAuthStore } from "@/store/auth";
import { useModalStore } from "@/store/modals";
import { useLoadingStore } from "@/store/loadings";
import { useErrorsStore } from "@/store/errors";
import { useFormStore } from "@/store/forms";
import UserUpdatePasswordForm from "@/components/forms/UserUpdatePasswordForm.vue";

export default {
  name: "UserUpdatePasswordModal",
  props: ["show"],
  emits: ["closeModal"],
  components: {
    UserUpdatePasswordForm,
  },
  setup(props, context) {
    const loadingStore = useLoadingStore();
    const errorStore = useErrorsStore();
    const formStore = useFormStore();
    const modalStore = useModalStore();
    const authStore = useAuthStore();
    const showModal = ref(props.show);

    watch(
      () => props.show,
      (value) => (showModal.value = value)
    );

    const url =
      process.env.VUE_APP_API_URL +
      "/users/" +
      authStore.user.id +
      "/update-password";

    const close = () => {
      showModal.value = false;
      formStore.empty();
      errorStore.hide();
      context.emit("closeModal", true);
    };

    return {
      close,
      formStore,
      loadingStore,
      modalStore,
      showModal,
      url,
    };
  },
};
</script>
