const APP_BASE_URL = "https://app.breviarium.es";

const pad = (n: number) => n.toString().padStart(2, '0');

// Public link to a page for a given day, e.g. https://app.breviarium.es/2026/10/14/evangelium
export const datedShareUrl = (date: Date, page: string): string =>
    `${APP_BASE_URL}/${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${page}`;

// Public link to a page that isn't tied to a date, e.g. https://app.breviarium.es/popular-prayers/rosary
export const staticShareUrl = (page: string): string => `${APP_BASE_URL}/${page}`;
