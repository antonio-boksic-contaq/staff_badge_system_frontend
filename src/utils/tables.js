import { useApiStore } from "@/store/api";
import { computed } from "vue";

const apiStore = useApiStore();

export const paginationOptions = {
  enabled: true,
  mode: "records",
  rowsPerPageLabel: "Righe per pagina",
  perPage: 20,
  position: "bottom",
  perPageDropdown: [5, 10, 15, 20, 25, 30, 35, 40],
  setCurrentPage: 1,
  nextLabel: "prossima",
  prevLabel: "precedente",
  allLabel: "Tutte",
  ofLabel: "di",
};

export const searchOptions = {
  enabled: true,
  placeholder: "Cerca...",
};

export const emptyState = computed(() =>
  apiStore.isLoading
    ? "<div class='p-5'>Caricamento in corso <i class='pi pi-spin pi-spinner'></i></div>"
    : "<div class='p-5'>Non ci sono risultati disponibili</div>"
);

export const dropDownFilter = (field, array, data, filterString) => {
  array.forEach((element) => {
    if (element.value === filterString) {
      apiStore.exportParams = {
        ...apiStore.exportParams,
        [field]: element.id,
      };
    }
  });
  return data === filterString;
};

export const manageApiExportParams = (itemName, field) => {
  const item = document.getElementsByName(itemName);
  item[0].addEventListener("change", (event) => {
    if (event.target.value.length === 0) delete apiStore.exportParams[field];
  });
};
