export class IntentionsStorageManager {
    private storageKey: string;

    constructor(storageKey: string) {
        this.storageKey = storageKey;
    }

    // Load intentions from localStorage
    loadIntentions(): string[] {
        const storedIntentions = localStorage.getItem(this.storageKey);
        return storedIntentions ? JSON.parse(storedIntentions) : [];
    }

    // Save intentions to localStorage
    saveIntentions(intentions: string[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(intentions));
    }

    // Add a new intention and update localStorage
    addIntention(intentions: string[], newIntention: string): string[] {
        if (newIntention.trim()) {
            intentions.push(newIntention.trim());
            this.saveIntentions(intentions);
        }
        return intentions;
    }

    // Delete an intention and update localStorage
    deleteIntention(intentions: string[], index: number): string[] {
        intentions.splice(index, 1);
        this.saveIntentions(intentions);
        return intentions;
    }

    // Update an intention at a specific index and update localStorage
    updateIntention(intentions: string[], index: number, updatedIntention: string): string[] {
        if (updatedIntention.trim() && index >= 0 && index < intentions.length) {
            intentions[index] = updatedIntention.trim();
            this.saveIntentions(intentions);
        }
        return intentions;
    }
}