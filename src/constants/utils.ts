import {DAYS_SPANISH, MONTH_SPANISH} from "@/constants/index.ts";
import {LiturgicalColors, LiturgicalPeriods, LiturgicalSeasons, Ranks, RANKS_SPANISH} from "@/constants/types.ts";
import {useBreviariumStore} from "@/stores/breviarium.ts";

export const currentLiturgyHour = () => {
    const hour = new Date().getHours();
    if (hour < 3) {
        return "Completorium";
    } else if (hour < 10) { // previously to 9
        return "Laudes";
    } else if (hour < 12) {
        return "Tercia";
    } else if (hour < 15) {
        return "Sexta";
    } else if (hour < 18) {
        return "Nona";
    } else if (hour < 22) {
        return "Vesperae";
    } else if (hour < 24) {
        return "Completorium"
    }
    return "Laudes" // by default if error
}

export function selectAll(event: any) {
    event.target.select()
}


export const buildLocalDate = (date: Date): string => {
    return (
        DAYS_SPANISH[date.getDay()] +
        " " +
        date.getDate() +
        " de " +
        MONTH_SPANISH[date.getMonth()]
    );
};

export function getHexLiturgicalColor(color: string) {
    switch (color) {
        case LiturgicalColors.GREEN:
            return LiturgicalColors.GREEN_C;
        case LiturgicalColors.PURPLE:
            return LiturgicalColors.PURPLE_C
        case LiturgicalColors.WHITE:
            return LiturgicalColors.WHITE_C;
        case LiturgicalColors.ROSE:
            return LiturgicalColors.ROSE_C;
        case LiturgicalColors.BLUE:
            return LiturgicalColors.BLUE_C;
        case LiturgicalColors.RED:
            return LiturgicalColors.RED_C;
        default:
            return LiturgicalColors.WHITE_C;
    }
}

export async function isEaster(): Promise<boolean> {
    let result: boolean = false;
    await useBreviariumStore().getLiturgyInformation().then((data) => {
        if (data.seasons) result = data.seasons?.includes(LiturgicalSeasons.EASTER);
        console.log("data", data)
    })
    console.log("easter?", result)
    return result;
}

export async function isTriduum(): Promise<boolean> {
    let result: boolean = false;
    await useBreviariumStore().getLiturgyInformation().then((data) => {
        if (data.seasons) result = data.seasons?.includes(LiturgicalSeasons.PASCHAL_TRIDUUM);
    })
    return result;
    // return await searchPropertyOfDay(date, PropertyCerpetualCalendar.Seasons)).includes('LENT');
}

export async function isInAlbis(): Promise<boolean> {
    let result: boolean = false;
    await useBreviariumStore().getLiturgyInformation().then((data) => {
        if (data.periods) result = data.periods?.includes(LiturgicalPeriods.EASTER_OCTAVE);
    })
    console.log(result)
    return result;
}

export async function isTodayLent(): Promise<boolean> {
    let result: boolean = false;
    await useBreviariumStore().getLiturgyInformation().then((data) => {
        if (data.seasons) result = data.seasons?.includes(LiturgicalSeasons.LENT);
    })
    return result;
}

export async function isOrdinaryTime(): Promise<boolean> {
    let result: boolean = false;
    await useBreviariumStore().getLiturgyInformation().then((data) => {
        if (data.seasons) result = data.seasons?.includes(LiturgicalSeasons.ORDINARY_TIME);
    })
    return result;
}

export function showTeDeum(rank: string, season: string) {
    if (season === LiturgicalSeasons.CHRISTMAS_TIME) {
        return true;
    }
    if (rank === Ranks.Solemnity) {
        return true;
    }
    if (rank === Ranks.Sunday && season != LiturgicalSeasons.LENT) {
        return true;
    }
    if (rank === Ranks.Feast) {
        return true;
    }
    return false;
}

export async function rankTranslate(rankCode: string) {
    let rank = RANKS_SPANISH.Ferial;

    // const precedenceCode = await searchPropertyOfDay(useDateStore().getCurrentDate, PropertyCerpetualCalendar.Precedence);
    switch (rankCode) {
        case Ranks.Solemnity: {
            rank = RANKS_SPANISH.Solemnity;
            break;
        }
        case Ranks.Feast: {
            rank = RANKS_SPANISH.Feast;
            break;
        }
        case Ranks.Sunday: {
            // TODO: if (precedenceCode === "PRIVILEGED_SUNDAY_2") rank = RANKS_SPANISH.Empty;
            rank = RANKS_SPANISH.Sunday
            break;
        }
        case Ranks.Weekday: {
            rank = RANKS_SPANISH.Ferial;
            // TODO: if ((precedenceCode === "TRIDUUM_1") || (precedenceCode === "PRIVILEGED_WEEKDAY_9")) rank = RANKS_SPANISH.Empty;
            break;
        }
        case Ranks.Memorial: {
            rank = RANKS_SPANISH.Memorial;
            break;
        }
        case Ranks.OptionalMemorial: {
            rank = RANKS_SPANISH.OptionalMemorial;
            break;
        }
    }
    return rank;
}