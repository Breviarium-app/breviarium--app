import {describe, expect, it} from 'vitest';
import {cleanForSpeech, splitIntoPieces} from './speechText.ts';

const splitIntoChunks = (text: string, maxLength?: number) => splitIntoPieces(text, maxLength).map((piece) => piece.text);

describe('cleanForSpeech', () => {
    it('removes versicle, response and antiphon marks', () => {
        expect(cleanForSpeech('℣. Dios mío, ven en mi auxilio. ℟. Señor, date prisa')).toBe('Dios mío, ven en mi auxilio. Señor, date prisa');
        expect(cleanForSpeech('Ant. 1. Por la mañana te expongo mi causa')).toBe('Por la mañana te expongo mi causa');
        expect(cleanForSpeech('V/. El Señor esté con vosotros. R/. Y con tu espíritu.')).toBe('El Señor esté con vosotros. Y con tu espíritu.');
    });

    it('removes the "Se repite la antífona" instruction', () => {
        expect(cleanForSpeech('Se repite la antífona')).toBe('');
        expect(cleanForSpeech('el rebaño que él guía. Se repite la antífona.')).toBe('el rebaño que él guía.');
    });

    it('removes psalm mediant and flexa marks', () => {
        expect(cleanForSpeech('Oh Dios, tú eres mi Dios, † por ti madrugo, * mi alma está sedienta')).toBe('Oh Dios, tú eres mi Dios, por ti madrugo, mi alma está sedienta');
    });
});

describe('splitIntoPieces', () => {
    it('keeps short text in one chunk and drops pieces without words', () => {
        expect(splitIntoChunks('℟.\nGloria al Padre.')).toEqual(['Gloria al Padre.']);
    });

    it('joins lines up to the max length', () => {
        const chunks = splitIntoChunks('Primera línea.\nSegunda línea.\nTercera línea.', 30);
        expect(chunks).toEqual(['Primera línea. Segunda línea.', 'Tercera línea.']);
    });

    it('splits a sentence longer than the max length', () => {
        const chunks = splitIntoChunks('uno, dos, tres, cuatro, cinco, seis, siete', 15);
        expect(chunks.every((chunk) => chunk.length <= 15)).toBe(true);
        expect(chunks.join(' ')).toBe('uno, dos, tres, cuatro, cinco, seis, siete');
    });

    it('keeps the offsets of each piece in the raw text, without the response marks', () => {
        const raw = '℣. Dios mío, ven en mi auxilio.\n℟. Señor, date prisa en socorrerme.';
        const pieces = splitIntoPieces(raw, 30);
        expect(pieces.map((piece) => raw.slice(piece.start, piece.end).trim())).toEqual([
            'Dios mío, ven en mi auxilio.',
            'Señor, date prisa en',
            'socorrerme.',
        ]);
    });
});
