<template>
  <div class="card">
    <div class="mb-5">
      <h2 class="font-bold uppercase">
        <i class="pi pi-ban text-3xl mr-3 text-primary"></i>
        Titolo
      </h2>
    </div>
    <div class="mx-0 mt-7 grid grid-cols-1 md:grid-cols-12 gap-7">
      <div class="md:col-start-1 md:col-end-4">
        <select-filter
          label="Anno"
          text="year"
          :selectedValue="new Date().getFullYear()"
          :options="yearsOptions"
          field="year"
          @fetchData="fetchData($event, 'year')" />
      </div>
      <div class="md:col-start-4 md:col-end-13">
        <select-filter
          label="Mese"
          text="month"
          :multiple="true"
          :options="monthOptions"
          :selectedValue="[]"
          :combo="false"
          field="month"
          @fetchData="fetchData($event, 'month')" />
      </div>
    </div>
    <div class="grid mx-0 grid-cols-1 md:grid-cols-12 mt-10">
      <div class="col-start-1 col-end-5">
        <h4 class="text-black font-bold mb-5">Legenda</h4>
        <ul>
          <TransitionGroup name="scale-in" appear>
            <li v-for="(data, index) in chartData" :key="index">
              <span
                class="text-xl text-white tags w-fit mb-2"
                :style="{ backgroundColor: data.color }">
                <span class="tags tags-rounded bg-transparent mr-0">
                  {{ data.count }}
                </span>
                {{ data.description }}
              </span>
            </li>
          </TransitionGroup>
        </ul>
      </div>
      <div class="col-start-5 col-end-13">
        <div class="h-chart">
          <canvas
            id="polar"
            class="h-full w-auto mx-auto overflow-x-hidden"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Chart from "chart.js/auto";
import { onBeforeMount, ref } from "vue";
import { useApiStore } from "@/store/api";
import { useLoadingStore } from "@/store/loadings";
import { monthOptions } from "@/utils/filter";
import SelectFilter from "@/components/actions/SelectFilter.vue";

export default {
  name: "GraphExample",
  components: {
    SelectFilter,
  },
  setup() {
    const apiStore = useApiStore();
    const urlYears = process.env.VUE_APP_API_URL + "/url";
    const url = process.env.VUE_APP_API_URL + "url";
    const loadingStore = useLoadingStore();
    const chartData = ref([]);
    const yearsOptions = ref([]);
    const apiParams = ref(null);
    const chart = ref(null);

    const makeChart = () => {
      const chart = document.getElementById("polar");
      return new Chart(chart, {
        type: "polarArea",
        data: {
          labels: chartData.value.map((item) => item.description),
          datasets: [
            {
              label: "Label",
              data: chartData.value.map((item) => item.count),
              fill: true,
              backgroundColor: chartData.value.map((item) => item.color),
              borderColor: "#292929",
              tension: 0.1,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
            scale: {
              display: false,
            },
          },
          elements: {
            line: {
              borderWidth: 3,
            },
          },
          animations: {
            tension: {
              duration: 200,
              easing: "linear",
              from: 1,
              to: 0,
              loop: false,
            },
          },
        },
      });
    };

    onBeforeMount(async () => {
      apiParams.value = {
        year: new Date().getFullYear(),
      };
      loadingStore.load();
      yearsOptions.value = await apiStore.fetch(urlYears);
      chartData.value = await apiStore.fetch(url, apiParams.value);
      chart.value = makeChart();
      loadingStore.stop();
    });

    const fetchData = async (event, key) => {
      chart.value.destroy();
      const request = {
        ...apiParams.value,
        [key]: event,
      };
      if (event == null) delete request[key];
      apiParams.value = request;
      chartData.value = await apiStore.fetch(url, request);
      chart.value = makeChart();
    };

    return {
      chartData,
      fetchData,
      yearsOptions,
      monthOptions,
      url,
    };
  },
};
</script>
