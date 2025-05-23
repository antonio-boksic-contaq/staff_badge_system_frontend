import { defineStore } from "pinia";
import { excel, get, post, put, restore, del } from "@/utils/axios";
import { useLoadingStore } from "@/store/loadings";
import { useAuthStore } from "@/store/auth";

const loadingStore = useLoadingStore();
const authStore = useAuthStore();

export const useApiStore = defineStore("api", {
  state: () => {
    return {
      isLoading: true,
      params: null,
      exportParams: null,
      success: null,
    };
  },
  actions: {
    async fetch(url, request = null) {
      console.log("sono nella fetch")
      const items = await get(authStore.accessToken, url, request);
      console.log("items",items)
      return items.data;
    },
    async export(url, filename) {
      loadingStore.load();
      let request = {
        ...this.params,
        ...this.exportParams,
      };
      if (request === null) request = "?export=1";
      if (request != null) request = Object.assign(request, { export: 1 });
      await excel(authStore.accessToken, url, request, filename);
      loadingStore.stop();
    },
    async select(url, request) {
      loadingStore.load();
      const response = await get(authStore.accessToken, url, request);
      loadingStore.stop();
      return response;
    },
    async store(
      url,
      formId,
      fetch = true,
      appendData = null,
      closeModal = null
    ) {
      loadingStore.load();
      console.log("PARTE CORRETTAMENTE LA POST")
      console.log("FORMID", formId)
      const response = await post(
        authStore.accessToken,
        url,
        formId,
        appendData,
        closeModal
      );
      loadingStore.stop();
      if (this.success && fetch) this.fetch(url, this.params);
      return response;
    },
    async update(url, formId) {
      loadingStore.load();
      await put(authStore.accessToken, url, formId);
      loadingStore.stop();
    },
    async delete(url, id) {
      loadingStore.load();
      await del(authStore.accessToken, url, id);
      loadingStore.stop();
    },
    async restore(url, id) {
      loadingStore.load();
      await restore(authStore.accessToken, url, id);
      loadingStore.stop();
    },
  },
});
