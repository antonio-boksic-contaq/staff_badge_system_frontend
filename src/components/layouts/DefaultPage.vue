<template>
  <loading></loading>
  <div v-if="authStore.isLoggedIn" class="flex grid">
    <div class="col-12">
      <h1 class="md:text-7xl text-6xl font-medium mb-3">
        <font-awesome-icon
          :icon="icon"
          class="fa-fw md:text-6xl text-5xl text-primary mr-2 font-semibold"></font-awesome-icon>
        <slot name="title"></slot>
      </h1>
      <p class="ml-2 mt-2">
        <slot name="subtitle"></slot>
      </p>
      <div class="card mt-5">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
  <user-update-password-modal
    :show="passwordModalStore.isOpen"
    @closeModal="closeModal" />
</template>

<script>
import { useAuthStore } from "@/store/auth";
import { usePasswordModalStore } from "@/store/password-modal";
import Loading from "@/components/shared/Loading.vue";
import UserUpdatePasswordModal from "@/components/modals/UserUpdatePasswordModal.vue";

export default {
  name: "DefaultPage",
  components: {
    Loading,
    UserUpdatePasswordModal,
  },
  props: ["icon"],
  setup() {
    const authStore = useAuthStore();
    const passwordModalStore = usePasswordModalStore();
    const closeModal = () => {
      passwordModalStore.isOpen = false;
    };
    return { authStore, closeModal, passwordModalStore };
  },
};
</script>
