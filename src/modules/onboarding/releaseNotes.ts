import {
    appsOutline,
    bookmarkOutline,
    bookOutline,
    calendarOutline,
    colorPaletteOutline,
    contrastOutline,
    headsetOutline,
    informationCircleOutline,
    languageOutline,
    notificationsOutline,
    optionsOutline,
    phonePortraitOutline,
    playCircleOutline,
    reorderTwoOutline,
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
        {icon: colorPaletteOutline, text: "Rediseño de la aplicación"},
        {icon: roseOutline, text: "Nuevas oraciones populares"},
        {icon: searchOutline, text: "Búsqueda en el Santoral"},
        {icon: bookOutline, text: "Oficio bienal añadido"},
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
        {icon: shieldCheckmarkOutline, text: "Mejoras de estabilidad en iOS"},
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
    "3.3.0": [
        {
            icon: bookOutline,
            text: "Nuevo Padre nuestro en latín (Pater noster)",
        },
        {
            icon: languageOutline,
            text: "Nuevo ajuste en Ajustes para preferir las oraciones en latín cuando haya versión disponible",
        },
        {
            icon: appsOutline,
            text: "En la app móvil, la barra de pestañas se oculta por completo al bajar y reaparece al subir",
        },
        {
            icon: playCircleOutline,
            text: "El botón de desplazamiento automático se ajusta a la barra de pestañas y ya no se solapa con ella",
        },
    ],
    "3.4.0": [
        {
            icon: headsetOutline,
            text: "Nueva lectura en voz alta: escucha la oración completa con la voz de tu dispositivo",
        },
        {
            icon: optionsOutline,
            text: "Mientras escuchas, pausa, salta frases y ajusta la velocidad, el tono y la voz",
        },
        {
            icon: notificationsOutline,
            text: "Avisos diarios para cada hora de la Liturgia y el Ángelus, en la app para Android e iOS",
        },
        {
            icon: shareOutline,
            text: "Compartir, escribir en el Diario y los avisos, ahora a un toque en la cabecera de cada oración",
        },
        {
            icon: roseOutline,
            text: "Nueva oración a la Virgen: Acordaos",
        },
        {
            icon: languageOutline,
            text: "El Ángelus, ahora también en latín",
        },
    ],
    "3.4.2": [
        {
            icon: roseOutline,
            text: "Nueva oración al Espíritu Santo: Secuencia de Pentecostés",
        },
        {
            icon: bookOutline,
            text: "Ahora se muestra el tomo del salterio correspondiente en la liturgia de las horas",
        },
        {
            icon: languageOutline,
            text: "El Acordaos, ahora también en latín (Memoráre)",
        },
    ],
    "3.4.3": [
        {
            icon: bookOutline,
            text: "Biblia: referencias cruzadas junto a cada versículo, con un recorrido flotante para volver sobre tus pasos",
        },
        {
            icon: optionsOutline,
            text: "Biblia: muestra u oculta las referencias cruzadas desde el menú de la cabecera o desde Ajustes",
        },
        {
            icon: roseOutline,
            text: "Nuevas oraciones: Consagración al Corazón de Jesús y María, Soneto a Cristo crucificado, Via Crucis",
        },
        {
            icon: reorderTwoOutline,
            text: "Reordena tus intenciones de oración arrastrándolas",
        },
        {
            icon: shareOutline,
            text: "Compartir, ahora también en todas las oraciones populares",
        },
        {
            icon: headsetOutline,
            text: "El Rosario, ahora con la estructura completa de cada misterio: Padre nuestro, diez Avemarías y Gloria, para rezarlo también en voz alta",
        },
        {
            icon: colorPaletteOutline,
            text: "El Santoral, con nuevo diseño: más datos del santo del día y los demás santos a la vista",
        },
        {
            icon: colorPaletteOutline,
            text: "Mejoras generales de diseño",
        },
    ],
};
