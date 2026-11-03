import {bibleStore} from "@/modules/app/stores/bibleStore.ts";

/** A Bible passage: a whole chapter, a single verse or a range of verses */
export interface Passage {
    /** Book name as used by the Bible data, e.g. "Mateo" */
    book: string;
    chapter: string;
    from?: number;
    to?: number;
}

// Alternative abbreviations (e.g. the ones used by León-Dufour) that differ from the Biblia
const ABBREVIATION_ALIASES: Record<string, string> = {
    'Gen': 'Gn',
    'Lev': 'Lv',
    'Num': 'Nm',
    '1Sa': '1 Sam',
    '2Sa': '2 Sam',
    '1Re': '1 Re',
    '2Re': '2 Re',
    '1Cr': '1 Cr',
    '2Cr': '2 Cr',
    'Neh': 'Ne',
    'Tob': 'Tb',
    '1Mac': '1 Mac',
    '2Mac': '2 Mac',
    'Sal': 'Sl',
    'Prov': 'Pr',
    'Ecl': 'Qo',
    'Cant': 'Ct',
    'Sab': 'Sb',
    'Eclo': 'Sir',
    'Jer': 'Jr',
    'Bar': 'Ba',
    'Miq': 'Mi',
    'Hab': 'Ha',
    'Zac': 'Za',
    'Mal': 'Ml',
    'Act': 'He',
    'Rom': 'Rm',
    '1Cor': '1 Cor',
    '2Cor': '2 Cor',
    'Gal': 'Ga',
    '1Tes': '1 Te',
    '2Tes': '2 Te',
    '1Tim': '1 Tim',
    '2Tim': '2 Tim',
    '1Pe': '1 Pe',
    '2Pe': '2 Pe',
    '1Jn': '1 Jn',
    '2Jn': '2 Jn',
    '3Jn': '3 Jn',
};

const getBook = (name: string) => bibleStore().getBook(name);

const getChapter = (book: string, chapter: string) =>
    getBook(book)?.chapters.find((c: { chapter: unknown }) => String(c.chapter) === chapter);

/** "I Corintios" → "1corintios", "1 Cor." → "1cor" */
const bookKey = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase()
    .replace(/^(iii|ii|i)\s+/, numeral => `${numeral.trim().length} `)
    .replace(/[\s.]/g, '');

// The Bible is loaded with the store, so the index is built on first use
let booksByKey: Map<string, string> | undefined;

function bookIndex() {
    if (booksByKey) return booksByKey;
    booksByKey = new Map();
    for (const book of bibleStore().books) {
        booksByKey.set(bookKey(book.name), book.name);
        booksByKey.set(bookKey(book.abbreviation), book.name);
    }
    for (const [alias, abbreviation] of Object.entries(ABBREVIATION_ALIASES)) {
        const book = booksByKey.get(bookKey(abbreviation));
        if (book) booksByKey.set(bookKey(alias), book);
    }
    return booksByKey;
}

/** Finds a book by name or abbreviation ("Mt", "Mateo", "1 Cor", "Gen"), or by an unambiguous name prefix ("Deut") */
export function resolveBook(input: string): string | undefined {
    const key = bookKey(input);
    if (!key) return undefined;
    const exact = bookIndex().get(key);
    if (exact) return exact;
    const candidates = bibleStore().books.filter(book => bookKey(book.name).startsWith(key));
    return candidates.length === 1 ? candidates[0].name : undefined;
}

/** Parses references like "Mt 1,1-5", "Mateo 1, 1-5", "1 Cor 13", "Jn 3:16" */
export function parsePassage(text: string): Passage | undefined {
    const match = text.trim().match(/^(.+?)\s*(\d+)\s*(?:[,:]\s*(\d+)\s*(?:-\s*(\d+))?)?$/);
    if (!match) return undefined;

    const [, bookText, chapter, fromText, toText] = match;
    const book = resolveBook(bookText);
    const verses = book && getChapter(book, chapter)?.verses;
    if (!book || !verses) return undefined;

    const passage: Passage = {book, chapter};
    if (fromText) {
        const from = Number(fromText);
        const to = toText ? Number(toText) : from;
        if (!verses[from] || to < from) return undefined;
        passage.from = from;
        if (to !== from) passage.to = to;
    }
    return passage;
}

/** "Mt 1,1-5" */
export function formatPassage({book, chapter, from, to}: Passage, style: 'short' | 'long' = 'short'): string {
    const name = style === 'short' ? getBook(book)?.abreviacion ?? book : book;
    const separator = style === 'short' ? ',' : ', ';
    const verses = from ? `${separator}${from}${to ? `-${to}` : ''}` : '';
    return `${name} ${chapter}${verses}`;
}

export function getPassageVerses({book, chapter, from, to}: Passage): Record<string, string> {
    const verses: Record<string, string> = getChapter(book, chapter)?.verses ?? {};
    if (!from) return verses;
    const last = to ?? from;
    return Object.fromEntries(
        Object.entries(verses).filter(([number]) => Number(number) >= from && Number(number) <= last)
    );
}

/** Where the passage is read in the Bible */
export const biblePath = ({book, chapter, from}: Passage): string =>
    `/bible/${book}/${chapter}${from ? `#v${from}` : ''}`;

/** The verse of a chapter, e.g. the one a lecture jumped from */
export const getVerseText = (book: string, chapter: string, verse: string): string | undefined =>
    getChapter(book, chapter)?.verses[verse];
