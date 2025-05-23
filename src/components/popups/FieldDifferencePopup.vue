<template>
  <Popup size="popup-xl">
    <template #content>
      <div class="rounded-md bg-warning p-3 shadow-lg relative">
        <p>
          Ci sono dei campi che non corrispondono alla mappatura presente nel DB
        </p>
      </div>
      <div class="relative overflow-x-auto mt-10">
        <form method="post" id="newField" @submit.prevent="submit">
          <input type="hidden" name="db_name" :value="popupStore.data.dbName" />
          <input
            type="hidden"
            name="file_name"
            :value="popupStore.data.fileName" />
          <input
            type="hidden"
            name="customer_id"
            :value="popupStore.data.customer_id" />
          <input
            type="hidden"
            name="campaign_id"
            :value="popupStore.data.campaign_id" />

          <table class="w-full text-left text-gray-500 dark:text-gray-400">
            <thead
              class="text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th>Intestazione file</th>
                <th>Nome campo DB</th>
                <th>Tipologia campo</th>
                <th>Numero di telefono</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in popupStore.data.header.filter(
                  (item) => item !== ''
                )"
                :key="index">
                <td>{{ item }}</td>
                <td>
                  <InputText
                    type="text"
                    list="list"
                    :name="item"
                    :value="
                      popupStore.data.fields.includes(
                        item[0].toLowerCase() + item.slice(1)
                      )
                        ? item[0].toLowerCase() + item.slice(1)
                        : ''
                    " />
                </td>
                <td>
                  <vue-select
                    value="string"
                    label="description"
                    :field="item + '_type'"
                    :options="fieldTypeOptions"
                    :multiple="false"></vue-select>
                </td>
                <td>
                  <div class="grid grid-cols-12 gap-5">
                    <div class="col-start-1 col-end-4 ml-5 mt-3">
                      <input
                        type="checkbox"
                        class="mt-3"
                        :name="item + '_phone_number'" />
                    </div>
                    <div class="col-start-4 col-end-13">
                      <vue-select
                        :value="''"
                        label="description"
                        :field="item + '_phone_type'"
                        :options="popupStore.data.phoneTypes"
                        :multiple="false"></vue-select>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <datalist id="list">
            <option v-for="(f, index) in popupStore.data.fields" :key="index">
              {{ f }}
            </option>
          </datalist>
        </form>
      </div>
    </template>
    <template #actions>
      <Button
        label="Salva"
        class="p-button-rounded block p-button-secondary font-semibold mr-2"
        @click="submit">
        <i class="pi pi-save mr-2 text-xl"></i> Aggiungi campi e carica lista
      </Button>
    </template>
  </Popup>
</template>
<script>
import { onBeforeMount } from "vue";
import { usePopupStore } from "@/store/popups";
import { useModalStore } from "@/store/modals";
import { useApiStore } from "@/store/api";
import Popup from "@/components/shared/Popup.vue";
import VueSelect from "@/components/shared/VueSelect.vue";

export default {
  name: "FieldDifferencePopup",
  components: { Popup, VueSelect },
  props: ["url"],
  emits: ["emptyTable", "fetchData"],
  setup(props) {
    const popupStore = usePopupStore();
    const modalStore = useModalStore();
    const apiStore = useApiStore();
    onBeforeMount(() => {
      popupStore.color = "warning";
      popupStore.title = "Mappatura diversa dalle intestazioni";
      popupStore.icon = "pi-exclamation-triangle";
    });

    const fieldTypeOptions = [
      {
        id: "string",
        description: "Varchar",
      },
      {
        id: "float",
        description: "Decimale",
      },
      {
        id: "date",
        description: "Data",
      },
    ];

    const submit = async () => {
      // context.emit("emptyTable", true);
      await apiStore.store(props.url, "newField");
      // apiStore.isLoading = true;
      // const response = await apiStore.fetch(props.url, apiStore.params);
      // context.emit("fetchData", response);
      modalStore.close();
      popupStore.close();
    };

    return { fieldTypeOptions, popupStore, submit };
  },
};
</script>
