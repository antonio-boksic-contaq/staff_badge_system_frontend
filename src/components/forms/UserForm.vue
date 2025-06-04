<template>
  <div class="py-6">
    <errors />
    <form
      :method="formStore.method"
      :id="formStore.id + 'User'"
      :class="formStore.action"
      @submit.prevent="submit">
      <div class="m-0">
        <!-- <h2 class="mb-5 uppercase">
          <i class="pi pi-id-card mr-1 text-3xl"></i>
          Anagrafica
        </h2> -->
        <!-- nome -->
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
        <!-- cognome -->
        <div class="mt-10">
          <label for="surname" class="font-medium block mb-2"> Cognome </label>
          <InputText
            type="text"
            id="surname"
            name="surname"
            placeholder="Inserire il cognome"
            v-model="state.surname"
            class="w-full" />
          <validation-error :vuelidate="v$.surname" />
        </div>
        <!-- email -->
        <div class="mt-10">
          <label for="email" class="font-medium block mb-2"> Email </label>
          <InputText
            type="text"
            id="email"
            name="email"
            placeholder="Inserire l'email"
            v-model="state.email"
            class="w-full" />
          <validation-error :vuelidate="v$.email" />
        </div>
        <!-- ruolo ci serve?? -->
        <!-- <div class="mt-10">
          <label for="role" class="font-medium block mt-10 mb-2"> Ruolo </label>
          <vue-select
            :value="state.role"
            label="name"
            :options="rolesOptions"
            :multiple="false"
            @selectedValueChange="changeData($event, 'role')"
            field="role"></vue-select>
          <validation-error :vuelidate="v$.role" />
        </div> -->

        <!-- <div class="mt-10">
          <label for="color" class="font-medium block mt-10 mb-2">
            Colore per grafici
          </label>
          <div class="rounded">
            <input
              type="color"
              id="color"
              name="color"
              class="mt-2"
              v-model="state.color" />
          </div>
          <validation-error :vuelidate="v$.color" />
        </div> -->
      </div>

      <InputText
        v-if="formStore.action === 'update'"
        type="hidden"
        id="user_id"
        name="user_id"
        v-model="state.user_id" />

      <div class="clear-both mt-14">
        <Button
          label="Salva"
          class="p-button-text font-semibold block w-full mt-16 mx-auto uppercase text-3xl"
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
import { email, required, helpers } from "@vuelidate/validators";
import { onBeforeMount, reactive, ref } from "vue";
import { useApiStore } from "@/store/api";
import { useLoadingStore } from "@/store/loadings";
import { useFormStore } from "@/store/forms";
import Errors from "@/components/shared/Errors.vue";
// import VueSelect from "@/components/shared/VueSelect.vue";
import ValidationError from "@/components/shared/ValidationError.vue";

export default {
  name: "UserForm",
  components: {
    Errors,
    ValidationError,
    // VueSelect,
  },
  props: ["preventFetch", "url"],
  emits: ["emptyTable", "fetchData"],
  setup(props, context) {
    const apiStore = useApiStore();
    const formStore = useFormStore();
    const loadingStore = useLoadingStore();
    const rolesOptions = ref([]);
    onBeforeMount(async () => {
      loadingStore.load();

      console.log("URL in UserForm",props.url)
      // rolesOptions.value = await apiStore.fetch(
      //   process.env.VUE_APP_API_URL + "/roles"
      // );

      loadingStore.stop();
    });

    const state = reactive({
      user_id: formStore.data !== null ? formStore.data.id : null,
      name: formStore.data !== null ? formStore.data.name : null,
      surname: formStore.data !== null ? formStore.data.surname : null,
      email: formStore.data !== null ? formStore.data.email : null,
      // role: formStore.data !== null ? formStore.data.role : null,
      // color: formStore.data !== null ? formStore.data.color : null,
    });

    const changeData = (event, field) => {
      state[field] = event;
    };

    const rules = {
      name: {
        required: helpers.withMessage("Questo campo è obbligatorio", required),
      },
      surname: {
        required: helpers.withMessage("Questo campo è obbligatorio", required),
      },
      email: {
        email: helpers.withMessage("Email non valida", email),
        required: helpers.withMessage("Questo campo è obbligatorio", required),
      },
      // role: {
      //   required: helpers.withMessage("Questo campo è obbligatorio", required),
      // },
      // color: {
      //   required: helpers.withMessage("Questo campo è obbligatorio", required),
      // },
    };

    const v$ = useVuelidate(rules, state);

    const submit = async () => {
      const validate = await v$.value.$validate();
      if (!validate) return;
      if (formStore.action === "store")
        await apiStore.store(formStore.route, formStore.id + "User");
      if (formStore.action === "update") {
        console.log("UPDATE FINO A QUA NEL FORM ARRIVA SECONDO ME ERRORE è SUBITO DOPO")
        await apiStore.update(formStore.route, formStore.id + "User");
      }
      if (apiStore.success === true) {
        if (props.preventFetch === undefined) {
          context.emit("emptyTable", true);
          apiStore.isLoading = true;
          const response = await apiStore.fetch(props.url, apiStore.params);
          context.emit("fetchData", response);
          formStore.empty();
        } else {
          context.emit("fetchData", true);
        }
      }
    };

    return {
      changeData,
      formStore,
      rolesOptions,
      submit,
      state,
      v$,
    };
  },
};
</script>
