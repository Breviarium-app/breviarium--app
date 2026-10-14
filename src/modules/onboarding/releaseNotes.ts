import {
  bookOutline,
  colorPaletteOutline,
  roseOutline,
  searchOutline,
} from "ionicons/icons";

export type ReleaseNote = { icon: string; text: string };

// "What's new" entries per app version (package.json). Versions without an entry show no popup.
export const RELEASE_NOTES: Record<string, ReleaseNote[]> = {
  "3.0.0": [
    { icon: colorPaletteOutline, text: "Rediseño de la aplicación" },
    { icon: roseOutline, text: "Nuevas oraciones populares" },
    { icon: searchOutline, text: "Búsqueda en el Santoral" },
    { icon: bookOutline, text: "Oficio bienal añadido" },
  ],
};
