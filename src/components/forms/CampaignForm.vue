<template>
  <div class="py-6">
    <errors />
    <form
      :method="formStore.method"
      :id="formStore.id + 'Campaign'"
      @submit.prevent="submit">
      <div class="md:grid md:grid-cols-12 md:gap-7">
        <div class="md:grid md:col-start-1 md:col-end-8">
          <h2 class="mb-5 uppercase text-black">
            <font-awesome-icon
              icon="headset"
              class="fa-fw"
              :class="'text-' + formStore.color" />
            Dati campagna
          </h2>
          <div class="md:grid md:grid-cols-12 md:gap-7">
            <div
              v-if="formStore.action === 'update'"
              class="md:col-start-1 md:col-end-3">
              <div class="mt-0">
                <label for="campaign_id" class="font-medium block mb-2">
                  ID
                </label>
                <InputText
                  type="text"
                  readonly
                  id="campaign_id"
                  name="campaign_id"
                  v-model="state.campaign_id"
                  class="w-full" />
              </div>
            </div>

            <div
              :class="
                formStore.action === 'update'
                  ? 'md:col-start-3'
                  : 'md:col-start-1'
              "
              class="md:col-end-13">
              <div class="mt-0">
                <label for="name" class="font-medium block mb-2"> Nome </label>
                <InputText
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Inserire il nome"
                  v-model="state.name"
                  class="w-full" />
                <validation-error :vuelidate="v$.name" />
              </div>
            </div>
          </div>

          <div class="md:grid md:grid-cols-12 md:gap-7">
            <div class="md:col-start-1 md:col-end-6">
              <div class="mt-10">
                <label for="name" class="font-medium block mb-2">
                  Tipo campagna
                </label>
                <vue-select
                  :value="state.campaign_type_id || ''"
                  label="description"
                  field="campaign_type_id"
                  @selectedValueChange="changeData($event, 'campaign_type_id')"
                  :options="campaignTypeOptions"
                  :multiple="false"></vue-select>
                <validation-error :vuelidate="v$.campaign_type_id" />
              </div>
            </div>
            <div class="md:col-start-6 md:col-end-13">
              <div class="mt-10">
                <label for="code" class="font-medium block mb-2">
                  Cliente
                </label>
                <vue-select
                  :value="state.customer_id || ''"
                  label="name"
                  field="customer_id"
                  @selectedValueChange="changeData($event, 'customer_id')"
                  :options="customersOptions"
                  :multiple="false"></vue-select>
                <validation-error :vuelidate="v$.customer_id" />
              </div>
            </div>
          </div>

          <div class="md:grid md:grid-cols-12 md:gap-7">
            <div class="md:col-start-1 md:col-end-6">
              <div class="mt-10">
                <label for="name" class="font-medium block mb-2">
                  Data di inizio
                </label>
                <input-date
                  :value="state.start_date"
                  field="start_date"
                  @dateTimeValueChange="changeData($event, 'start_date')" />
                <validation-error :vuelidate="v$.start_date" />
              </div>
            </div>
            <div class="md:col-start-6 md:col-end-13">
              <div class="mt-10">
                <label for="name" class="font-medium block mb-2">
                  Data di fine
                </label>
                <input-date
                  :value="state.end_date"
                  field="end_date"
                  @dateTimeValueChange="changeData($event, 'end_date')" />
              </div>
            </div>
          </div>

          <div class="mt-10">
            <div class="md:grid md:grid-cols-3 md:gap-7">
              <div>
                <label for="inbound" class="font-medium block mb-2">
                  Inbound
                </label>
                <switch-checkbox
                  fieldName="inbound"
                  :value="state.inbound"
                  @checkedValueChange="changeData($event, 'inbound')" />
              </div>
              <div>
                <label for="fullfillment" class="font-medium block mb-2">
                  Fullfillment
                </label>
                <switch-checkbox
                  fieldName="fullfillment"
                  :value="state.fullfillment"
                  @checkedValueChange="changeData($event, 'fullfillment')" />
              </div>
              <div>
                <label for="rpo" class="font-medium block mb-2"> RPO </label>
                <switch-checkbox
                  fieldName="rpo"
                  :value="state.rpo"
                  @checkedValueChange="changeData($event, 'rpo')" />
              </div>
            </div>
          </div>

          <div class="mt-10">
            <label for="note" class="font-medium block mb-2"> Note </label>
            <Textarea
              placeholder="Inserire qui le note"
              :autoResize="false"
              v-model="state.note"
              name="note"
              rows="3"
              cols="30"
              class="w-full" />
          </div>
        </div>
        <div class="md:grid md:col-start-8 md:col-end-13">
          <div class="md:grid md:grid-cols-12 md:gap-7">
            <div class="md:col-start-1 md:col-end-13">
              <h2 class="mb-5 uppercase text-black">
                <font-awesome-icon
                  icon="paperclip"
                  class="fa-fw"
                  :class="'text-' + formStore.color" />
                Allegati
              </h2>
              <DropZone
                method="post"
                :maxFiles="Number(100)"
                :url="url"
                paramName="test"
                :headers="{ Authorization: 'Bearer ' + authStore.accessToken }"
                :uploadOnDrop="false"
                :multipleUpload="true"
                :parallelUpload="10"
                :maxFileSize="2000000"
                :acceptedFiles="['csv', 'txt', 'xlsx', 'xls']"
                @addedFile="onFileAdd"
                ref="dropzone">
                <template #message>
                  Clicca o trascina i file all'interno per caricare
                </template>
              </DropZone>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full mt-10">
        <h2 class="mb-5 uppercase text-black">
          <font-awesome-icon
            icon="list-check"
            class="fa-fw"
            :class="'text-' + formStore.color" />
          Task
        </h2>
        <table class="w-full">
          <thead>
            <tr class="text-left h-10">
              <th class="w-36">Task</th>
              <th class="w-36">
                <div class="grid m-0 gird-cols-12 gap-2">
                  <div class="md:col-start-1 md:col-end-10">Completato</div>
                  <div class="md:col-start-11 md:col-end-13">
                    <switch-checkbox
                      css="mt-1"
                      fieldName="allCompleted"
                      :value="toggleAllCompleted"
                      :disabled="disabledAllCompleted"
                      @checkedValueChange="toggleAllCompleted($event)" />
                  </div>
                </div>
              </th>
              <th>Data</th>
              <th>
                <Button
                  icon="pi pi-plus"
                  class="p-button-rounded p-button-primary p-button-text"
                  @click="addItem" />
              </th>
            </tr>
          </thead>
          <tbody>
            <TransitionGroup name="scale-in" appear>
              <tr
                class="assignment"
                v-for="(item, key) in state.tasks"
                :key="key + 'device'">
                <td>
                  <vue-select
                    :value="state.tasks[key].task_id"
                    label="description"
                    :options="taskOptions"
                    :multiple="false"
                    :doubleEmit="true"
                    @selectedValueChange="
                      changeStateTask($event, 'task_id', key)
                    "
                    :field="'task_id' + key"></vue-select>
                </td>
                <td>
                  <switch-checkbox
                    :fieldName="'completed' + key"
                    :value="state.tasks[key].completed"
                    @checkedValueChange="
                      changeStateTaskField($event, 'completed', key)
                    " />
                </td>
                <td>
                  <input-date
                    :field="'date' + key"
                    :value="state.tasks[key].date"
                    @dateTimeValueChange="
                      changeStateTaskField($event, 'date', key)
                    " />
                </td>
                <td>
                  <Button
                    icon="pi pi-trash"
                    @click="removeItem(key)"
                    class="p-button-rounded p-button-danger p-button-text" />
                </td>
              </tr>
            </TransitionGroup>
          </tbody>
        </table>
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
    </form>
  </div>
</template>
<script>
//TODO inserire il campo user_id in modifica
import { onBeforeMount, ref, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { reactive } from "vue";
import { useApiStore } from "@/store/api";
import { useFormStore } from "@/store/forms";
import { addItemData } from "@/utils/select";
import { warningToast } from "@/utils/toast";
import { useAuthStore } from "@/store/auth";
import Errors from "@/components/shared/Errors.vue";
import ValidationError from "@/components/shared/ValidationError";
import VueSelect from "@/components/shared/VueSelect.vue";
import InputDate from "@/components/shared/InputDate.vue";
import SwitchCheckbox from "@/components/shared/SwitchCheckbox.vue";

export default {
  name: "CampaignForm",
  components: { Errors, InputDate, SwitchCheckbox, ValidationError, VueSelect },
  props: ["url"],
  emits: ["emptyTable", "fetchData"],
  setup(props, context) {
    const authStore = useAuthStore();
    const apiStore = useApiStore();
    const formStore = useFormStore();
    const campaignTypeOptions = ref([]);
    const customersOptions = ref([]);
    const taskOptions = ref([]);
    const checkDoubleTask = ref(true);
    let files = [];

    const removeItem = async (index) => {
      state.tasks = state.tasks.filter((_, i) => i !== index);
      state.count_tasks = state.tasks.length;
    };

    const toggleAllCompleted = (event) => {
      state.tasks.forEach((item) => (item.completed = event));
    };

    const addItem = () => {
      state.tasks = [
        ...state.tasks,
        {
          date: null,
          task_id: null,
          completed: 0,
        },
      ];

      state.count_tasks = state.tasks.length;
    };

    const changeStateTask = async (event, field, index) => {
      let double = undefined;
      if (checkDoubleTask.value === true) {
        double = state.tasks.find(
          (element) => element.task_id === event.selectedValue
        );
      }
      if (double === undefined) {
        state["tasks"][index][field] = event.selectedValue;
      } else {
        warningToast("Hai già inserito questo task");
        const check = (await state.tasks.splice(index, 1).length) > 0;
        if (check)
          state.tasks.push({
            date: new Date().toISOString().slice(0, 10).replace("T", " "),
            task_id: null,
            completed: 0,
          });
      }

      state.count_tasks = state.tasks.length;
    };

    const changeStateTaskField = async (event, field, index) => {
      state["tasks"][index][field] = event;
      if (field === "completed") {
        state["tasks"][index]["date"] = event
          ? state["tasks"][index]["date"] == "" ||
            state["tasks"][index]["date"] == null
            ? new Date().toISOString().slice(0, 10).replace("T", " ")
            : state["tasks"][index]["date"]
          : null;
      }
      state.count_tasks = state.tasks.length;
    };

    onBeforeMount(async () => {
      const campaignIdRequest =
        formStore.action === "update"
          ? "?campaign_id=" + formStore.data.id
          : "";
      campaignTypeOptions.value = await apiStore.fetch(
        process.env.VUE_APP_API_URL + "/campaign-types"
      );
      customersOptions.value = await apiStore.fetch(
        process.env.VUE_APP_API_URL + "/customers"
      );
      const responseTask = await apiStore.fetch(
        process.env.VUE_APP_API_URL + "/tasks" + campaignIdRequest
      );
      taskOptions.value = await addItemData(responseTask, "description");
    });

    const state = reactive({
      campaign_id: formStore.data != null ? formStore.data.id : null,
      name: formStore.data != null ? formStore.data.name : null,
      campaign_type_id:
        formStore.data != null ? formStore.data.campaign_type.id : null,
      customer_id: formStore.data != null ? formStore.data.customer.id : null,
      description: formStore.data != null ? formStore.data.description : null,
      start_date: formStore.data != null ? formStore.data.start_date : null,
      end_date: formStore.data != null ? formStore.data.end_date : null,
      inbound: formStore.data != null ? formStore.data.inbound : null,
      rpo: formStore.data != null ? formStore.data.rpo : null,
      fullfillment: formStore.data != null ? formStore.data.fullfillment : null,
      note: formStore.data != null ? formStore.data.note : null,
      tasks: formStore.data != null ? formStore.data.tasks : [],
      count_tasks: formStore.data != null ? formStore.data.tasks.length : 0,
    });

    const rules = {
      name: {
        required: helpers.withMessage("Questo campo è obbligatorio", required),
      },
      campaign_type_id: {
        required: helpers.withMessage("Questo campo è obbligatorio", required),
      },
      customer_id: {
        required: helpers.withMessage("Questo campo è obbligatorio", required),
      },
      start_date: {
        required: helpers.withMessage("Questo campo è obbligatorio", required),
      },
    };

    const disabledAllCompleted = ref(state.tasks.length > 0 ? false : true);

    watch(
      () => state.tasks,
      (value, oldValue) => {
        disabledAllCompleted.value = value.length > 0 ? false : true;
        checkDoubleTask.value = value.length >= oldValue.length ? true : false;
      },
      { deep: true }
    );

    const onFileAdd = (e) => {
      files.push(e.file);
    };

    const changeData = (event, field) => {
      state[field] = event;
    };

    const v$ = useVuelidate(rules, state);

    const getFormData = () => {
      const data = new FormData(
        document.getElementById(formStore.id + "Campaign")
      );
      const tasks = {};
      for (let i = 0; i < state.count_tasks; i++) {
        const taskId = data.get("task_id" + i);
        const date = data.get("date" + i) != "" ? data.get("date" + i) : null;
        const completed = data.get("completed" + i);
        if (!isNaN(taskId) && taskId.length > 0 && taskId != 0)
          tasks[taskId] = { date, completed };
        data.delete("task_id" + i);
        data.delete("completed" + i);
      }
      data.append("tasks", JSON.stringify(tasks));
      if (files.length > 0)
        files.forEach((item) => data.append("file[]", item));
      return data;
    };

    const submit = async () => {
      const validate = await v$.value.$validate();
      if (!validate) return;
      if (formStore.action === "store")
        await apiStore.store(formStore.route, getFormData());
      if (formStore.action === "update")
        await apiStore.update(formStore.route, getFormData());

      if (apiStore.success === true) {
        context.emit("emptyTable", true);
        apiStore.isLoading = true;
        const response = await apiStore.fetch(props.url, apiStore.params);
        context.emit("fetchData", response);
        formStore.empty();
      }
    };

    return {
      addItem,
      authStore,
      campaignTypeOptions,
      changeData,
      changeStateTask,
      changeStateTaskField,
      customersOptions,
      disabledAllCompleted,
      formStore,
      onFileAdd,
      removeItem,
      submit,
      state,
      taskOptions,
      toggleAllCompleted,
      v$,
    };
  },
};
</script>
