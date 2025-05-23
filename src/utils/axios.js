import axios from "axios";
import { errorToast, warningToast, successToast } from "@/utils/toast";
import { getErrors } from "@/utils/errors";
import { useErrorsStore } from "@/store/errors";
import { useModalStore } from "@/store/modals";
import { useApiStore } from "@/store/api";
import { usePopupStore } from "@/store/popups";

const getAxiosHeaders = (token) => ({
  headers: {
    Authorization: "Bearer " + token,
    "Content-Type": "multipart/form-data",
  },
});

export const get = async (token, url, request = null) => {
  if (request != null) url += "?" + new URLSearchParams(request).toString();
  return await axios.create(getAxiosHeaders(token)).get(url, request);
};

export const excel = async (token, url, request = null, filename) => {
  if (request != null) url += "?" + new URLSearchParams(request).toString();
  return await axios
    .create(Object.assign(getAxiosHeaders(token), { responseType: "blob" }))
    .get(url, {
      responseType: "blob",
    })
    .then((response) => {
      const href = URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", filename + ".xlsx");
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
};

export const pdf = async (token, url, request = null) => {
  if (request != null) url += "?" + new URLSearchParams(request).toString();
  return await axios
    .create(Object.assign(getAxiosHeaders(token), { responseType: "blob" }))
    .get(url, {
      responseType: "blob",
    })
    .then((response) => {
      const href = URL.createObjectURL(response.data);
      window.open(href);
    });
};

export const post = async (token, url, form, appendData = null, closeModal) => {
  const errorStore = useErrorsStore();
  const modalStore = useModalStore();
  const apiStore = useApiStore();
  const popupStore = usePopupStore();
  errorStore.hide();
  const data =
    typeof form === "string"
      ? new FormData(document.getElementById(form))
      : form;
  if (appendData !== null) data.append(appendData, 1);
  return await axios
    .create(getAxiosHeaders(token))
    .post(url, data)
    .then((result) => {
      if (result.status === 200) {
        successToast();
        if (closeModal == null) modalStore.close();
        if (appendData !== null) popupStore.close();
        apiStore.success = true;
        return result.data;
      }
      if (result.status === 206) {
        apiStore.success = false;
        popupStore.data = result.data;
        popupStore.open();
        warningToast("Attenzione! Operazione non conclusa");
        return result.data;
      }
    })
    .catch((error) => {
      if (error.request.status != 200 && error.request.status != 0) {
        errorToast();
        errorStore.show(getErrors(error));
        errorStore.excelErrors = error.response.data;
        apiStore.success = false;
      } else {
        console.log(error);
        errorToast();
        apiStore.success = false;
      }
    });
};

export const put = async (token, url, form) => {
  const errorStore = useErrorsStore();
  const modalStore = useModalStore();
  const apiStore = useApiStore();
  errorStore.hide();
  const data =
    typeof form === "string"
      ? new FormData(document.getElementById(form))
      : form;
  data.append("_method", "PUT");

  await axios
    .create(getAxiosHeaders(token))
    .post(url, data)
    .then((result) => {
      if (result.status === 200) {
        successToast();
        modalStore.close();
        apiStore.success = true;
      }
    })
    .catch((error) => {
      if (error.request.status != 200 && error.request.status != 0) {
        errorToast();
        errorStore.show(getErrors(error));
        apiStore.success = false;
      } else {
        console.log(error);
        errorToast();
        apiStore.success = false;
      }
    });
};

//delete non è un nome valido
export const del = async (token, url, id) => {
  const errorStore = useErrorsStore();
  await axios
    .create(getAxiosHeaders(token))
    .delete(url + "/" + id)
    .then((result) => {
      if (result.status === 200) {
        successToast();
      }
    })
    .catch((error) => {
      if (error.request.status != 200 && error.request.status != 0) {
        errorToast();
        errorStore.show(getErrors(error));
      } else {
        console.log(error);
        errorToast();
      }
    });
};

export const restore = async (token, url, id) => {
  const errorStore = useErrorsStore();
  await axios
    .create(getAxiosHeaders(token))
    .put(url + "/" + id + "/restore")
    .then((result) => {
      if (result.status === 200) {
        successToast();
      }
    })
    .catch((error) => {
      if (error.request.status != 200 && error.request.status != 0) {
        errorToast();
        errorStore.show(getErrors(error));
      } else {
        console.log(error);
        errorToast();
      }
    });
};
