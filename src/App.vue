<template>
  <div :class="containerClass" @click="onWrapperClick">
    <AppTopBar @menu-toggle="onMenuToggle" v-if="authStore.isLoggedIn" />
    <div
      class="layout-sidebar"
      @click="onSidebarClick"
      v-if="authStore.isLoggedIn">
      <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
    </div>

    <div
      :class="[
        !authStore.isLoggedIn ? 'm-0 p-0' : '',
        'layout-main-container',
      ]">
      <div
        :class="[
          !authStore.isLoggedIn
            ? 'flex h-full w-full items-center justify-center'
            : '',
          'layout-main',
        ]">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onBeforeMount, ref } from "vue";
import AppTopBar from "@/components/menu/AppTopbar.vue";
import AppMenu from "@/components/menu/AppMenu.vue";
// import DefaultMenu from "./service/DefaultMenu";
import Menu from "@/service/Menu";
import { useAuthStore } from "@/store/auth";
import { useSettingStore } from "@/store/settings";

export default {
  components: {
    AppTopBar: AppTopBar,
    AppMenu: AppMenu,
  },
  setup() {
    const layoutMode = ref("static");
    const staticMenuInactive = ref(false);
    const overlayMenuActive = ref(false);
    const mobileMenuActive = ref(false);
    const menuClick = ref(false);
    const menu = ref(Menu);
    const authStore = useAuthStore();
    const settingStore = useSettingStore();

    onBeforeMount(() => {
      console.log("menu", menu)
      document.documentElement.style.fontSize = settingStore.fontSize + "px";
      if (settingStore.darkMode)
        document.querySelector("html").setAttribute("theme", "dark");
      if (!settingStore.darkMode)
        document.querySelector("html").setAttribute("theme", "light");
    });

    const onWrapperClick = () => {
      if (!menuClick.value) {
        overlayMenuActive.value = false;
        mobileMenuActive.value = false;
      }

      menuClick.value = false;
    };

    const onMenuToggle = (event) => {
      menuClick.value = true;

      if (isDesktop()) {
        if (layoutMode.value === "overlay") {
          if (mobileMenuActive.value === true) {
            overlayMenuActive.value = true;
          }

          overlayMenuActive.value = !overlayMenuActive.value;
          mobileMenuActive.value = false;
        } else if (layoutMode.value === "static") {
          staticMenuInactive.value = !staticMenuInactive.value;
        }
      } else {
        mobileMenuActive.value = !mobileMenuActive.value;
      }

      event.preventDefault();
    };

    const onSidebarClick = () => {
      menuClick.value = true;
    };

    const onMenuItemClick = (event) => {
      if (event.item && !event.item.items) {
        overlayMenuActive.value = false;
        mobileMenuActive.value = false;
      }
    };

    const addClass = (element, className) => {
      if (element.classList) element.classList.add(className);
      else element.className += " " + className;
    };

    const removeClass = (element, className) => {
      if (element.classList) element.classList.remove(className);
      else
        element.className = element.className.replace(
          new RegExp(
            "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
            "gi"
          ),
          " "
        );
    };

    const isDesktop = () => {
      return window.innerWidth >= 992;
    };

    const containerClass = computed(() => {
      return [
        "layout-wrapper",
        {
          "layout-overlay": layoutMode.value === "overlay",
          "layout-static": layoutMode.value === "static",
          "layout-static-sidebar-inactive":
            staticMenuInactive.value && layoutMode.value === "static",
          "layout-overlay-sidebar-active":
            overlayMenuActive.value && layoutMode.value === "overlay",
          "layout-mobile-sidebar-active": mobileMenuActive.value,
        },
      ];
    });

    return {
      addClass,
      containerClass,
      layoutMode,
      authStore,
      menu,
      onMenuItemClick,
      onMenuToggle,
      onSidebarClick,
      onWrapperClick,
      removeClass,
    };
  },
};
</script>
