<template>
  <div class="grid gird-cols-7 gap-7 m-0">
    <div class="col-start-1 col-end-5">
      <datepicker
        locale="it"
        cancelText="Cancella"
        selectText="Seleziona"
        placeholder="Inserire la data e l'ora del colloquio"
        :format="format"
        auto-apply
        date-picker
        :enable-time-picker="false"
        v-model="selectedValue">
      </datepicker>
    </div>
    <div class="col-start-5 col-end-8">
      <datepicker v-model="time" auto-apply time-picker />
    </div>
    <input
      type="hidden"
      :name="field"
      placeholder="Inserire data e ora del colloquio"
      v-model="dbValue" />
  </div>
</template>
<script>
import { ref, watch } from "vue";

export default {
  name: "InputDateTimePicker",
  props: ["field", "value"],
  emits: ["dateTimeValueChange"],
  setup(props, context) {
    const selectedValue = ref(props.value);
    const dbValue = ref(props.value);

    const getDate = (date) => {
      if (date === null) return;
      if (typeof date !== "object") date = new Date(date);
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

    const getTime = () => {
      if (props.value === null) return null;
      const date = new Date(props.value);
      const hour = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      if (hour === "00") return null;

      return {
        hours: hour,
        minutes: minutes,
      };
    };

    const time = ref(getTime());

    watch(
      [selectedValue, time],
      ([selectedValue, time], [oldValue, oldTime]) => {
        if (selectedValue != oldValue || time != oldTime) {
          const dateTime = getDate(selectedValue);
          if (dateTime === undefined) dbValue.value = "";
          else {
            const { day, month, year } = dateTime;
            dbValue.value = year + "-" + month + "-" + day;
            if (time != null) {
              const { hours, minutes } = time;
              dbValue.value += " " + hours + ":" + minutes;
            } else {
              dbValue.value += " 00:00";
            }
          }
          context.emit("dateTimeValueChange", dbValue);
        }
      }
    );

    return {
      dbValue,
      format,
      selectedValue,
      time,
    };
  },
};
</script>
