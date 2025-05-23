<template>
  <div class="grid grid-cols-12 gap-7 mx-0 mt-5">
    <div class="col-start-1 col-end-5">
      <h5 class="font-medium">Disponibili</h5>
      <span class="p-input-icon-left w-full mb-3">
        <i class="pi pi-search" />
        <InputText
          type="text"
          placeholder="Cerca..."
          class="py-1 w-full"
          @keyup="filter('available', $event)" />
      </span>
      <ul class="max-h-108 overflow-y-auto listbox overflow-x-hidden">
        <TransitionGroup name="scale-in" appear>
          <li
            v-for="option in availableOptions"
            :key="option.id"
            :data-id="option.id"
            @click="focus('available', $event)">
            {{ option[labelField] }}
          </li>
        </TransitionGroup>
      </ul>
    </div>
    <div class="col-start-5 col-end-9">
      <div class="flex h-full justify-center items-center flex-col">
        <div class="mb-10">
          <Button
            class="p-button-text p-button-secondary font-semibold block w-full mt-4 mx-auto"
            @click="assignSelected">
            <i class="pi pi-angle-right mr-2 text-xl"></i>
            Assegna selezionati
          </Button>

          <Button
            class="p-button-text p-button-secondary font-semibold block w-full mt-4 mx-auto"
            @click="removeSelected">
            <i class="pi pi-angle-left mr-2 text-xl"></i>
            Rimuovi selezionati
          </Button>
        </div>
        <div>
          <Button
            class="p-button-text p-button-secondary font-semibold block w-full mt-4 mx-auto"
            @click="assignAll">
            <i class="pi pi-angle-double-right mr-2 text-xl"></i>
            Assegna tutti
          </Button>
          <Button
            class="p-button-text p-button-secondary font-semibold block w-full mt-4 mx-auto"
            @click="removeAll">
            <i class="pi pi-angle-double-left mr-2 text-xl"></i>
            Rimuovi tutti
          </Button>
        </div>
      </div>
    </div>
    <div class="col-start-9 col-end-13">
      <h5 class="font-medium">Assegnati</h5>
      <span class="p-input-icon-left w-full mb-3">
        <i class="pi pi-search" />
        <InputText
          type="text"
          placeholder="Cerca..."
          class="py-1 w-full"
          @keyup="filter('assigned', $event)" />
      </span>
      <ul class="max-h-108 overflow-y-auto listbox overflow-x-hidden">
        <TransitionGroup name="scale-in" appear>
          <li
            v-for="value in assignedValues"
            :key="value.id"
            :data-id="value.id"
            @click="focus('assigned', $event)">
            {{ value[labelField] }}
          </li>
        </TransitionGroup>
      </ul>
    </div>
  </div>
  <select
    class="hidden"
    :id="field"
    :name="field + '[]'"
    v-model="selectedValue"
    multiple>
    <option v-for="option in options" :key="option.id">
      {{ option.id }}
    </option>
  </select>
</template>
<script>
import { onMounted, ref, watch } from "vue";
import { sortArray } from "@/utils/arrays";
import { addItemData } from "@/utils/select";

export default {
  name: "Listbox",
  props: ["doubleEmit", "field", "label", "placeholder", "options", "value"],
  emits: ["selectedValueChange"],
  setup(props, context) {
    const selectedValue = ref(props.value);
    const optionValues = ref(props.value);
    const assignedValues = ref([]);
    const availableOptions = ref([]);
    const selectedItem = ref([]);
    const selectedItemToRemove = ref([]);
    const fixedAvailableOptions = ref([]);
    const fixedAssignedValues = ref([]);

    const labelField = props.label.includes("|") ? "itemData" : props.label;

    onMounted(async () => {
      if (
        props.value !== undefined &&
        props.value !== null &&
        props.value.length > 0
      ) {
        selectedValue.value.forEach((element) => {
          optionValues.value.push(element.id);
          assignedValues.value.push(element);
        });
        if (props.label.includes("|"))
          assignedValues.value = await addItemData(
            assignedValues.value,
            props.label
          );
        fixedAssignedValues.value = assignedValues.value;
        selectedValue.value = optionValues.value;
      }
    });

    watch(
      () => props.value,
      (value) => (selectedValue.value = value)
    );

    watch(
      () => props.options,
      (value) => {
        availableOptions.value = value.filter(
          (element) => !props.value.includes(element.id)
        );
        fixedAvailableOptions.value = availableOptions.value;
      }
    );

    watch(selectedValue, (selectedValue, oldValue) => {
      if (
        selectedValue != oldValue &&
        ((selectedValue !== null && String(selectedValue).length > 0) ||
          (oldValue !== null && String(oldValue).length > 0))
      ) {
        if (props.doubleEmit !== undefined)
          context.emit("selectedValueChange", { oldValue, selectedValue });
        else context.emit("selectedValueChange", selectedValue);
      }
    });

    const handleOption = (option) => {
      if (props.label.includes("|")) {
        let optionLabel = "";
        props.label.split("|").forEach((e) => {
          if (Object.prototype.hasOwnProperty.call(option, e))
            optionLabel += option[e] + " ";
        });
        return optionLabel;
      } else {
        return option[props.label];
      }
    };

    const focus = (type, e) => {
      e.target.classList.toggle("active");
      const id = e.target.dataset.id;
      if (type === "available") {
        const index = selectedItem.value.findIndex((i) => i.id == id);
        if (index !== -1)
          selectedItem.value.splice(selectedItem.value.indexOf(id), 1);
        else
          selectedItem.value.push({
            id: id,
            [labelField]: e.target.textContent,
          });
      } else {
        const index = selectedItemToRemove.value.findIndex((i) => i.id == id);
        if (index !== -1)
          selectedItemToRemove.value.splice(
            selectedItemToRemove.value.indexOf(id),
            1
          );
        else
          selectedItemToRemove.value.push({
            id: id,
            [labelField]: e.target.textContent,
          });
      }
    };

    const assignSelected = () => {
      assignedValues.value.push(...selectedItem.value);
      fixedAssignedValues.value = assignedValues.value;
      sortArray(assignedValues.value, labelField);
      selectedValue.value = assignedValues.value.map((item) => item.id);

      selectedItem.value.forEach((element) => {
        const index = availableOptions.value.findIndex(
          (i) => i.id == element.id
        );
        if (index !== -1) availableOptions.value.splice(index, 1);
      });

      selectedItem.value = [];
    };

    const assignAll = () => {
      selectedItem.value = [];
      selectedItemToRemove.value = [];
      assignedValues.value.push(...availableOptions.value);
      selectedValue.value = assignedValues.value.map((item) => item.id);
      availableOptions.value = [];
      sortArray(assignedValues.value, labelField);
    };

    const removeAll = () => {
      selectedItem.value = [];
      selectedItemToRemove.value = [];
      availableOptions.value.push(...assignedValues.value);
      fixedAssignedValues.value = assignedValues.value;
      fixedAvailableOptions.value = availableOptions.value;
      selectedValue.value = [];
      assignedValues.value = [];
      sortArray(availableOptions.value, labelField);
    };

    const removeSelected = () => {
      availableOptions.value.push(...selectedItemToRemove.value);
      fixedAvailableOptions.value = availableOptions.value;
      sortArray(availableOptions.value, labelField);

      selectedItemToRemove.value.forEach((element) => {
        const index = assignedValues.value.findIndex((i) => i.id == element.id);
        if (index !== -1) assignedValues.value.splice(index, 1);
      });
      fixedAssignedValues.value = assignedValues.value;
      selectedValue.value = assignedValues.value.map((item) => item.id);

      selectedItemToRemove.value = [];
    };

    const filter = (type, event) => {
      const search = event.target.value;
      if (type === "available") {
        availableOptions.value = fixedAvailableOptions.value.filter((e) =>
          e[labelField].toLowerCase().includes(search.toLowerCase())
        );
      }
      if (type === "assigned") {
        assignedValues.value = fixedAssignedValues.value.filter((e) =>
          e[labelField].toLowerCase().includes(search.toLowerCase())
        );
      }
    };

    return {
      assignAll,
      assignSelected,
      assignedValues,
      availableOptions,
      handleOption,
      filter,
      focus,
      labelField,
      removeAll,
      removeSelected,
      selectedValue,
    };
  },
};
</script>
