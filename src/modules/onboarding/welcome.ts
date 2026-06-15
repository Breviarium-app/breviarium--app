/* eslint no-console: ["error", { allow: ["log", "info", "warn"] }] */
import {version} from "../../../package.json"

/* Prints the app name and version, helpful for debugging */
export const welcomeMsg = () => {
    const v = version;
    console.info(`\n%cBreviarium v${v} 🚀`, 'color:#fce8b1; background:#0b1021; font-size:1.3rem; padding:0.25rem 0.55rem; margin: 1rem auto; font-family: monospace; border: 1px solid #ec806b; border-radius: 4px;font-weight: 600;');
    console.info(`\n%c¡Hola! 🧑🏻‍💻 Si quieres colaborar con esta aplicación open-source consulta https://breviarium.es/ y https://github.com/breviarium-app/\nSi quieres desarrollar una aplicación con el contenido de la Liturgia de las Horas, está disponible la librería "breviarium" https://docs.breviarium.es/core/ open-source ✅`, 'color:#fce8b1; background:#0b1021; font-size:1em; padding:1.25rem 0.55rem; margin: 0rem auto; font-family: monospace; border: 1px solid #ec806b; border-radius: 4px;font-weight: bold;');
};