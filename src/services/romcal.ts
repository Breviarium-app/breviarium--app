// import {LiturgicalCalendar, LiturgicalDay, Romcal} from "romcal";
// import {Spain_Es} from "@romcal/calendar.spain";
//
// const romcal_lib = new Romcal({localizedCalendar: Spain_Es});
//
// export async function perpetualCalendar(year: number) {
//     try {
//         return await romcal_lib.generateCalendar(year);
//     } catch (error) {
//         console.error(error);
//     }
// }
//
//
// /**
//  * Get cycle week, A,B,C
//  * @param x "YEAR_A", B or C from romcal
//  */
// export function getCycleYearWeek(x: string): string {
//     if (x == undefined) return ""
//     switch (x.toUpperCase()) {
//         case "YEAR_A": {
//             return "A"
//             break;
//         }
//         case "YEAR_B": {
//             return "B"
//             break;
//         }
//         case "YEAR_C": {
//             return "C"
//             break;
//         }
//         default: {
//             return ""
//             break;
//         }
//     }
// }
//
//
// async function getLiturgicalDay(date: Date): Promise<undefined | LiturgicalDay> {
//     const calendar: LiturgicalCalendar | undefined = await perpetualCalendar(date.getFullYear());
//
//     if (!calendar) {
//         return undefined;
//     }
//
//     const dateToday = new Date(date)
//         .toLocaleDateString("en-ZA")
//         .replaceAll("/", "-");
//
//     for (const day of calendar[dateToday]) {
//         if (!day.isOptional) {
//             return day;
//         }
//     }
//
//     return undefined;
// }
//
// export async function searchPropertyOfDay(date: Date, property: keyof LiturgicalDay = "name"): Promise<any> {
//     const liturgicalDay = await getLiturgicalDay(date);
//
//     if (liturgicalDay && property in liturgicalDay) {
//         return liturgicalDay[property] as string;
//     }
//
//     return "Day not found";
// }
//
// export async function getLiturgicalYear(date: Date): Promise<undefined | number> {
//     const liturgicalDay = await getLiturgicalDay(date);
//
//     if (liturgicalDay) {
//         const startOfLiturgicalYear = liturgicalDay.calendar.endOfLiturgicalYear;
//         const year = parseInt(startOfLiturgicalYear.split('-')[0]);
//
//         if (!isNaN(year)) {
//             return year;
//         }
//     }
//
//     return undefined;
// }
