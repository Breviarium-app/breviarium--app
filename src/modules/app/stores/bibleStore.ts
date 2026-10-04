import {defineStore} from "pinia";
import {ref} from "vue";
import {resultBible} from "@/modules/app/constants/types.ts";
import {Bible} from "biblia-de-jerusalen";

export const bibleStore = defineStore('bible', () => {

    const all_bible = new Bible().bible;
    // var storage = localStorage.getItem("all_bible")

    // if (storage) {
    //     data = JSON.parse(storage)
    //     console.log("CACHED")
    // } else {
    //     data = all_bible
    //     // TODO: download and get from remote link
    //     localStorage.setItem("all_bible", JSON.stringify(all_bible))
    // }

    const dictionary: object = all_bible;
    const keys = Object.keys(all_bible)
    const getBook: any = (name: keyof typeof dictionary) => {
        return dictionary[name]
    };
    const getChapters: any = (name: keyof typeof dictionary) => {
        var book = getBook(name)
        if (!book) throw new Error("Book not found") // TODO: handle
        return book["chapters"]
    };
    const getVersiculums: any = ({name, number}: keyof typeof dictionary) => getChapters(name)[number - 1];

    const allVersiculums = (): resultBible[] => {
        let result: resultBible[] = []
        for (const key of keys) {
            // console.log(key)
            var book = getBook(key)
            const chapters = book['chapters']
            for (const chapter of chapters) {
                // console.log("chapter", chapter)
                var versiculumResult = chapter.verses
                if (versiculumResult) {
                    // console.log("VERSES", versiculumResult)
                    var versiculos = Object.keys(versiculumResult)
                    for (const versiculosKey in versiculos) {
                        if (versiculumResult[versiculosKey]) {
                            const verseItem = {
                                b: book.abreviacion,
                                c: chapter.chapter,
                                v: versiculosKey,
                                content: versiculumResult[versiculosKey]
                            }
                            // console.log(verseItem)
                            result.push(verseItem)
                        }
                    }
                }
            }
        }
        return result
    }

    const getBookByAbreviation = (abreviation: string): any => {
        let result: resultBible[] = []
        for (const key of keys) {
            // console.log(key)
            var book = getBook(key)
            if (book.abreviacion === abreviation) return key

        }
        return result
    }

    const books: BibleBookMeta[] = keys.map((name) => {
        const book = getBook(name)
        return {
            name,
            abbreviation: book.abreviacion,
            testament: book.testamento === 'Nuevo' ? 'new' : 'old',
            chapters: book.ctd_chapters,
            verses: book.ctd_verses,
            searchKey: normalizeSearch(`${name} ${romanToArabic(name)} ${book.abreviacion}`),
        }
    })

    const getBookMeta = (name: string): BibleBookMeta | undefined => books.find((book) => book.name === name)

    const searchBooks = (query: string): BibleBookMeta[] => {
        const normalized = normalizeSearch(query)
        if (!normalized) return books
        return books.filter((book) => book.searchKey.includes(normalized))
    }

    // Crosses book boundaries so reading can continue from Génesis 50 to Éxodo 1.
    const getAdjacentChapter = (name: string, chapter: number, step: 1 | -1): BiblePosition | undefined => {
        const index = books.findIndex((book) => book.name === name)
        if (index === -1) return undefined
        const target = chapter + step
        if (target >= 1 && target <= books[index].chapters) return {book: name, chapter: target}
        const neighbour = books[index + step]
        if (!neighbour) return undefined
        return {book: neighbour.name, chapter: step === 1 ? 1 : neighbour.chapters}
    }

    const lastRead = ref<BiblePosition | null>(readLastRead())

    const setLastRead = (position: BiblePosition) => {
        lastRead.value = position
        localStorage.setItem(LAST_READ_KEY, JSON.stringify(position))
    }

    return {
        all_bible,
        getListOfBooks: keys,
        getBook,
        getChapters,
        getVersiculums,
        allVersiculums,
        getBookByAbreviation,
        books,
        getBookMeta,
        searchBooks,
        getAdjacentChapter,
        lastRead,
        setLastRead,
    }
})

export type BibleBookMeta = {
    name: string;
    abbreviation: string;
    testament: 'old' | 'new';
    chapters: number;
    verses: number;
    searchKey: string;
}

export type BiblePosition = {
    book: string;
    chapter: number;
}

const LAST_READ_KEY = 'bible.lastRead'

function readLastRead(): BiblePosition | null {
    try {
        const raw = localStorage.getItem(LAST_READ_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

function normalizeSearch(text: string): string {
    return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

function romanToArabic(name: string): string {
    return name.replace(/^(III|II|I) /, (numeral) => `${numeral.trim().length} `)
}
