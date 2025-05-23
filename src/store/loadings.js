import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", {
  state: () => ({
    isLoading: 0,
    calcHeight: 0,
  }),
  actions: {
    load() {
      this.isLoading = 1;
      this.calcHeight = document.documentElement.scrollHeight;
    },
    stop() {
      this.isLoading = 0;
      this.calcHeight = 0;
    },
  },
});
