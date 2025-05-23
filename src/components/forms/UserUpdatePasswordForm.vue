<template>
  <div class="py-6">
    <errors />
    <form
      :method="formStore.method"
      :id="formStore.id + 'UserUpdatePasswordForm'"
      @submit.prevent="submit">
      <div class="mt-0">
        <label for="password" class="font-medium block mb-2"> Password </label>
        <InputText
          type="password"
          id="password"
          name="password"
          placeholder="Inserire la password"
          v-model="state.password"
          class="w-full" />
        <validation-error :vuelidate="v$.password" />
      </div>

      <div class="mt-10">
        <label for="password_confirmation" class="font-medium block mb-2">
          Password
        </label>
        <InputText
          type="password"
          id="password_confirmation"
          name="password_confirmation"
          placeholder="Inserire nuovamente la password"
          v-model="state.password_confirmation"
          class="w-full" />
        <validation-error :vuelidate="v$.password_confirmation" />
      </div>

      <div class="clear-both mt-14">
        <Button
          label="Salva"
          class="p-button-text p-button-success font-semibold block w-full mt-4 mx-auto uppercase text-3xl"
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
import { usePasswordModalStore } from "@/store/password-modal";
import Errors from "@/components/shared/Errors.vue";
import ValidationError from "@/components/shared/ValidationError";

export default {
  name: "UserUpdatePasswordForm",
  components: { Errors, ValidationError },
  props: ["url"],
  emits: ["emptyTable", "fetchData"],
  setup(props) {
    const formStore = useFormStore();
    const apiStore = useApiStore();
    const passwordModalStore = usePasswordModalStore();

    const state = reactive({
      password: null,
      password_confirmation: null,
    });

    const rules = {
      password: {
        required: helpers.withMessage("Questo campo è obbligatorio", required),
      },
      password_confirmation: {
        required: helpers.withMessage("Questo campo è obbligatorio", required),
        sameAsPassword: helpers.withMessage(
          "Le due password non coincidono",
          (value) => value === state.password
        ),
      },
    };

    const v$ = useVuelidate(rules, state);

    const submit = async () => {
      const validate = await v$.value.$validate();
      if (!validate) return;
      await apiStore.update(props.url, formStore.id + "UserUpdatePasswordForm");
      if (apiStore.success) passwordModalStore.isOpen = 0;
    };

    return { formStore, submit, state, v$ };
  },
};
</script>
