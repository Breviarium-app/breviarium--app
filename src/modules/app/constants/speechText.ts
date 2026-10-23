// Turns the rendered prayer into short pieces of text for text-to-speech.

export interface SpeechChunk {
    // Block element the text belongs to
    element: HTMLElement;
    // Exact text being read, for highlighting it
    range: Range;
    text: string;
}

// A piece of a block's raw text: offsets into the raw text, and the cleaned text to speak
export interface TextPiece {
    start: number;
    end: number;
    text: string;
}

// Long utterances get cut off by some engines (and Chrome stops after ~15s), and pausing
// restarts the current piece, so the text is read in short pieces of a sentence or a few lines.
const MAX_CHUNK_LENGTH = 160;

// Controls and widgets inside the prayer that are not part of the text
const SKIP_SELECTOR = 'button, ion-button, ion-segment, ion-fab, ion-icon, ion-modal, input, textarea, select, svg, script, style, [data-tts-skip]';

/**
 * Removes the rubric marks that make sense on paper but not out loud:
 * versicle/response signs, antiphon labels and the psalm's mediant/flexa marks.
 */
export const cleanForSpeech = (text: string): string => text
    .replace(/[℣℟]\.?/g, ' ')
    .replace(/\b[VR]\/\.?/g, ' ')
    .replace(/\bAnt\.(\s*\d+\.)?/g, ' ')
    .replace(/[*†+_$]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const hasWords = (text: string): boolean => /[\p{L}\p{N}]/u.test(text);

/**
 * Splits the text on sentence ends, colons, semicolons and line breaks,
 * then joins the pieces back up to `maxLength` characters.
 */
export const splitIntoPieces = (raw: string, maxLength = MAX_CHUNK_LENGTH): TextPiece[] => {
    const pieces: TextPiece[] = [];
    let start = 0;
    const push = (end: number) => {
        const text = cleanForSpeech(raw.slice(start, end));
        if (hasWords(text)) pieces.push({start, end, text});
    };
    for (const match of raw.matchAll(/\n+|(?<=[.!?;:¿¡»])\s+/g)) {
        push(match.index);
        start = match.index + match[0].length;
    }
    push(raw.length);

    const merged: TextPiece[] = [];
    for (const piece of pieces) {
        const last = merged.at(-1);
        if (last && last.text.length + piece.text.length + 1 <= maxLength) {
            merged[merged.length - 1] = {start: last.start, end: piece.end, text: `${last.text} ${piece.text}`};
        } else {
            merged.push(piece);
        }
    }

    // A single sentence longer than the limit is split on words
    return merged.flatMap((piece) => piece.text.length <= maxLength ? [piece] : splitLong(raw, piece, maxLength));
};

const splitLong = (raw: string, piece: TextPiece, maxLength: number): TextPiece[] => {
    const pieces: TextPiece[] = [];
    let start = piece.start;
    let end = piece.start;
    for (const word of raw.slice(piece.start, piece.end).matchAll(/\S+/g)) {
        const wordEnd = piece.start + word.index + word[0].length;
        if (end > start && cleanForSpeech(raw.slice(start, wordEnd)).length > maxLength) {
            pieces.push({start, end, text: cleanForSpeech(raw.slice(start, end))});
            start = piece.start + word.index;
        }
        end = wordEnd;
    }
    if (end > start) pieces.push({start, end, text: cleanForSpeech(raw.slice(start, end))});
    return pieces.filter((p) => hasWords(p.text));
};

const isBlock = (element: Element): boolean => {
    const display = getComputedStyle(element).display;
    return display !== 'inline' && display !== 'contents';
};

const isVisible = (element: Element): boolean => element.getClientRects().length > 0;

/**
 * Collects the visible text under `root`, grouped by the block element (paragraph, heading…)
 * that contains it, in reading order.
 */
export const collectSpeechChunks = (root: HTMLElement): SpeechChunk[] => {
    const blockCache = new Map<Element, HTMLElement>();
    const nearestBlock = (element: Element): HTMLElement => {
        const cached = blockCache.get(element);
        if (cached) return cached;
        let block: Element = element;
        while (block !== root && block.parentElement && !isBlock(block)) {
            block = block.parentElement;
        }
        blockCache.set(element, block as HTMLElement);
        return block as HTMLElement;
    };

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
            if (node instanceof Element) {
                // Line breaks have no box in some browsers, check them before visibility
                if (node.tagName === 'BR') return NodeFilter.FILTER_ACCEPT;
                return node.matches(SKIP_SELECTOR) || !isVisible(node)
                    ? NodeFilter.FILTER_REJECT
                    : NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_ACCEPT;
        },
    });

    const chunks: SpeechChunk[] = [];
    let currentBlock: HTMLElement | null = null;
    // Raw text of the current block, and the text nodes it comes from (offsets into it)
    let raw = '';
    let segments: { node: Text; start: number }[] = [];

    const toRange = (start: number, end: number): Range => {
        // Leave the surrounding spaces and line breaks out of the highlight
        while (start < end && /\s/.test(raw[start])) start++;
        while (end > start && /\s/.test(raw[end - 1])) end--;
        const at = (offset: number, isEnd: boolean) => {
            const segment = segments.findLast((s) => isEnd ? s.start < offset : s.start <= offset) ?? segments[0];
            return {node: segment.node, offset: Math.min(offset - segment.start, segment.node.length)};
        };
        const range = document.createRange();
        const from = at(start, false);
        const to = at(end, true);
        range.setStart(from.node, from.offset);
        range.setEnd(to.node, to.offset);
        return range;
    };

    const flush = () => {
        if (currentBlock && hasWords(raw)) {
            for (const piece of splitIntoPieces(raw)) {
                chunks.push({element: currentBlock, range: toRange(piece.start, piece.end), text: piece.text});
            }
        }
        raw = '';
        segments = [];
    };

    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (node instanceof Element) {
            if (node.tagName === 'BR') raw += '\n';
            continue;
        }
        const block = nearestBlock(node.parentElement ?? root);
        if (block !== currentBlock) {
            flush();
            currentBlock = block;
        }
        segments.push({node: node as Text, start: raw.length});
        raw += node.textContent;
    }
    flush();

    return chunks;
};
