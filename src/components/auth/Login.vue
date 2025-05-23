<template>
  <div class="py-8 px-12 login card">
    <div class="w-full">
      <div>
        <img
          class="mx-auto h-44 p-4 w-auto"
          :src="imgFolderPath + '/logo.png'"
          alt="ContaQ HR" />
      </div>
      <form class="mt-8" method="post" id="frmLogin" @submit.prevent="submit">
        <div class="rounded-md shadow-sm">
          <div class="mb-14">
            <span class="p-input-icon-left w-full">
              <InputText
                type="text"
                id="email"
                name="email"
                v-model="state.email"
                class="w-full"
                placeholder="Email" />
              <i class="pi pi-at text-2xl" />
            </span>
            <validation-error :vuelidate="v$.email" />
          </div>
          <div class="mb-14">
            <span class="p-input-icon-right w-full">
              <InputText
                type="password"
                id="password"
                name="password"
                v-model="state.password"
                class="w-full"
                placeholder="Password" />
              <i class="pi pi-key text-2xl" />
            </span>
            <validation-error :vuelidate="v$.password" />
          </div>
        </div>

        <auth-error />

        <div class="absolute bottom-10 left-0 w-full px-12">
          <div class="flex items-center justify-end">
            <div class="text-xl mb-6">
              <router-link to="recupera-password" class="text-red"
                >Password dimenticata?</router-link
              >
            </div>
          </div>

          <div>
            <Button
              label="Entra"
              class="p-button-primary mr-2 mb-2 w-full text-center block uppercase font-semibold"
              @click="submit"
              :disabled="authStore.isLoading"
              type="submit">
              <span v-html="buttonText"></span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { computed, onBeforeMount, reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, email } from "@vuelidate/validators";
import { useAuthStore } from "@/store/auth";
import ValidationError from "@/components/shared/ValidationError";
import AuthError from "@/components/shared/AuthError";

export default {
  name: "Login",
  components: { AuthError, ValidationError },
  setup() {
    const authStore = useAuthStore();

    const imgFolderPath = process.env.VUE_APP_IMG_FOLDER_PATH;

    const state = reactive({
      email: null,
      password: null,
    });

    onBeforeMount(() => {
      authStore.isLoggedIn = false;
      authStore.user = null;
      authStore.accessToken = null;
    });

    const buttonText = computed(() => {
      return authStore.isLoading
        ? "<i class='pi pi-spin pi-spinner mx-auto text-center text-xl'></i>"
        : "<i class='pi pi-lock mr-2 text-xl'></i> Entra";
    });

    const rules = {
      email: {
        required: helpers.withMessage("Inserire l'indirizzo email", required),
        email: helpers.withMessage(
          "L'email non è in un formato corretto",
          email
        ),
      },
      password: {
        required: helpers.withMessage("Inserire la password", required),
      },
    };

    const v$ = useVuelidate(rules, state);

    const submit = async () => {
      const validate = await v$.value.$validate();
      if (!validate) return;
      await authStore.login();
    };

    return { authStore, buttonText, imgFolderPath, submit, state, v$ };
  },
};
</script>
