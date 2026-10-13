import {SaintInfo} from "sanctus";

export const saintPath = (saint: SaintInfo): string =>
    `/saint/${saint.month}/${saint.day}/${encodeURIComponent(saint.name)}`

// Month is 1-12 in SaintInfo; year 2000 is a leap year so 29 February formats correctly
export const formatFeastDay = (month: number, day: number, locale: string): string =>
    new Intl.DateTimeFormat(locale, {day: 'numeric', month: 'long'}).format(new Date(2000, month - 1, day))
