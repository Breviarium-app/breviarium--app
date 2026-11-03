import type {Passage} from "./reference";

/** One reading inside an escrute. Lectures form a tree: each jump creates a child of the lecture it came from. */
export interface Lecture {
    id: string;
    /** null for the starting lecture */
    parentId: string | null;
    passage: Passage;
    /** Verse of the parent lecture that led to this one */
    fromVerse?: string;
    note: string;
    createdAt: string;
}

/** A meditation that starts at one lecture and branches into others */
export interface Escrute {
    id: string;
    title: string;
    lectures: Lecture[];
    createdAt: string;
    updatedAt: string;
}

export const rootLecture = (escrute: Escrute): Lecture =>
    escrute.lectures.find(lecture => lecture.parentId === null) ?? escrute.lectures[0];

export const findLecture = (escrute: Escrute, id: string): Lecture | undefined =>
    escrute.lectures.find(lecture => lecture.id === id);

export const childrenOf = (escrute: Escrute, id: string): Lecture[] =>
    escrute.lectures.filter(lecture => lecture.parentId === id);

/** Lectures from the root down to (and including) the given one */
export function pathTo(escrute: Escrute, id: string): Lecture[] {
    const path: Lecture[] = [];
    for (let lecture = findLecture(escrute, id); lecture; lecture = lecture.parentId ? findLecture(escrute, lecture.parentId) : undefined) {
        path.unshift(lecture);
    }
    return path;
}

/** Follows the most recent jumps from a lecture down to where that branch ends */
export function branchTip(escrute: Escrute, id: string): string {
    const next = childrenOf(escrute, id).at(-1);
    return next ? branchTip(escrute, next.id) : id;
}

/** The lecture and everything that branches from it */
export function subtreeIds(escrute: Escrute, id: string): Set<string> {
    const ids = new Set([id]);
    for (const lecture of escrute.lectures) {
        // Children are always created after their parent, so one ordered pass is enough
        if (lecture.parentId && ids.has(lecture.parentId)) ids.add(lecture.id);
    }
    return ids;
}

/** A lecture placed on the grid of the tree drawing */
export interface TreeNode {
    lecture: Lecture;
    /** Horizontal slot; half values centre a parent over its children */
    column: number;
    /** Number of jumps from the starting lecture */
    depth: number;
}

export interface TreeLayout {
    /** In reading order: each lecture comes before the jumps made from it */
    nodes: TreeNode[];
    /** Connects every lecture with the one it jumped from */
    edges: { from: TreeNode, to: TreeNode }[];
    columns: number;
    rows: number;
}

/** Places every lecture on a grid: one row per jump, leaves take consecutive columns and each parent sits centred over its children */
export function layoutTree(escrute: Escrute): TreeLayout {
    const layout: TreeLayout = {nodes: [], edges: [], columns: 0, rows: 0};
    const place = (lecture: Lecture, depth: number): TreeNode => {
        const node: TreeNode = {lecture, column: 0, depth};
        layout.nodes.push(node);
        layout.rows = Math.max(layout.rows, depth + 1);
        const children = childrenOf(escrute, lecture.id).map(child => place(child, depth + 1));
        node.column = children.length
            ? (children[0].column + children[children.length - 1].column) / 2
            : layout.columns++;
        layout.edges.push(...children.map(to => ({from: node, to})));
        return node;
    };
    if (escrute.lectures.length) place(rootLecture(escrute), 0);
    return layout;
}

/** "4 de octubre de 2026" */
export const formatDate = (iso: string, locale: string): string =>
    new Date(iso).toLocaleDateString(locale, {day: 'numeric', month: 'long', year: 'numeric'});
