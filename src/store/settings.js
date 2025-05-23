import { defineStore } from "pinia";

export const useSettingStore = defineStore("settings", {
  state: () => {
    return {
      fontSize: 10,
      darkMode: false,
    };
  },
  persist: true,
  actions: {
    async toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode)
        document.querySelector("html").setAttribute("theme", "dark");
      if (!this.darkMode)
        document.querySelector("html").setAttribute("theme", "light");
    },
    async setFontSize(fontSize) {
      this.fontSize = fontSize;
    },
  },
});
