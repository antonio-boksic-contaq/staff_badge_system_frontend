import { defineStore } from "pinia";

export const usePopupStore = defineStore("popup", {
  state: () => ({
    isOpen: 0,
    calcHeight: 0,
    title: null,
    icon: null,
    color: null,
    data: null,
  }),
  actions: {
    open() {
      this.isOpen = 1;
      this.calcHeight = document.documentElement.scrollHeight;
    },
    close() {
      this.isOpen = 0;
      this.calcHeight = 0;
      this.title = null;
      this.icon = null;
      this.color = null;
    },
  },
});
