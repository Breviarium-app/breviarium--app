export interface Intention {
    id: string;
    text: string;
    order: number;
}

export class IntentionsStorageManager {
    private storageKey: string;

    constructor(storageKey: string) {
        this.storageKey = storageKey;
    }

    // Load intentions from localStorage, migrating older plain-string lists to the current shape
    loadIntentions(): Intention[] {
        const storedIntentions = localStorage.getItem(this.storageKey);
        if (!storedIntentions) return [];

        const parsed = JSON.parse(storedIntentions);
        if (parsed.length > 0 && typeof parsed[0] === 'string') {
            const migrated = (parsed as string[]).map((text, order) => ({
                id: crypto.randomUUID(),
                text,
                order,
            }));
            this.saveIntentions(migrated);
            return migrated;
        }

        return (parsed as Intention[]).sort((a, b) => a.order - b.order);
    }

    // Save intentions to localStorage
    saveIntentions(intentions: Intention[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(intentions));
    }

    // Add a new intention and update localStorage
    addIntention(intentions: Intention[], newIntention: string): Intention[] {
        const text = newIntention.trim();
        if (text) {
            const nextOrder = intentions.reduce((max, intention) => Math.max(max, intention.order), -1) + 1;
            intentions.push({id: crypto.randomUUID(), text, order: nextOrder});
            this.saveIntentions(intentions);
        }
        return intentions;
    }

    // Delete an intention and update localStorage
    deleteIntention(intentions: Intention[], index: number): Intention[] {
        intentions.splice(index, 1);
        this.saveIntentions(intentions);
        return intentions;
    }

    // Update an intention at a specific index and update localStorage
    updateIntention(intentions: Intention[], index: number, updatedIntention: string): Intention[] {
        const text = updatedIntention.trim();
        if (text && index >= 0 && index < intentions.length) {
            intentions[index].text = text;
            this.saveIntentions(intentions);
        }
        return intentions;
    }

    // Persist a new order after a drag-and-drop reorder and update localStorage
    reorderIntentions(intentions: Intention[]): Intention[] {
        intentions.forEach((intention, index) => {
            intention.order = index;
        });
        this.saveIntentions(intentions);
        return intentions;
    }
}
