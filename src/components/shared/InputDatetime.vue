<template>
  <datepicker
    locale="it"
    cancelText="Cancella"
    selectText="Seleziona"
    placeholder="Inserire la data e l'ora"
    :start-time="startTime"
    :format="format"
    v-model="selectedValue">
  </datepicker>
  <input
    type="hidden"
    name="date"
    placeholder="Inserire data e ora"
    v-model="dbValue" />
</template>
<script>
import { ref, watch } from "vue";

export default {
  name: "InputDatetime",
  props: ["value"],
  emits: ["dateTimeValueChange"],
  setup(props, context) {
    const selectedValue = ref(props.value);
    const dbValue = ref(props.value);
    const startTime = ref({ hours: "00", minutes: "00" });

    const getDate = (date) => {
      if (date === null) return;
      const day = date.getDate();
      const month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      const year = date.getFullYear();
      const hour = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return { day, month, year, hour, minutes };
    };

    const format = (date) => {
      const dateTime = getDate(date);
      const { day, month, year, hour, minutes } = dateTime;
      return day + "/" + month + "/" + year + " " + hour + ":" + minutes;
    };

    watch(selectedValue, (selectedValue, oldValue) => {
      if (selectedValue != oldValue) {
        const dateTime = getDate(selectedValue);
        if (dateTime === undefined) dbValue.value = "";
        else {
          const { day, month, year, hour, minutes } = dateTime;
          dbValue.value =
            year + "-" + month + "-" + day + " " + hour + ":" + minutes;
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
