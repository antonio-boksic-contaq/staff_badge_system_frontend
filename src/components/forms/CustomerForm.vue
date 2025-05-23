<template>
  <div class="py-6">
    <errors />
    <form
      :method="formStore.method"
      :id="formStore.id + 'FormId'"
      @submit.prevent="submit">
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

      <InputText
        v-if="formStore.action === 'update'"
        type="hidden"
        id="customer_id"
        name="customer_id"
        v-model="state.customer_id" />

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
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { reactive } from "vue";
import { useApiStore } from "@/store/api";
import { useFormStore } from "@/store/forms";
import Errors from "@/components/shared/Errors.vue";
import ValidationError from "@/components/shared/ValidationError";

export default {
  name: "CustomerForm",
  components: { Errors, ValidationError },
  props: ["url"],
  emits: ["emptyTable", "fetchData"],
  setup(props, context) {
    const apiStore = useApiStore();
    const formStore = useFormStore();

    const state = reactive({
      name: formStore.data != null ? formStore.data.name : null,
      customer_id: formStore.data != null ? formStore.data.id : null,
    });

    const rules = {
      name: {
        required: helpers.withMessage("Questo campo è obbligatorio", required),
      },
    };

    const v$ = useVuelidate(rules, state);

    const submit = async () => {
      const validate = await v$.value.$validate();
      if (!validate) return;
      if (formStore.action === "store")
        await apiStore.store(formStore.route, formStore.id + "FormId");
      if (formStore.action === "update")
        await apiStore.update(formStore.route, formStore.id + "FormId");

      if (apiStore.success === true) {
        context.emit("emptyTable", true);
        apiStore.isLoading = true;
        const response = await apiStore.fetch(props.url, apiStore.params);
        context.emit("fetchData", response);
        formStore.empty();
      }
    };

    return { formStore, submit, state, v$ };
  },
};
</script>
