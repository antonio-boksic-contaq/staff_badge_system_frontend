<template>
  <h2 class="text-5xl font-normal mb-6">
    <i class="pi pi-filter-fill text-3xl font-medium text-primary"></i>
    Azioni e filtri
  </h2>
  <slot name="content"></slot>
</template>
<script>
export default {
  name: "DefaultAction",
};
</script>
