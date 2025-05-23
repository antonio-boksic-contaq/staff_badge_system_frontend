<template>
  <Transition name="bounce" appear>
    <div class="text-center mt-48">
      <div class="mb-10">
        <i class="pi pi-lock text-9xl text-danger"></i>
      </div>
      <h1 class="text-4xl font-medium">
        Non hai i permessi per accedere alla pagina
      </h1>
    </div>
  </Transition>
</template>
<script>
export default {
  name: "UnauthorizedView",
};
</script>
