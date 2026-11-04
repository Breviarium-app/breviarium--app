import {defineStore} from 'pinia';
import {ref, watch} from 'vue';
import {
    type Account,
    addPasswordWithCode,
    changePassword as apiChangePassword,
    continueWithGoogle as apiContinueWithGoogle,
    getAccount,
    getNewsletterSubscription,
    getPreferences,
    hasSession,
    isGoogleAccountCodeSent,
    logIn as apiLogIn,
    mergePreferences,
    onSignedOut,
    register as apiRegister,
    replacePreferences,
    resendVerificationCode as apiResendVerificationCode,
    sessionReady,
    setNewsletterSubscription,
    signOut as apiSignOut,
    updateAccount as apiUpdateAccount,
    verifyEmail as apiVerifyEmail,
} from '@/modules/account/services/backendClient.ts';
import {completeRedirectSignIn, signInWithGoogle} from '@/modules/account/services/googleSignIn.ts';
import {useSettingsStore} from '@/modules/app/stores/settingsStore.ts';
import {useAlertsStore} from '@/modules/app/stores/alertsStore.ts';

function debounce<Args extends unknown[]>(fn: (...args: Args) => void, ms: number) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: Args) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

export const useAccountStore = defineStore('account', () => {
    const account = ref<Account | null>(null);
    const signedIn = ref(false);
    const isReady = ref(false);

    // Skips pushing a settings/alerts sync that merely echoes what was just pulled or pushed
    let lastSyncedSettings = '';
    let lastSyncedAlerts = '';
    let stopWatchers: Array<() => void> = [];

    const pushSettings = debounce(async () => {
        if (!signedIn.value) return;
        const snapshot = JSON.stringify(useSettingsStore().settings);
        if (snapshot === lastSyncedSettings) return;
        try {
            await mergePreferences({settings: useSettingsStore().settings});
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
            await mergePreferences({alerts: useAlertsStore().alerts});
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
            const {preferences, updated_at} = await getPreferences();
            if (updated_at === null) {
                await replacePreferences({settings: settingsStore.settings, alerts: alertsStore.alerts});
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

    const applySignedIn = async (acc: Account) => {
        account.value = acc;
        signedIn.value = true;
        await syncPreferences();
    };

    const continueWithGoogle = async (idToken: string, locale = 'es') => {
        const acc = await apiContinueWithGoogle(idToken, locale);
        await applySignedIn(acc);
        return acc;
    };

    /** Restores the session (if any) and account; call once at startup. */
    const init = async () => {
        if (isReady.value) return;
        await sessionReady();
        signedIn.value = hasSession();
        onSignedOut(() => {
            account.value = null;
            signedIn.value = false;
            unwatchLocalChanges();
        });
        if (signedIn.value) {
            try {
                account.value = await getAccount();
                await syncPreferences();
            } catch (error) {
                console.error('Error loading account:', error);
            }
        }
        // Picks up a Google sign-in that redirected away and back on the web build
        const idToken = await completeRedirectSignIn();
        if (idToken) await continueWithGoogle(idToken);
        isReady.value = true;
    };

    const register = async (input: { name: string; email: string; password: string; locale: string }) => {
        const acc = await apiRegister(input);
        await applySignedIn(acc);
        return acc;
    };

    /** Adds a password to a Google-only account, with the code register() emailed. Signs in. */
    const completeGoogleAddPassword = async (input: { email: string; code: string; new_password: string }) => {
        const acc = await addPasswordWithCode(input);
        await applySignedIn(acc);
        return acc;
    };

    const logIn = async (input: { email: string; password: string }) => {
        const acc = await apiLogIn(input);
        await applySignedIn(acc);
        return acc;
    };

    /** Starts Google sign-in. Resolves on native; on web the page redirects, and init() finishes
     *  the job after it comes back. */
    const signInWithGoogleAndContinue = async (locale = 'es') => {
        const idToken = await signInWithGoogle();
        if (idToken) await continueWithGoogle(idToken, locale);
    };

    const logOut = async () => {
        unwatchLocalChanges();
        await apiSignOut();
        account.value = null;
        signedIn.value = false;
    };

    const updateAccount = async (changes: { name: string; country: string; city: string }) => {
        account.value = await apiUpdateAccount(changes);
        return account.value;
    };

    const verifyEmail = async (code: string) => {
        account.value = await apiVerifyEmail(code);
        return account.value;
    };

    const resendVerificationCode = () => apiResendVerificationCode();

    const changePassword = async (input: { current_password: string; new_password: string }) => {
        account.value = await apiChangePassword(input);
        return account.value;
    };

    return {
        account,
        signedIn,
        isReady,
        init,
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
