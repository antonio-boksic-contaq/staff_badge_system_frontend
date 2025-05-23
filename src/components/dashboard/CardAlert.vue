<template>
  <div class="card mb-0" :class="'bg-' + color + '-100'">
    <div class="flex justify-content-between mb-3">
      <div>
        <span class="block uppercase text-bold font-medium mb-3">{{
          title
        }}</span>
      </div>
      <div
        class="flex align-items-center justify-content-center border-round"
        :class="'bg-' + color + '-200'"
        style="width: 2.5rem; height: 2.5rem">
        <i
          class="pi text-2xl"
          :class="'pi-' + icon + ' text-' + color + '-700'"></i>
      </div>
    </div>
    <p>{{ text }}</p>
    <router-link
      v-if="route !== undefined"
      :to="{
        name: route,
      }">
      <div class="w-full">
        <Button
          icon="pi pi-arrow-right"
          class="w-full p-button-rounded p-button-secondary p-button-text p-0 mt-5"
          :label="linkText"></Button>
      </div>
    </router-link>
  </div>
</template>
<script>
export default {
  name: "CardAlert",
  props: ["title", "text", "icon", "color", "route", "linkText"],
};
</script>
