<template>
  <full-calendar :options="calendarOptions" :key="calendarKey" />
</template>
<script>
// import { useApiStore } from "@/store/api";
import { useLoadingStore } from "@/store/loadings";
import { useModalStore } from "@/store/modals";
import { useAuthStore } from "@/store/auth";
import { ref, watch, onBeforeMount } from "vue";
import FullCalendar from "@fullcalendar/vue3"; // questo è un componente di vue
import dayGridPlugin from "@fullcalendar/daygrid"; // questo è un componente di vue
import timeGridPlugin from "@fullcalendar/timegrid"; // questo è un componente di vue
import itLocale from "@fullcalendar/core/locales/it";
import interactionPlugin from "@fullcalendar/interaction";


export default {
  components: {

    FullCalendar,
  },
  props: ["userIdToLookFor","startDate","endDate","punches"],
  setup(props) {
    const modalStore = useModalStore();
    // const apiStore = useApiStore();
    const loadingStore = useLoadingStore();
    const authStore = useAuthStore();
    // const url = process.env.VUE_APP_API_URL + "/getAllPunches"; // questa va bene per admin
    //serve url per staff che vede solo le proprie.



    // const url = process.env.VUE_APP_API_URL + "/campaigns/calendar";
    // const campaignUrl = process.env.VUE_APP_API_URL + "/campaigns";
    const item = ref(null);
    const calendarKey = ref(0);

    onBeforeMount(()=> {
      // console.log("STO MONTANDO TABELLA CAMPAIGN CALENDAR")
    })

    // questa è la funzione che viene chiamata sul click di un elemento nel calendario
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

      const initialTitle = authStore.user.role === "Staff" ? "Dettaglio Timbratura " : 
      modalStore.item.extendedProps.AdminLookingForUser == 0 ? "Dettaglio Timbrature " : "Dettaglio Timbratura " + el.event.title + " "

      modalStore.title = initialTitle + el.event.start.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
      modalStore.modalToShow = "item detail";
      loadingStore.stop();
    };

    const refreshCalendar = () => {
      calendarKey.value += 1;
    };

watch(
  () => props.userIdToLookFor,
  (newVal, oldVal) => {
    console.log("userIdToLookFor è cambiato", newVal, 'oldVal:', oldVal);
    calendarKey.value += 1; // forza il rerender del componente FullCalendar
  }
);

watch(
  () => props.punches,
  (newVal, oldVal) => {
    console.log("punches è cambiato", newVal, 'oldVal:', oldVal);
    calendarKey.value += 1; // forza il rerender del componente FullCalendar
  }
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
      events: async () => {
          // loadingStore.load();

          // // const { startStr, endStr } = info; questo info era un parametro di async di events poco sopra, mi dava info come primo e ultimo giorno che vedo nel calendario
          // // let urlWithParams = url + "?start=" + startStr + "&end=" + endStr;

          // let urlWithParams = url + "?startDate=" + props.startDate + "&endDate=" + props.endDate;

          // if (props.userIdToLookFor) {
          //   urlWithParams += "&user_id=" + props.userIdToLookFor;
          // }

          // console.log("urlwithparams", urlWithParams)
          // let response = await apiStore.fetch(urlWithParams);
          let response = props.punches

          console.log("response-----------------", response)
          // console.log("RESPONSE", response);

            if (props.userIdToLookFor) {
              console.log("STO IN EVENTS DEL CALNDARIO", props.userIdToLookFor)
              response = response.filter(item => item.user_id === props.userIdToLookFor);
            }

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
            title: item.surname + " " + item.name, 
            start: item.check_in,
            end: item.check_out,
            extendedProps: {
              notes: item.notes,
              userId: item.user_id,
              eventDate: new Date(item.check_in).toLocaleDateString(), // Aggiungiamo la data dell'evento
              eventsCount: eventsByDate?.length || 0, // Numero di eventi per quella data
              AdminLookingForUser: props.userIdToLookFor ? 1 : 0
            },
          }));

          console.log("arraytoreturn", arraytoreturn)
          loadingStore.stop();
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

  if (authStore.user.role === 'Admin' && !props.userIdToLookFor ) {
    if (!isFirstOfDay) return null;

    customEl.innerHTML = `
      <div class="p-1">
        <span class="block text-2xl text-black whitespace-normal break-words">
          Risorse entrate: ${checkInCount}
        </span>
        <span class="block text-2xl text-black whitespace-normal break-words">
          Risorse uscite: ${checkOutCount}
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
},
eventDidMount: function(info) {
  const el = info.el;
  const event = info.event;

  // Solo se admin e non sta cercando uno user specifico
  if (authStore.user.role === 'Admin' && !props.userIdToLookFor) {
    const calendar = info.view.calendar;
    const allEvents = calendar.getEvents();

    // Format: YYYY-MM-DD (senza orario)
    const currentDate = event.start.toISOString().split('T')[0];

    const eventsOnSameDay = allEvents.filter(e => {
      return e.start.toISOString().split('T')[0] === currentDate;
    });

    // Ordina per orario di inizio
    eventsOnSameDay.sort((a, b) => a.start - b.start);

    const isFirstOfDay = eventsOnSameDay[0].id === event.id;

    if (!isFirstOfDay) {
      el.style.visibility = 'hidden';
el.style.height = '0px';
el.style.padding = '0';
el.style.margin = '0';
    }
  }
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

<style>

.fc-day-today {
  background-color: #e0f3ff !important;
  border: 2px solid #007bff73 !important;
  border-radius: 6px;
}

/* Cambia colore del numero del giorno */
.fc-day-today .fc-daygrid-day-number {
  color: #007BFF !important;
  font-weight: bold;
}

.fc-daygrid-event-harness {
  visibility: "hidden";
  margin: 0 !important;
  padding: 0 !important;
  height: 0 !important;
}
</style>
