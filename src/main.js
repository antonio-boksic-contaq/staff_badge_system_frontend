import "primevue/resources/primevue.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "prismjs/themes/prism-coy.css";
/* Custom */
import "vue-toastification/dist/index.css";
import "vue-select/dist/vue-select.css";
import "@/assets/style.css";
import "@/assets/tailwind.css";
import "@vuepic/vue-datepicker/dist/main.css";
import "dropzone-vue/dist/dropzone-vue.common.css";

import { createApp, reactive } from "vue";
import { createPinia } from "pinia";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import router from "./router";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Badge from "primevue/badge";
import BadgeDirective from "primevue/badgedirective";
import Button from "primevue/button";
import ConfirmationService from "primevue/confirmationservice";
import InputMask from "primevue/inputmask";
import InputNumber from "primevue/inputnumber";
import InputSwitch from "primevue/inputswitch";
import RadioButton from "primevue/radiobutton";
import InputText from "primevue/inputtext";
import Ripple from "primevue/ripple";
import ScrollTop from "primevue/scrolltop";
import StyleClass from "primevue/styleclass";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Panel from "primevue/panel";
import Textarea from "primevue/textarea";
import ToastService from "primevue/toastservice";
import Datepicker from "@vuepic/vue-datepicker";
import vTitle from "vuejs-title";
import Tooltip from "primevue/tooltip";
import SplitButton from "primevue/splitbutton";

import CodeHighlight from "./AppCodeHighlight";
/* Custom */
import Toast from "vue-toastification";
import vSelect from "vue-select";
import DropZone from "dropzone-vue";

router.beforeEach(function (to, from, next) {
  window.scrollTo(0, 0);
  next();
});

library.add(fas, far, fab);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);

app.config.globalProperties.$appState = reactive({
  theme: "tailwind-light",
  darkTheme: false,
});

app.config.devtools = true;

app.use(PrimeVue, { ripple: true, inputStyle: "outlined" });
app.use(ConfirmationService);
app.use(ToastService);
app.use(router);
/* custom */
app.use(pinia);
app.use(Toast);
app.use(vTitle);
app.use(DropZone);

app.directive("tooltip", Tooltip);
app.directive("ripple", Ripple);
app.directive("code", CodeHighlight);
app.directive("badge", BadgeDirective);
app.directive("styleclass", StyleClass);

app.component("SplitButton", SplitButton);
app.component("Accordion", Accordion);
app.component("AccordionTab", AccordionTab);
app.component("Badge", Badge);
app.component("Button", Button);
app.component("InputMask", InputMask);
app.component("InputNumber", InputNumber);
app.component("InputSwitch", InputSwitch);
app.component("InputText", InputText);
app.component("ScrollTop", ScrollTop);
app.component("Textarea", Textarea);
app.component("TabView", TabView);
app.component("TabPanel", TabPanel);
app.component("Panel", Panel);
app.component("RadioButton", RadioButton);
app.component("v-select", vSelect);
app.component("datepicker", Datepicker);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
