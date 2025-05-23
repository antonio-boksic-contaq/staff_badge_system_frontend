<template>
  <div class="layout-menu-container">
    <AppSubmenu
      :items="model"
      class="layout-menu"
      :root="true"
      @menuitem-click="onMenuItemClick"
      @keydown="onKeyDown" />
  </div>
</template>

<script>
import AppSubmenu from "./AppSubmenu";

export default {
  props: {
    model: Array,
  },
  components: {
    AppSubmenu: AppSubmenu,
  },
  setup(props, context) {
    const onMenuItemClick = (event) => {
      context.emit("menuitem-click", event);
    };

    const onKeyDown = (event) => {
      const nodeElement = event.target;
      if (event.code === "Enter" || event.code === "Space") {
        nodeElement.click();
        event.preventDefault();
      }
    };

    return {
      onKeyDown,
      onMenuItemClick,
    };
  },
};
</script>
