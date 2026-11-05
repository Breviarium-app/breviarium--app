import {defineStore} from 'pinia';
import {computed, ref, watch} from 'vue';
import {useQueryClient} from '@tanstack/vue-query';
import {Preferences} from '@capacitor/preferences';
import {
    getAccount as apiGetAccount,
    getNewsletterSubscription as apiGetNewsletterSubscription,
    getPreferences as apiGetPreferences,
    hasSession,
    isGoogleAccountCodeSent,
    onSignedOut,
    sessionReady,
} from '@/modules/account/services/backendClient.ts';
import {
    ACCOUNT_KEY,
    NEWSLETTER_KEY,
    PREFERENCES_KEY,
    useAccountMutations,
    useAccountQuery,
    useNewsletterMutation,
    usePreferencesMutations,
} from '@/modules/account/queries/accountQueries.ts';
import {completeRedirectSignIn, signInWithGoogle} from '@/modules/account/services/googleSignIn.ts';
import {useSettingsStore} from '@/modules/app/stores/settingsStore.ts';
import {useAlertsStore} from '@/modules/app/stores/alertsStore.ts';
import {useIntentionsStore} from '@/modules/app/stores/intentionsStore.ts';
import {useDiaryStore} from '@/modules/app/stores/diaryStore.ts';
import {useEscruteStore} from '@/modules/escrute/escruteStore.ts';
import {debounce} from '@/modules/app/utils/debounce.ts';

// The backend has no avatar field, so the Google profile picture is only cached on this device,
// from whichever Google sign-in last provided one - it won't follow you to a new device.
const PICTURE_KEY = 'account.pictureUrl';

export const useAccountStore = defineStore('account', () => {
    const signedIn = ref(false);
    const isReady = ref(false);
    const accountLoadFailed = ref(false);
    const pictureUrl = ref<string | null>(null);

    const queryClient = useQueryClient();
    const {data: account} = useAccountQuery(computed(() => signedIn.value));
    const {
        registerMutation,
        addPasswordMutation,
        loginMutation,
        googleMutation,
        updateMutation,
        verifyEmailMutation,
        resendMutation,
        changePasswordMutation,
        logoutMutation,
    } = useAccountMutations();
    const newsletterMutation = useNewsletterMutation();
    const {replaceMutation, mergeMutation} = usePreferencesMutations();

    const savePictureUrl = async (url: string | null) => {
        pictureUrl.value = url;
        if (url) await Preferences.set({key: PICTURE_KEY, value: url});
        else await Preferences.remove({key: PICTURE_KEY});
    };

    // Skips pushing a settings/alerts sync that merely echoes what was just pulled or pushed
    let lastSyncedSettings = '';
    let lastSyncedAlerts = '';
    let stopWatchers: Array<() => void> = [];

    const pushSettings = debounce(async () => {
        if (!signedIn.value) return;
        const snapshot = JSON.stringify(useSettingsStore().settings);
        if (snapshot === lastSyncedSettings) return;
        try {
            await mergeMutation.mutateAsync({settings: useSettingsStore().settings});
            lastSyncedSettings = snapshot;
        } catch (error) {
            console.error('Error syncing settings:', error);
        }
    }, 1000);

    const pushAlerts = debounce(async () => {
        if (!signedIn.value) return;
        const snapshot = JSON.stringify(useAlertsStore().alerts);
        if (snapshot === lastSyncedAlerts) return;
        try {
            await mergeMutation.mutateAsync({alerts: useAlertsStore().alerts});
            lastSyncedAlerts = snapshot;
        } catch (error) {
            console.error('Error syncing alerts:', error);
        }
    }, 1000);

    const watchLocalChanges = () => {
        if (stopWatchers.length) return;
        stopWatchers.push(watch(() => useSettingsStore().settings, pushSettings, {deep: true}));
        stopWatchers.push(watch(() => useAlertsStore().alerts, pushAlerts, {deep: true}));
    };

    const unwatchLocalChanges = () => {
        stopWatchers.forEach((stop) => stop());
        stopWatchers = [];
    };

    // Pulls settings/alerts on sign-in: seeds the account from this device if it has none yet,
    // otherwise applies what's stored remotely (remote wins - logging in elsewhere follows you).
    const syncPreferences = async () => {
        const settingsStore = useSettingsStore();
        const alertsStore = useAlertsStore();
        try {
            const {preferences, updated_at} = await queryClient.fetchQuery({
                queryKey: PREFERENCES_KEY,
                queryFn: apiGetPreferences,
            });
            if (updated_at === null) {
                await replaceMutation.mutateAsync({settings: settingsStore.settings, alerts: alertsStore.alerts});
            } else {
                const remote = preferences as { settings?: Record<string, unknown>; alerts?: Record<string, unknown> };
                if (remote.settings) await settingsStore.applyRemoteSettings(remote.settings);
                if (remote.alerts) await alertsStore.applyRemoteAlerts(remote.alerts);
            }
            lastSyncedSettings = JSON.stringify(settingsStore.settings);
            lastSyncedAlerts = JSON.stringify(alertsStore.alerts);
        } catch (error) {
            console.error('Error syncing preferences:', error);
        }
        watchLocalChanges();
    };

    // Pulls/seeds every synced collection; called whenever a session starts, whether just now
    // (register/login/Google) or restored from a previous one (init() on a cold start).
    const syncAllOnSignIn = async () => {
        await syncPreferences();
        await useIntentionsStore().syncOnSignIn();
        await useDiaryStore().syncOnSignIn();
        await useEscruteStore().syncOnSignIn();
    };

    const applySignedIn = async () => {
        signedIn.value = true;
        await syncAllOnSignIn();
    };

    const continueWithGoogle = async (idToken: string, locale = 'es', newPictureUrl: string | null = null) => {
        const acc = await googleMutation.mutateAsync({idToken, locale});
        if (newPictureUrl) await savePictureUrl(newPictureUrl);
        await applySignedIn();
        return acc;
    };

    const clearAccountCache = () => {
        queryClient.removeQueries({queryKey: ACCOUNT_KEY});
        queryClient.removeQueries({queryKey: NEWSLETTER_KEY});
        queryClient.removeQueries({queryKey: PREFERENCES_KEY});
    };

    /** Restores the session (if any) and account; call once at startup. */
    const init = async () => {
        if (isReady.value) return;
        await sessionReady();
        signedIn.value = hasSession();
        onSignedOut(() => {
            signedIn.value = false;
            unwatchLocalChanges();
            clearAccountCache();
        });
        const {value: cachedPictureUrl} = await Preferences.get({key: PICTURE_KEY});
        pictureUrl.value = cachedPictureUrl || null;
        if (signedIn.value) {
            try {
                await queryClient.fetchQuery({queryKey: ACCOUNT_KEY, queryFn: apiGetAccount});
                await syncAllOnSignIn();
            } catch (error) {
                console.error('Error loading account:', error);
                accountLoadFailed.value = true;
            }
        }
        // Picks up a Google sign-in that redirected away and back on the web build
        const result = await completeRedirectSignIn();
        if (result) await continueWithGoogle(result.idToken, 'es', result.pictureUrl);
        isReady.value = true;
    };

    /** Retries loading the account after a failed startup load; the session is kept either way. */
    const retryLoadAccount = async () => {
        try {
            await queryClient.fetchQuery({queryKey: ACCOUNT_KEY, queryFn: apiGetAccount, staleTime: 0});
            accountLoadFailed.value = false;
            await syncAllOnSignIn();
        } catch (error) {
            console.error('Error loading account:', error);
            accountLoadFailed.value = true;
        }
    };

    const register = async (input: { name: string; email: string; password: string; locale: string }) => {
        const acc = await registerMutation.mutateAsync(input);
        await applySignedIn();
        return acc;
    };

    /** Adds a password to a Google-only account, with the code register() emailed. Signs in. */
    const completeGoogleAddPassword = async (input: { email: string; code: string; new_password: string }) => {
        const acc = await addPasswordMutation.mutateAsync(input);
        await applySignedIn();
        return acc;
    };

    const logIn = async (input: { email: string; password: string }) => {
        const acc = await loginMutation.mutateAsync(input);
        await applySignedIn();
        return acc;
    };

    /** Starts Google sign-in. Resolves on native; on web the page redirects, and init() finishes
     *  the job after it comes back. */
    const signInWithGoogleAndContinue = async (locale = 'es') => {
        const result = await signInWithGoogle();
        if (result) await continueWithGoogle(result.idToken, locale, result.pictureUrl);
    };

    const logOut = async () => {
        unwatchLocalChanges();
        await logoutMutation.mutateAsync();
        await savePictureUrl(null);
        signedIn.value = false;
    };

    const updateAccount = (changes: { name: string; country: string; city: string }) => updateMutation.mutateAsync(changes);

    const verifyEmail = (code: string) => verifyEmailMutation.mutateAsync(code);

    const resendVerificationCode = () => resendMutation.mutateAsync();

    const changePassword = (input: { current_password: string; new_password: string }) => changePasswordMutation.mutateAsync(input);

    const getNewsletterSubscription = () => queryClient.fetchQuery({queryKey: NEWSLETTER_KEY, queryFn: apiGetNewsletterSubscription});

    const setNewsletterSubscription = (subscribed: boolean) => newsletterMutation.mutateAsync(subscribed);

    return {
        account,
        signedIn,
        isReady,
        accountLoadFailed,
        pictureUrl,
        init,
        retryLoadAccount,
        register,
        completeGoogleAddPassword,
        logIn,
        continueWithGoogle,
        signInWithGoogleAndContinue,
        logOut,
        updateAccount,
        verifyEmail,
        resendVerificationCode,
        changePassword,
        getNewsletterSubscription,
        setNewsletterSubscription,
        isGoogleAccountCodeSent,
    };
});
