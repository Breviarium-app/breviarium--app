import {defineStore} from "pinia";
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

    return {all_bible, getListOfBooks: keys, getBook, getChapters, getVersiculums, allVersiculums, getBookByAbreviation}
})
