export type resultBible = {
    b: string;
    c: string;
    v: string;
    content: string;
};

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