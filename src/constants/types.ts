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
    EASTER = "EASTER_TIME",
    CHRISTMAS = "CHRISTMAS_TIME",
    LENT = "LENT"
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