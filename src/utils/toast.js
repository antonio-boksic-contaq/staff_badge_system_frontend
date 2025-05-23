import { useToast } from "vue-toastification";
const toast = useToast();

export const errorToast = () =>
  toast("Operazione non riuscita", {
    type: "error",
    position: "top-right",
    pauseOnHover: false,
    hideProgressBar: true,
    timeout: 2500,
    icon: "pi pi-times-circle text-3xl",
  });

export const successToast = (text = null) => {
  const title = text === null ? "Operazione eseguita con successo" : text;
  toast(title, {
    type: "success",
    position: "top-right",
    pauseOnHover: false,
    hideProgressBar: true,
    timeout: 2500,
  });
};

export const infoToast = (message) =>
  toast(message, {
    type: "info",
    position: "top-right",
    pauseOnHover: false,
    hideProgressBar: true,
    timeout: 3500,
  });

export const warningToast = (message) =>
  toast(message, {
    type: "warning",
    position: "top-right",
    pauseOnHover: false,
    hideProgressBar: true,
    timeout: 3500,
  });
