<template>
  <Transition name="bounce" appear>
    <password-recovery />
  </Transition>
</template>
<script>
import PasswordRecovery from "@/components/auth/PasswordRecovery.vue";

export default {
  name: "PasswordRecoveryView",
  components: {
    PasswordRecovery,
  },
};
</script>
