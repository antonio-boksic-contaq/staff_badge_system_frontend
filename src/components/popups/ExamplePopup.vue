<template>
  <Popup size="popup-lg">
    <template #content>
      <div class="rounded-md bg-warning p-3 shadow-lg relative">
        <p>Hai già inserito un candidato con questi dati</p>
      </div>
      <div class="grid grid-cols-2 m-0">
        <div>
          <div class="mt-5">
            <label for="name" class="font-medium block mb-2"> Nome </label>
            <span>{{ popupStore.data.name }}</span>
          </div>

          <div class="mt-5">
            <label for="lastname" class="font-medium block mb-2">
              Cognome
            </label>
            <span>{{ popupStore.data.lastname }}</span>
          </div>

          <div class="mt-5">
            <label for="lastname" class="font-medium block mb-2"> Email </label>
            <span>{{ popupStore.data.email }}</span>
          </div>

          <div class="mt-5">
            <label for="lastname" class="font-medium block mb-2">
              Telefono
            </label>
            <span>{{ popupStore.data.telephone }}</span>
          </div>
        </div>
        <div>
          <div class="mt-5">
            <label for="name" class="font-medium block mb-2">
              Competenze
            </label>
            <p v-if="popupStore.data.skills.length === 0">
              Non ci sono competenze per questo candidato
            </p>
            <ul v-else>
              <li v-for="skill in popupStore.data.skills" :key="skill.id">
                {{ skill.description }} - {{ skill.skill_type.description }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
    <template #actions>
      <Button
        label="Salva"
        class="p-button-rounded p-button-info font-semibold mr-2"
        @click="sendData('uploadCandidate')">
        <i class="pi pi-id-card mr-2 text-xl"></i> Sovrascrivi anagrafica
      </Button>
      <Button
        label="Salva"
        class="p-button-rounded p-button-success font-semibold"
        @click="sendData('uploadCandidateWithSkills')">
        <i class="pi pi-sliders-h mr-2 text-xl"></i> Sovrascrivi anagrafica e
        competenze
      </Button>
    </template>
  </Popup>
</template>
<script>
import { onBeforeMount } from "vue";
import Popup from "@/components/shared/Popup.vue";
import { usePopupStore } from "@/store/popups";
import { useApiStore } from "@/store/api";
import { useFormStore } from "@/store/forms";

export default {
  name: "ExamplePopup",
  components: { Popup },
  props: ["url"],
  emits: ["emptyTable", "fetchData"],
  setup(props, context) {
    const popupStore = usePopupStore();
    const apiStore = useApiStore();
    const formStore = useFormStore();
    onBeforeMount(() => {
      popupStore.color = "warning";
      popupStore.title = "Candidato già presente";
      popupStore.icon = "pi-exclamation-triangle";
    });

    const sendData = async (appendData) => {
      context.emit("emptyTable", true);
      await apiStore.store(
        props.url,
        formStore.id + "Candidate",
        true,
        appendData
      );
      apiStore.isLoading = true;
      const response = await apiStore.fetch(props.url, apiStore.params);
      context.emit("fetchData", response);
    };

    return { popupStore, sendData };
  },
};
</script>
