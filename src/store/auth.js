import { defineStore } from "pinia";
import axios from "axios";
import { getErrors } from "@/utils/errors";
import { useLoadingStore } from "@/store/loadings";
import { useErrorsStore } from "@/store/errors";
import { errorToast, successToast } from "@/utils/toast";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      isLoggedIn: false,
      user: null,
      isLoading: null,
      accessToken: null,
      recoverySuccess: null,
    };
  },
  persist: true,
  actions: {
    async login() {
      const errorStore = useErrorsStore();
      const url = process.env.VUE_APP_API_URL + "/auth/user";
      errorStore.hide();
      this.isLoading = true;
      const data = new FormData(document.getElementById("frmLogin"));
      await axios
        .post(process.env.VUE_APP_API_URL + "/login", data)
        .then(async (result) => {
          if (result.status === 200) {
            this.accessToken = result.data.token;
            const headers = {
              headers: {
                Authorization: "Bearer " + this.accessToken,
              },
            };
            const user = await axios.get(url, headers);
            this.isLoggedIn = true;
            this.user = user.data;
            this.isLoading = false;
            if (user.data.role === "Supervisor")
              router.push("contratti-in-scadenza");
            else router.push("calendario");
          }
        })
        .catch((error) => {
          if (error.request.status != 200) {
            this.isLoading = false;
            errorStore.show(getErrors(error));
          }
        });
    },
    async logout() {
      const loadingStore = useLoadingStore();
      loadingStore.isLoading = true;
      const headers = {
        headers: {
          Authorization: "Bearer " + this.accessToken,
        },
      };
      await axios
        .post(process.env.VUE_APP_API_URL + "/auth/logout", null, headers)
        .then(async (result) => {
          if (result.status === 200) {
            this.accessToken = null;
            this.isLoggedIn = false;
            this.user = null;
            loadingStore.isLoading = false;
            router.push("/login");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async passwordRecovery() {
      const errorStore = useErrorsStore();
      errorStore.hide();
      this.isLoading = true;
      const data = new FormData(document.getElementById("frmPasswordRecovery"));
      await axios
        .post(process.env.VUE_APP_API_URL + "/auth/password-recovery", data)
        .then((result) => {
          if (result.status === 200) {
            successToast();
            this.recoverySuccess = true;
          }
        })
        .catch((error) => {
          if (error.request.status != 200) {
            errorToast();
            errorStore.show(getErrors(error));
          }
        });
      this.isLoading = false;
    },
    async refreshUser() {
      const url = process.env.VUE_APP_API_URL + "/auth/user";
      const headers = {
        headers: {
          Authorization: "Bearer " + this.accessToken,
        },
      };
    const user = await axios.get(url, headers);
    this.user = user.data;
    }
  },
});
