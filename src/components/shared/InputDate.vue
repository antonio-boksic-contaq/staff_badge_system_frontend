<template>
  <datepicker
    locale="it"
    cancelText="Cancella"
    selectText="Seleziona"
    placeholder="Inserire la data"
    :start-time="startTime"
    :format="format"
    auto-apply
    date-picker
    :enable-time-picker="false"
    v-model="selectedValue">
  </datepicker>
  <input
    type="hidden"
    :name="field"
    placeholder="Inserire data"
    v-model="dbValue" />
</template>
<script>
import { ref, watch } from "vue";

export default {
  name: "InputDate",
  props: ["field", "value"],
  emits: ["dateTimeValueChange"],
  setup(props, context) {
    const selectedValue = ref(props.value);
    const dbValue = ref(props.value);
    const startTime = ref({ hours: 0, minutes: 0 });

    const getDate = (date) => {
      if (date === null) return;
      const day = date.getDate();
      const month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      const year = date.getFullYear();

      return { day, month, year };
    };

    const format = (date) => {
      const dateTime = getDate(date);
      const { day, month, year } = dateTime;
      return day + "/" + month + "/" + year;
    };

    watch(
      () => props.value,
      (value) => (selectedValue.value = value === null ? "" : value)
    );

    watch(selectedValue, (selectedValue, oldValue) => {
      selectedValue = selectedValue === null ? "" : selectedValue;
      if (selectedValue != oldValue) {
        if (selectedValue.length > 10) {
          const dateTime = getDate(selectedValue);
          if (dateTime === undefined) dbValue.value = "";
          else {
            const { day, month, year } = dateTime;
            dbValue.value = year + "-" + month + "-" + day;
          }
        } else {
          dbValue.value = selectedValue;
        }
        context.emit("dateTimeValueChange", dbValue);
      }
    });

    return {
      dbValue,
      format,
      selectedValue,
      startTime,
    };
  },
};
</script>
