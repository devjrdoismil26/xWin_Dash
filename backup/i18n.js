import i18n from "i18next";
import { initReactI18next   } from "react-i18next";

const resources = {};
const modules = import.meta.glob("./i18n/*.json", { eager: true });

for (const path in modules) {
  const fileName = path.split("/").pop().replace(".json", "");
  resources.pt = {
    ...resources.pt,
    [fileName]: modules[path].default,
  };
}

i18n.use(initReactI18next).init({
  resources,
  lng: "pt",
  fallbackLng: "pt",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
