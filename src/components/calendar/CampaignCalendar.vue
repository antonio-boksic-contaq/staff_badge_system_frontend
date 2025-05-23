<template>
  <full-calendar :options="calendarOptions" :key="calendarKey" />
  <!-- <campaign-modal
    :url="campaignUrl"
    :item="item"
    @fetchData="refreshCalendar" /> -->
     <punch-modal/>
</template>
<script>
import { useApiStore } from "@/store/api";
import { useLoadingStore } from "@/store/loadings";
import { useModalStore } from "@/store/modals";
import { useAuthStore } from "@/store/auth";
import { ref, watch } from "vue";
import FullCalendar from "@fullcalendar/vue3"; // questo è un componente di vue
import dayGridPlugin from "@fullcalendar/daygrid"; // questo è un componente di vue
import timeGridPlugin from "@fullcalendar/timegrid"; // questo è un componente di vue
import itLocale from "@fullcalendar/core/locales/it";
import interactionPlugin from "@fullcalendar/interaction";
import PunchModal from "@/components/modals/PunchModal";

export default {
  components: {
    PunchModal,
    FullCalendar,
  },
  props: ["filters"],
  setup(props) {
    const modalStore = useModalStore();
    const apiStore = useApiStore();
    const loadingStore = useLoadingStore();
    const authStore = useAuthStore();
    const url = process.env.VUE_APP_API_URL + "/getAllPunches"; // questa va bene per admin
    //serve url per staff che vede solo le proprie.



    // const url = process.env.VUE_APP_API_URL + "/campaigns/calendar";
    // const campaignUrl = process.env.VUE_APP_API_URL + "/campaigns";
    const item = ref(null);
    const calendarKey = ref(0);

    const itemAction = async (el) => {
      console.log("cliccato casella del calendario")
      loadingStore.load();
      modalStore.detailId = el.event.id;
      modalStore.item = el.event
      const formattedDate = el.event.start.toISOString().slice(0, 10);
      modalStore.date = formattedDate;
      modalStore.size = "modal-xl";
      // fino a qua va bene
      modalStore.open("", "detail");
      modalStore.icon = "pi-search";
      const initialTitle = authStore.user.role === "Staff" ? "Dettaglio Timbratura " : "Dettaglio Timbrature "
      modalStore.title = initialTitle + el.event.start.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
      modalStore.modalToShow = "item detail";
      loadingStore.stop();
    };

    const refreshCalendar = () => {
      calendarKey.value += 1;
    };

    watch(
      () => props.filters,
      () => (calendarKey.value += 1)
    );

    // questa è sostanzialmente confizurazione del calendario ---------------------------------------------------------------------------
    const calendarOptions = {
      locale: itLocale,
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      initialView: "dayGridMonth",
      eventClick: (el) => itemAction(el),
      headerToolbar: {
        start: "",
        center: "title",
        end: "prev,next",
      },

      contentHeight: 600,
      events: async (info) => {
          const { startStr, endStr } = info;
          let urlWithParams = url + "?start=" + startStr + "&end=" + endStr;

          let response = await apiStore.fetch(urlWithParams);
          console.log("RESPONSE", response);

          // Se l'utente è Admin, contiamo il numero di eventi per ogni giorno
          const eventsByDate = {};

          // Raggruppa gli eventi per data
          response.forEach(item => {
            const eventDate = new Date(item.check_in).toLocaleDateString(); // Data dell'evento senza ora
            if (!eventsByDate[eventDate]) {
              eventsByDate[eventDate] = [];
            }
            eventsByDate[eventDate].push(item);
          });

          console.log("EVENTSBYDATE",eventsByDate)

          // Restituisci gli eventi, aggiungendo il numero di eventi per ogni giorno
          const arraytoreturn = response.map((item) => ({
            id: item.id,
            title: item.name + " " + item.surname, 
            start: item.check_in,
            end: item.check_out,
            extendedProps: {
              notes: item.notes,
              userId: item.user_id,
              eventDate: new Date(item.check_in).toLocaleDateString(), // Aggiungiamo la data dell'evento
              eventsCount: eventsByDate?.length || 0, // Numero di eventi per quella data
            },
          }));

          console.log("arraytoreturn", arraytoreturn)

          return arraytoreturn
        },      
eventContent: function (arg) {
  const start = new Date(arg.event.start).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  let end = ' - ';
  if (arg.event.end) {
    end = new Date(arg.event.end).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  const currentEvent = arg.event;
  const calendar = arg.view.calendar;
  const allEvents = calendar.getEvents();

  const currentDate = new Date(currentEvent.start).toLocaleDateString();

  // Eventi del giorno corrente
  const eventsOnThatDate = allEvents.filter(
    (e) => new Date(e.start).toLocaleDateString() === currentDate
  );

  // Conta quanti utenti hanno fatto check-in (start valido)
  const checkInCount = eventsOnThatDate.filter(e => e.start != null).length;

  // Conta quanti utenti hanno fatto check-out (end valido)
  const checkOutCount = eventsOnThatDate.filter(e => e.end != null).length;

  // Mostra solo una volta per data (prima evento del giorno)
  const isFirstOfDay =
    eventsOnThatDate.sort((a, b) => a.start - b.start)[0].id === currentEvent.id;

  const customEl = document.createElement("div");

  if (authStore.user.role === 'Admin') {
    if (!isFirstOfDay) return null;

    customEl.innerHTML = `
      <div class="p-1">
        <span class="block text-2xl text-black whitespace-normal break-words">
          Utenti che hanno fatto check-in: ${checkInCount}
        </span>
        <span class="block text-2xl text-black whitespace-normal break-words">
          Utenti che hanno fatto check-out: ${checkOutCount}
        </span>
      </div>
    `;
  } else {
    customEl.innerHTML = `
      <div class="p-1">
        <span class="block text-2xl text-black truncate overflow-hidden"> IN: ${start || ""}</span>
        <span class="block text-2xl text-black truncate overflow-hidden"> OUT: ${end || ""}</span>
      </div>
    `;
  }

  return { domNodes: [customEl] };
}

    };

    return {
      calendarKey,
      calendarOptions,
      // campaignUrl,
      item,
      refreshCalendar,
    };
  },
};
</script>
