import { defineStore } from "pinia";

export const useFormStore = defineStore("form", {
  state: () => ({
    method: null,
    id: null,
    route: null,
    action: null,
    color: null,
    data: null,
    formToShow: null,
  }),
  actions: {
    fill(type, route) {
      if (type === "edit") {
        this.method = "put";
        this.id = "frmEdit";
        this.action = "update";
        this.color = "success";
      } else {
        this.method = "post";
        this.id = "frmAdd";
        this.action = "store";
        this.color = "primary";
      }
      this.route = route;
    },
    empty() {
      this.method = null;
      this.id = null;
      this.route = null;
      this.action = null;
      this.color = null;
      this.data = null;
      this.formToShow = null;
    },
  },
});
