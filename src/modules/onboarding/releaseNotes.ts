import {
  bookmarkOutline,
  bookOutline,
  calendarOutline,
  colorPaletteOutline,
  roseOutline,
  searchOutline,
  shareOutline,
  shieldCheckmarkOutline,
  swapHorizontalOutline,
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
  "3.1.0": [
    { icon: bookmarkOutline, text: "Nuevo Diario para escribir tus notas de oración" },
    { icon: bookOutline, text: "Anota reflexiones desde el Evangelio, las lecturas o la Biblia" },
    { icon: swapHorizontalOutline, text: "Desliza el calendario para cambiar de día" },
    { icon: shieldCheckmarkOutline, text: "Mejoras de estabilidad en iOS" },
  ],
  "3.1.2": [
    { icon: calendarOutline, text: "Busca tus notas del Diario y navega por calendario" },
    { icon: shareOutline, text: "Comparte Laudes, Vísperas y el resto de horas con un toque" },
    { icon: roseOutline, text: "Nuevas oraciones populares: a San José, Acto de contrición, Credo, Alma de Cristo, Comunión espiritual y oración a la Sagrada Familia" },
  ],
};
