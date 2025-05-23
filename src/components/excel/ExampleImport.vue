<template>
  <div class="rounded-md bg-green-200 p-3 shadow-lg mb-14 relative">
    <blockquote
      class="p-4 my-4 border-l-4 border-green-300 bg-green-50 dark:border-green-500 dark:bg-green-800">
      <small>
        <h4 class="text-2xl font-bold uppercase text-black">
          <i class="pi pi-info-circle text-xl"></i> Note per l'importazione
        </h4>
        <ul class="list-disc mt-5 ml-7">
          <li>
            La tipologia va inserita con il campo
            <em>Descrizione</em>. Puoi scaricare la lista cliccando
            <span
              class="font-bold cursor-pointer"
              @click="downloadExcel('item', 'nome')"
              >qui</span
            >.
          </li>
          <li>
            E' possibile scaricare un report degli errori una volta conclusa
            l'importazione.
          </li>
        </ul>
      </small>
    </blockquote>

    <Button
      class="p-button-text p-button-success font-semibold block w-full mt-4 mx-auto uppercase text-xl">
      <a href="/files/url_scheletro" class="text-green-600" target="_blank">
        <i class="pi pi-download text-2xl"></i> Clicca qui per scaricare lo
        scheletro necessario per l'importazione.
      </a>
    </Button>
  </div>
  <Transition name="scale-in">
    <div
      v-if="errorStore.display === 1"
      class="rounded-md bg-red-100 p-3 shadow-lg mb-14 relative">
      <p>
        L'operazione non è andata a buon fine, qualche riga non ha superato la
        validazione. Puoi trovare un report completo
        <span class="font-bold cursor-pointer" @click="downloadErrors">qui</span
        >.
      </p>
      <Button
        icon="pi pi-times"
        @click="closeErrorAlert"
        class="p-button-rounded p-button-danger p-button-text absolute top-3 right-3"></Button>
    </div>
  </Transition>

  <form
    enctype="multipart/form-data"
    :method="formStore.method"
    :id="formStore.id + 'ExampleAsset'"
    :class="formStore.action"
    @submit.prevent="submit">
    <div class="w-full block">
      <div class="mt-10">
        <label for="file" class="font-medium block mb-2">
          Seleziona il file da caricare
        </label>
        <div class="grid grid-cols-7 gap-7">
          <div class="col-start-1 col-end-6">
            <input type="file" name="file" id="file" @change="handleFile" />
            <validation-error :vuelidate="v$.file" />
          </div>
          <div class="col-start-6 col-end-8">
            <Transition name="bounce">
              <Button
                v-if="checkUpload"
                class="p-button-rounded p-button-danger mr-2 mb-2 float-right"
                @click="removeFile('file')">
                <i class="pi pi-times-circle text-xl mt-1 mr-3"></i> Rimuovi
              </Button>
            </Transition>
          </div>
        </div>
      </div>

      <div class="clear-both mt-14">
        <Button
          label="Salva"
          class="p-button-text font-semibold block w-full mt-4 mx-auto uppercase text-3xl"
          :class="'p-button-' + formStore.color"
          @click="submit">
          <i class="pi pi-save mr-2 text-3xl"></i>
          Salva
        </Button>
      </div>
    </div>
  </form>
</template>
<script>
import axios from "axios";
import { useVuelidate } from "@vuelidate/core";
import { reactive, ref } from "vue";
import { helpers } from "@vuelidate/validators";
import { useFormStore } from "@/store/forms";
import { useAuthStore } from "@/store/auth";
import { useApiStore } from "@/store/api";
import { useErrorsStore } from "@/store/errors";
import ValidationError from "@/components/shared/ValidationError";

export default {
  name: "ExampleImport",
  emits: ["emptyTable", "fetchData"],
  components: {
    ValidationError,
  },
  setup(props, context) {
    const authStore = useAuthStore();
    const apiStore = useApiStore();
    const formStore = useFormStore();
    const errorStore = useErrorsStore();
    const checkUpload = ref(false);
    const removeFile = (id) => {
      document.getElementById(id).value = "";
      checkUpload.value = false;
    };

    const state = reactive({
      file: null,
    });

    const handleFile = (e) => {
      if (e.target.value.length > 0) checkUpload.value = true;
      if (e.target.value.length === 0) checkUpload.value = false;
    };

    const closeErrorAlert = () => {
      errorStore.display = 0;
    };

    const rules = {
      file: {
        requiredIfFunction: helpers.withMessage(
          "E' obbligatorio caricare un file",
          () => {
            if (checkUpload.value) return true;
          }
        ),
      },
    };

    const downloadExcel = async (route, fileName) => {
      const url = process.env.VUE_APP_API_URL + "/" + route;
      await apiStore.export(url, fileName);
    };

    const downloadErrors = async () => {
      const exportUrl = process.env.VUE_APP_API_URL + "/export-errors";
      await axios
        .create(
          Object.assign(
            {
              headers: {
                Authorization: "Bearer " + authStore.accessToken,
                "Content-Type": "multipart/form-data",
              },
            },
            { responseType: "blob" }
          )
        )
        .post(exportUrl, errorStore.excelErrors.items, {
          responseType: "blob",
        })
        .then((response) => {
          const href = URL.createObjectURL(response.data);

          const link = document.createElement("a");
          link.href = href;
          link.setAttribute("download", "errori.xlsx");
          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          URL.revokeObjectURL(href);
        });
    };

    const v$ = useVuelidate(rules, state);

    const submit = async () => {
      let validate = await v$.value.$validate();
      if (!validate) return;
      context.emit("emptyTable", true);
      await apiStore.store(formStore.route, formStore.id + "FormId", false);

      if (apiStore.success === true) {
        const fetchUrl = process.env.VUE_APP_API_URL + "/url";
        const response = await apiStore.fetch(fetchUrl, apiStore.params);
        context.emit("fetchData", response);
        formStore.empty();
      }
    };

    return {
      checkUpload,
      closeErrorAlert,
      downloadExcel,
      downloadErrors,
      errorStore,
      formStore,
      handleFile,
      removeFile,
      state,
      submit,
      v$,
    };
  },
};
</script>
