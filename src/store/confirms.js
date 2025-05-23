import { defineStore } from "pinia";

export const useConfirmStore = defineStore("confirms", {
  state: () => ({
    isOpen: 0,
    calcHeight: 0,
    itemId: null,
    itemText: null,
    title: null,
    icon: null,
    color: null,
    route: null,
    type: null,
  }),
  getters: {
    confirmText: (state) => {
      if (state.type === "restore")
        return state.itemText === undefined
          ? "Sei sicuro di voler riattivare questo elemento"
          : "Sei sicuro di voler riattivare " + state.itemText;
      if (state.type === "delete")
        return state.itemText === undefined
          ? "Sei sicuro di voler cancellare questo elemento"
          : "Sei sicuro di voler cancellare " + state.itemText;
      if (state.type === "update") return state.itemText;
      if (state.type === null)
        return "Sei sicuro di voler confermare l'operazione?";
    },
  },
  actions: {
    async open(item, type, field, itemText = null) {
      if (itemText === null) this.itemText = await item.row[field];
      else this.itemText = itemText;
      if (isNaN(item)) this.itemId = await item.row.id;
      else this.itemId = item;
      if (type === "restore") {
        this.color = "warning";
        this.icon = "pi-undo";
        this.type = "restore";
        this.title =
          itemText !== null
            ? "Ripristina " + itemText
            : "Ripristina " + item.row[field];
      } else if (type === "info") {
        this.color = "info";
        this.type = "update";
        this.title = itemText;
      } else {
        this.color = "danger";
        this.icon = "pi-trash";
        this.type = "delete";
        this.title =
          itemText !== null
            ? "Cancella " + itemText
            : "Cancella " + item.row[field];
      }
      this.isOpen = 1;
      this.calcHeight = document.documentElement.scrollHeight;
    },
    close() {
      this.isOpen = 0;
      this.calcHeight = 0;
      this.itemId = null;
      this.itemText = null;
      this.route = null;
      this.type = null;
      this.color = null;
      this.icon = null;
      this.title = null;
    },
  },
});
