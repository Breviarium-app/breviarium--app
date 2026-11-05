// Diary entries sync through /me/diary. Entries keep their client-generated id (see diaryStore.ts)
// on the backend too, so add/update/delete always target the same row whether or not it has
// reached the server yet - no reconciliation step after creating one while offline.
import {useMutation} from '@tanstack/vue-query';
import {sendWithSession} from '@/modules/account/services/backendClient.ts';

type DiaryReference = { label: string; path: string; quote?: string };

type DiaryEntryOut = {
    id: string;
    text: string;
    reference: DiaryReference | null;
    created_at: string;
    updated_at: string;
};

type DiaryEntryIn = { id: string; text: string; reference?: DiaryReference };

export function getDiaryEntries(): Promise<DiaryEntryOut[]> {
    return sendWithSession<DiaryEntryOut[]>('/me/diary');
}

export function useReplaceDiaryMutation() {
    return useMutation({
        mutationFn: (entries: DiaryEntryIn[]) =>
            sendWithSession<DiaryEntryOut[]>('/me/diary', {method: 'PUT', body: {entries}}),
    });
}

export function useAddDiaryEntryMutation() {
    return useMutation({
        mutationFn: (entry: DiaryEntryIn) => sendWithSession<DiaryEntryOut>('/me/diary', {method: 'POST', body: entry}),
    });
}

export function useUpdateDiaryEntryMutation() {
    return useMutation({
        mutationFn: ({id, text}: { id: string; text: string }) =>
            sendWithSession<DiaryEntryOut>(`/me/diary/${id}`, {method: 'PATCH', body: {text}}),
    });
}

export function useDeleteDiaryEntryMutation() {
    return useMutation({
        mutationFn: (id: string) => sendWithSession<void>(`/me/diary/${id}`, {method: 'DELETE'}),
    });
}
