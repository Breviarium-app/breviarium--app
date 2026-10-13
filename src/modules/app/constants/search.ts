// Lowercases and strips diacritics so "jose" matches "José"
export function normalizeSearch(text: string): string {
    return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}
