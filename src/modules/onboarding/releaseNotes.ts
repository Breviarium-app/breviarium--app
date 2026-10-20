import {
  appsOutline,
  bookmarkOutline,
  bookOutline,
  calendarOutline,
  colorPaletteOutline,
  contrastOutline,
  informationCircleOutline,
  phonePortraitOutline,
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
    {
      icon: bookmarkOutline,
      text: "Nuevo Diario para escribir tus notas de oración",
    },
    {
      icon: bookOutline,
      text: "Anota reflexiones desde el Evangelio, las lecturas o la Biblia",
    },
    {
      icon: swapHorizontalOutline,
      text: "Desliza el calendario para cambiar de día",
    },
    { icon: shieldCheckmarkOutline, text: "Mejoras de estabilidad en iOS" },
  ],
  "3.2.0": [
    {
      icon: colorPaletteOutline,
      text: "Diseño mejorado de la barra de pestañas y la navegación",
    },
    {
      icon: appsOutline,
      text: "La barra de pestañas ya no se oculta al hacer scroll en Inicio, Intenciones, Diario y Ajustes",
    },
    {
      icon: phonePortraitOutline,
      text: "Mejor ajuste a la pantalla en Android: la app ocupa todo el espacio bajo las barras del sistema",
    },
    {
      icon: informationCircleOutline,
      text: "Toca el número de versión en Ajustes para ver las novedades",
    },
    {
      icon: contrastOutline,
      text: "Android: Los iconos de la barra de estado se adaptan al tema elegido",
    },
  ],
  "3.1.2": [
    {
      icon: calendarOutline,
      text: "Busca tus notas del Diario y navega por calendario",
    },
    {
      icon: shareOutline,
      text: "Comparte Laudes, Vísperas y el resto de horas con un toque",
    },
    {
      icon: roseOutline,
      text: "Nuevas oraciones populares: a San José, Acto de contrición, Credo, Alma de Cristo, Comunión espiritual y oración a la Sagrada Familia",
    },
  ],
};
