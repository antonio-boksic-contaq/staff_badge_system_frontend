<template>
  <Transition name="bounce" appear>
    <login />
  </Transition>
</template>
<script>
import Login from "@/components/auth/Login.vue";

export default {
  name: "LoginView",
  components: {
    Login,
  },
};
</script>
