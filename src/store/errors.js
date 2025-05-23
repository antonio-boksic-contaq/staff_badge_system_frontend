import { defineStore } from "pinia";

export const useErrorsStore = defineStore("errors", {
  state: () => ({
    display: 0,
    errors: [],
    excelErrors: [],
  }),
  actions: {
    show(errors) {
      this.display = 1;
      this.errors = errors;
    },
    hide() {
      this.display = 0;
      this.errors = [];
    },
  },
});
