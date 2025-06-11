<template>
  <Popup size="popup-s">
    <template #content>
      <div :class="['rounded-md', 'p-3', 'shadow-lg', 'relative', bgClass]">
        <p>{{ messageToShow }}</p>
      </div>
      <!-- <div class="grid grid-cols-2 m-0">
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
      </div> -->
    </template>
    <!-- <template #actions>
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
    </template> -->
  </Popup>
</template>
<script>
import { onMounted, computed, watch } from "vue";
import Popup from "@/components/shared/Popup.vue";
import { usePopupStore } from "@/store/popups";
// import { useApiStore } from "@/store/api";
// import { useFormStore } from "@/store/forms";

export default {
  name: "BadgePopup",
  components: { Popup },
  props: ["url", "numberOfNotConvalidatedPunches"],
  emits: ["emptyTable", "fetchData"],
  setup(props) {
    const popupStore = usePopupStore();
    // const apiStore = useApiStore();
    // const formStore = useFormStore();

    const bgClass = computed(() => {
      return props.numberOfNotConvalidatedPunches > 0 ? 'bg-warning' : 'bg-success';
    });

    const messageToShow = computed(() => {
    return props.numberOfNotConvalidatedPunches > 0 ? `Ci sono ${props.numberOfNotConvalidatedPunches} timbrature da convalidare. vai alla pagina 'Timbrature Da Convalidare' ` : `Non ci sono timbrature da convalidare.`
    })

    // Funzione che aggiorna lo store in base alla prop
    const updatePopup = (value) => {
      if (value > 0) {
        popupStore.color = "warning";
        popupStore.title = "Timbrature da convalidare";
        popupStore.icon = "pi-exclamation-triangle";
      } else {
        popupStore.color = "success";
        popupStore.title = "Timbrature da convalidare";
        popupStore.icon = "pi-check";
      }
    };

    onMounted(() => {
      //  console.log("Mounted with:", props.numberOfNotConvalidatedPunches);
      updatePopup(props.numberOfNotConvalidatedPunches);
    });

watch(
  () => props.numberOfNotConvalidatedPunches,
  (newVal) => {
    // console.log("WATCH triggered! Nuovo valore:", newVal);
    updatePopup(newVal);
  },
  { immediate: true } // <-- questo è fondamentale
);

    return { popupStore, bgClass, messageToShow };
  },
};
</script>
