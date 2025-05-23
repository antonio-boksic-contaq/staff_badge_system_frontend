<template>
  <ul :class="{ error: vuelidate.$errors.length }">
    <li
      class="text-xxl font-semibold text-danger float-left shake w-full"
      v-for="error of vuelidate.$errors"
      :key="error.$uid">
      {{ error.$message }}
    </li>
  </ul>
</template>
<script>
export default {
  name: "ValidationError",
  props: ["vuelidate"],
};
</script>
