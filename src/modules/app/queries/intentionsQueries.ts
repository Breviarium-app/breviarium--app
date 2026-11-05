// Intentions sync through the backend's existing /me/intentions endpoint: it already replaces the
// whole ordered list by text (no ids on the wire), exactly how intentionsStore.ts persists locally.
import {useMutation} from '@tanstack/vue-query';
import {sendWithSession} from '@/modules/account/services/backendClient.ts';

type IntentionOut = { id: string; text: string; position: number };

export function getIntentions(): Promise<string[]> {
    return sendWithSession<IntentionOut[]>('/me/intentions').then((items) => items.map((item) => item.text));
}

export function useReplaceIntentionsMutation() {
    return useMutation({
        mutationFn: (intentions: string[]) =>
            sendWithSession<IntentionOut[]>('/me/intentions', {method: 'PUT', body: {intentions}}),
    });
}
