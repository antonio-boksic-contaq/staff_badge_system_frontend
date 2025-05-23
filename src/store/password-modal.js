import { defineStore } from "pinia";

export const usePasswordModalStore = defineStore("password-modal", {
  state: () => ({
    isOpen: 0,
    calcHeight: 0,
  }),
  actions: {
    open() {
      this.isOpen = 1;
      this.calcHeight = document.documentElement.scrollHeight;
    },
    close() {
      this.isOpen = 0;
      this.calcHeight = 0;
    },
  },
});
