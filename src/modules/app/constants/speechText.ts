// Turns the rendered prayer into short pieces of text for text-to-speech.

export interface SpeechChunk {
    // Block element the text belongs to, highlighted while it is read
    element: HTMLElement;
    text: string;
}

// Long utterances get cut off by some engines (and Chrome stops after ~15s), and pausing
// restarts the current piece, so the text is read in short pieces.
const MAX_CHUNK_LENGTH = 220;

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

/**
 * Splits the text on sentence ends, colons, semicolons and line breaks,
 * then joins the pieces back up to `maxLength` characters.
 */
export const splitIntoChunks = (text: string, maxLength = MAX_CHUNK_LENGTH): string[] => {
    const pieces = text
        .split(/\n+|(?<=[.!?;:¿¡»])\s+/)
        .map(cleanForSpeech)
        .filter((piece) => /[\p{L}\p{N}]/u.test(piece));

    const chunks: string[] = [];
    let current = '';
    for (const piece of pieces) {
        if (current && current.length + piece.length + 1 > maxLength) {
            chunks.push(current);
            current = piece;
        } else {
            current = current ? `${current} ${piece}` : piece;
        }
    }
    if (current) chunks.push(current);

    // A single sentence longer than the limit is split on commas, or on words as a last resort
    return chunks.flatMap((chunk) => chunk.length <= maxLength ? [chunk] : splitLong(chunk, maxLength));
};

const splitLong = (text: string, maxLength: number): string[] => {
    const chunks: string[] = [];
    let current = '';
    for (const word of text.split(/(?<=,)\s+|\s+/)) {
        if (current && current.length + word.length + 1 > maxLength) {
            chunks.push(current);
            current = word;
        } else {
            current = current ? `${current} ${word}` : word;
        }
    }
    if (current) chunks.push(current);
    return chunks;
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
            return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        },
    });

    const chunks: SpeechChunk[] = [];
    let currentBlock: HTMLElement | null = null;
    let currentText = '';
    const flush = () => {
        if (currentBlock && currentText.trim()) {
            for (const text of splitIntoChunks(currentText)) {
                chunks.push({element: currentBlock, text});
            }
        }
        currentText = '';
    };

    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (node instanceof Element) {
            if (node.tagName === 'BR') currentText += '\n';
            continue;
        }
        const block = nearestBlock(node.parentElement ?? root);
        if (block !== currentBlock) {
            flush();
            currentBlock = block;
        }
        currentText += node.textContent;
    }
    flush();

    return chunks;
};
