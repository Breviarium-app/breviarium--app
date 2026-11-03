import {beforeEach, describe, expect, test, vi} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useEscruteStore} from "../../src/modules/escrute/escruteStore";
import {childrenOf, layoutTree, pathTo, rootLecture} from "../../src/modules/escrute/escrute";
import {formatPassage, parsePassage} from "../../src/modules/escrute/reference";

const saved = vi.hoisted(() => new Map<string, string>())

vi.mock('@capacitor/preferences', () => ({
    Preferences: {
        get: async ({key}: { key: string }) => ({value: saved.get(key) ?? null}),
        set: async ({key, value}: { key: string, value: string }) => void saved.set(key, value),
    },
}))

/** Lets the saved escrutes arrive, as Preferences is async */
const loaded = () => new Promise(resolve => setTimeout(resolve))

const MT_1 = {book: 'Mateo', chapter: '1', from: 1, to: 5}
const IS_7 = {book: 'Isaías', chapter: '7', from: 14}
const LC_1 = {book: 'Lucas', chapter: '1', from: 26, to: 38}

describe('escrute store', () => {
    beforeEach(() => {
        saved.clear()
        setActivePinia(createPinia())
    })

    test('builds a tree of lectures from a starting lecture', () => {
        const store = useEscruteStore()
        const escrute = store.create('Genealogía', MT_1)
        const root = rootLecture(escrute)

        const isaiah = store.addLecture(escrute.id, root.id, IS_7, '23')!
        const luke = store.addLecture(escrute.id, isaiah.id, LC_1)!

        expect(childrenOf(escrute, root.id).map(l => l.id)).toEqual([isaiah.id])
        expect(pathTo(escrute, luke.id).map(l => l.passage.book)).toEqual(['Mateo', 'Isaías', 'Lucas'])
        expect(isaiah.fromVerse).toBe('23')
    })

    test('removing a lecture removes everything that branches from it, but never the start', () => {
        const store = useEscruteStore()
        const escrute = store.create('', MT_1)
        const root = rootLecture(escrute)
        const isaiah = store.addLecture(escrute.id, root.id, IS_7)!
        store.addLecture(escrute.id, isaiah.id, LC_1)
        store.addLecture(escrute.id, root.id, LC_1)

        store.removeLecture(escrute.id, isaiah.id)
        expect(store.find(escrute.id)!.lectures).toHaveLength(2)

        store.removeLecture(escrute.id, root.id)
        expect(store.find(escrute.id)!.lectures).toHaveLength(2)
    })

    test('lays out the tree with each lecture centred over the jumps made from it', () => {
        const store = useEscruteStore()
        const escrute = store.create('', MT_1)
        const root = rootLecture(escrute)
        const isaiah = store.addLecture(escrute.id, root.id, IS_7)!
        const luke = store.addLecture(escrute.id, isaiah.id, LC_1)!
        const john = store.addLecture(escrute.id, isaiah.id, LC_1)!
        const psalm = store.addLecture(escrute.id, root.id, IS_7)!

        const layout = layoutTree(escrute)
        const position = (id: string) => {
            const node = layout.nodes.find(n => n.lecture.id === id)!
            return [node.column, node.depth]
        }

        expect(layout.columns).toBe(3)
        expect(layout.rows).toBe(3)
        expect(position(luke.id)).toEqual([0, 2])
        expect(position(john.id)).toEqual([1, 2])
        expect(position(isaiah.id)).toEqual([0.5, 1])
        expect(position(psalm.id)).toEqual([2, 1])
        expect(position(root.id)).toEqual([1.25, 0])
        expect(layout.nodes[0].lecture.id).toBe(root.id)
        expect(layout.edges.map(e => [e.from.lecture.id, e.to.lecture.id])).toEqual(expect.arrayContaining([
            [root.id, isaiah.id], [isaiah.id, luke.id], [isaiah.id, john.id], [root.id, psalm.id],
        ]))
        expect(layout.edges).toHaveLength(4)
    })

    test('persists between sessions', async () => {
        const store = useEscruteStore()
        const escrute = store.create('Persistente', MT_1)
        store.updateNote(escrute.id, rootLecture(escrute).id, 'Una reflexión')
        await loaded()

        setActivePinia(createPinia())
        const store2 = useEscruteStore()
        await loaded()
        const reloaded = store2.find(escrute.id)!
        expect(reloaded.title).toBe('Persistente')
        expect(rootLecture(reloaded).note).toBe('Una reflexión')
    })
})

describe('ongoing escrute', () => {
    beforeEach(() => {
        saved.clear()
        setActivePinia(createPinia())
    })

    const labels = (store: ReturnType<typeof useEscruteStore>) => store.trail.lectures.map(l => l.passage.book)

    test('jumps followed from the Bible hang from the lecture being read', () => {
        const store = useEscruteStore()
        const escrute = store.start('Genealogía', MT_1)
        const isaiah = store.follow(IS_7, '23')!

        expect(store.ongoingEscrute?.id).toBe(escrute.id)
        expect(isaiah.parentId).toBe(rootLecture(escrute).id)
        expect(isaiah.fromVerse).toBe('23')
        expect(labels(store)).toEqual(['Mateo', 'Isaías'])
        expect(store.trail.index).toBe(1)
    })

    test('stepping back keeps the steps ahead until a new branch is followed', () => {
        const store = useEscruteStore()
        const escrute = store.start('Genealogía', MT_1)
        store.follow(IS_7, '23')
        store.follow(LC_1, '14')

        store.goTo(rootLecture(escrute).id)
        expect(labels(store)).toEqual(['Mateo', 'Isaías', 'Lucas'])
        expect(store.trail.index).toBe(0)

        const john = store.follow({book: 'Juan', chapter: '1'}, '1')!
        expect(john.parentId).toBe(rootLecture(escrute).id)
        expect(labels(store)).toEqual(['Mateo', 'Juan'])
        expect(escrute.lectures).toHaveLength(4)
    })

    test('finishing keeps the escrute and survives a reload until then', async () => {
        const store = useEscruteStore()
        const escrute = store.start('Genealogía', MT_1)
        store.follow(IS_7, '23')
        await loaded()

        setActivePinia(createPinia())
        const reloaded = useEscruteStore()
        await loaded()
        expect(reloaded.ongoingEscrute?.id).toBe(escrute.id)
        expect(reloaded.trail.index).toBe(1)

        reloaded.finish()
        expect(reloaded.ongoingEscrute).toBeUndefined()
        expect(reloaded.find(escrute.id)?.lectures).toHaveLength(2)
    })

    test('a deleted escrute is no longer ongoing', () => {
        const store = useEscruteStore()
        const escrute = store.start('Genealogía', MT_1)
        store.remove(escrute.id)
        expect(store.ongoingEscrute).toBeUndefined()
        expect(store.follow(IS_7)).toBeUndefined()
    })
})

describe('resuming an escrute', () => {
    beforeEach(() => {
        saved.clear()
        setActivePinia(createPinia())
    })

    const labels = (store: ReturnType<typeof useEscruteStore>) => store.trail.lectures.map(l => l.passage.book)

    test('reads on from a lecture, keeping the steps ahead of it in the trail', () => {
        const store = useEscruteStore()
        const escrute = store.start('Genealogía', MT_1)
        store.follow(IS_7, '23')
        store.follow(LC_1, '14')
        store.finish()

        store.resume(escrute.id, rootLecture(escrute).id)

        expect(store.ongoingEscrute?.id).toBe(escrute.id)
        expect(labels(store)).toEqual(['Mateo', 'Isaías', 'Lucas'])
        expect(store.trail.index).toBe(0)
    })

    test('a jump from the resumed lecture opens a new branch', () => {
        const store = useEscruteStore()
        const escrute = store.start('Genealogía', MT_1)
        store.follow(IS_7, '23')
        store.finish()

        store.resume(escrute.id, rootLecture(escrute).id)
        const john = store.follow({book: 'Juan', chapter: '1'}, '1')!

        expect(john.parentId).toBe(rootLecture(escrute).id)
        expect(labels(store)).toEqual(['Mateo', 'Juan'])
    })

    test('resuming takes over from another ongoing escrute, which keeps its lectures', () => {
        const store = useEscruteStore()
        const other = store.start('Otro', IS_7)
        store.follow(LC_1, '1')
        const escrute = store.create('Este', MT_1)

        store.resume(escrute.id, rootLecture(escrute).id)

        expect(store.ongoingEscrute?.id).toBe(escrute.id)
        expect(store.find(other.id)?.lectures).toHaveLength(2)
    })

    test('ignores a lecture that no longer exists', () => {
        const store = useEscruteStore()
        const escrute = store.create('Este', MT_1)
        store.resume(escrute.id, 'nada')
        expect(store.ongoingEscrute).toBeUndefined()
    })
})

describe('references', () => {
    beforeEach(() => setActivePinia(createPinia()))

    test('a tapped verse can be widened before starting', () => {
        expect(parsePassage('Jn 3,16')).toEqual({book: 'Juan', chapter: '3', from: 16})
        expect(parsePassage('Jn 3,16-21')).toEqual({book: 'Juan', chapter: '3', from: 16, to: 21})
        expect(parsePassage('1 Jn 4,9')?.book).toBe('I Juan')
        expect(parsePassage('nada')).toBeUndefined()
        expect(formatPassage({book: 'Juan', chapter: '3', from: 16, to: 21})).toBe('Jn 3,16-21')
    })
})
