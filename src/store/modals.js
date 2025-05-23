import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    isOpen: 0,
    calcHeight: 0,
    title: null,
    icon: null,
    color: null,
    modalToShow: null,
    detailId: null,
    size: null,
    item: null,
    date:null
  }),
  actions: {
    open(item, type) {
      this.isOpen = 1;
      this.calcHeight = document.documentElement.scrollHeight;
      if (type === "edit") {
        this.title = "Modifica " + item;
        this.color = "success";
        this.icon = "pi-pencil";
      } else if (type === "detail") {
        this.title = "Dettaglio " + item;
        this.color = "info";
        this.icon = "pi-search-plus";
      } else if (type === "warning") {
        this.color = "warning";
      } else {
        this.title = "Aggiungi " + item;
        this.color = "primary";
        this.icon = "pi-plus";
      }
    },
    close() {
      this.isOpen = 0;
      this.calcHeight = 0;
      this.title = null;
      this.icon = null;
      this.color = null;
      this.modalToShow = null;
      this.detailId = null;
      this.size = null;
      this.item = null;
      this.date = null;
    },
  },
});
