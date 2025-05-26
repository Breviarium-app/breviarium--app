export type resultBible = {
    b: string;
    c: string;
    v: string;
    content: string;
};

export enum LectureTypes {
    GOSPEL = 'GOSPEL',
    FIRST_LECTURE = 'FIRSTLECTURE',
    SECOND_LECTURE = 'SECONDLECTURE',
    PSALM = 'PSALM',
    CELEBRATION_FIRST_LECTURE = 'CELEBRATION_FIRSTLECTURE',
    CELEBRATION_PSALM = 'CELEBRATION_PSALM',
    CELEBRATION_SECOND_LECTURE = 'CELEBRATION_SECONDLECTURE',
    CELEBRATION_GOSPEL = 'CELEBRATION_GOSPEL',
}

export enum LiturgicalColors {
    GREEN = "GREEN",
    GREEN_C = "#70b26f",
    PURPLE = "PURPLE",
    PURPLE_C = "#794498",
    WHITE = "WHITE",
    WHITE_C = "#bdbdbd66",
    ROSE = "ROSE",
    ROSE_C = "#ff81f5",
    BLUE = "BLUE",
    BLUE_C = "#00bafe",
    RED = "RED",
    RED_C = "#ff5654"
}

export enum LiturgicalSeasons {
    ADVENT = "ADVENT",
    PASCHAL_TRIDUUM = "PASCHAL_TRIDUUM",
    ORDINARY_TIME = "ORDINARY_TIME",
    EASTER = "EASTER_TIME",
    CHRISTMAS_TIME = "CHRISTMAS_TIME",
    LENT = "LENT"
}

export enum LiturgicalPeriods {
    CHRISTMAS_OCTAVE = "CHRISTMAS_OCTAVE",
    DAYS_BEFORE_EPIPHANY = "DAYS_BEFORE_EPIPHANY",
    DAYS_FROM_EPIPHANY = "DAYS_FROM_EPIPHANY",
    CHRISTMAS_TO_PRESENTATION_OF_THE_LORD = "CHRISTMAS_TO_PRESENTATION_OF_THE_LORD",
    PRESENTATION_OF_THE_LORD_TO_HOLY_THURSDAY = "PRESENTATION_OF_THE_LORD_TO_HOLY_THURSDAY",
    HOLY_WEEK = "HOLY_WEEK",
    EASTER_OCTAVE = "EASTER_OCTAVE",
    EARLY_ORDINARY_TIME = "EARLY_ORDINARY_TIME",
    LATE_ORDINARY_TIME = "LATE_ORDINARY_TIME"
}

export enum Ranks {
    Solemnity = "SOLEMNITY",
    Sunday = "SUNDAY",
    Feast = "FEAST",
    Memorial = "MEMORIAL",
    OptionalMemorial = "OPTIONAL_MEMORIAL",
    Weekday = "WEEKDAY"
}

export enum RANKS_SPANISH {
    Solemnity = "Solemnidad",
    Feast = "Fiesta",
    Memorial = "Memoria obligatoria",
    OptionalMemorial = "Memoria libre",
    Ferial = "feria",
    Empty = "",
    Sunday = "Domingo"
}