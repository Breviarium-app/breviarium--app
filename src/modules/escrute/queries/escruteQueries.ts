// Escrutes sync through /me/escrutes. Lectures keep the client-generated ids from escrute.ts's
// newId() on the backend too (it stores the whole Lecture[] tree opaquely, same spirit as how
// UserPreferences.data is never looked into) - no reconciliation step after creating one offline.
import {useMutation} from '@tanstack/vue-query';
import {sendWithSession} from '@/modules/account/services/backendClient.ts';
import type {Lecture} from '../escrute';

type EscruteOut = {
    id: string;
    title: string;
    lectures: Lecture[];
    created_at: string;
    updated_at: string;
};

type EscruteIn = { id: string; title: string; lectures: Lecture[] };

export function getEscrutes(): Promise<EscruteOut[]> {
    return sendWithSession<EscruteOut[]>('/me/escrutes');
}

export function useReplaceEscrutesMutation() {
    return useMutation({
        mutationFn: (escrutes: EscruteIn[]) =>
            sendWithSession<EscruteOut[]>('/me/escrutes', {method: 'PUT', body: {escrutes}}),
    });
}

export function useCreateEscruteMutation() {
    return useMutation({
        mutationFn: (escrute: EscruteIn) => sendWithSession<EscruteOut>('/me/escrutes', {method: 'POST', body: escrute}),
    });
}

export function useUpdateEscruteMutation() {
    return useMutation({
        mutationFn: ({id, title, lectures}: { id: string; title: string; lectures: Lecture[] }) =>
            sendWithSession<EscruteOut>(`/me/escrutes/${id}`, {method: 'PATCH', body: {title, lectures}}),
    });
}

export function useDeleteEscruteMutation() {
    return useMutation({
        mutationFn: (id: string) => sendWithSession<void>(`/me/escrutes/${id}`, {method: 'DELETE'}),
    });
}
