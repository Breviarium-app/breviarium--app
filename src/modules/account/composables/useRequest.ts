// Runs an async request, tracking a busy/error pair the same way the landing's useRequest hook does.
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {ApiError} from '@/modules/account/services/backendClient.ts';

export function useRequest(messageFor: (status: number) => string | undefined = () => undefined) {
    const {t} = useI18n();
    const busy = ref(false);
    const error = ref('');

    const run = async (request: () => Promise<void>) => {
        busy.value = true;
        error.value = '';
        try {
            await request();
        } catch (e) {
            if (e instanceof ApiError) {
                error.value = messageFor(e.status) ?? (e.status === 429 ? t('account.errors.too_many') : t('account.errors.generic'));
            } else {
                error.value = t('account.errors.network');
            }
        } finally {
            busy.value = false;
        }
    };

    return {busy, error, run};
}
