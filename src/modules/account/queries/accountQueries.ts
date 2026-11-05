// TanStack Query wrappers around backendClient.ts's plain functions. Called once from
// accountStore.ts's setup (a Pinia setup store runs inside its own effectScope, which is exactly
// what useQuery()/useMutation() need), so these queries live for the app's lifetime, not a
// single component's - appropriate since account/newsletter/preferences are app-wide state.
import {useMutation, useQuery, useQueryClient} from '@tanstack/vue-query';
import type {Ref} from 'vue';
import {
    type Account,
    addPasswordWithCode,
    changePassword,
    continueWithGoogle,
    getAccount,
    logIn,
    mergePreferences,
    type PreferencesPayload,
    register,
    replacePreferences,
    resendVerificationCode,
    setNewsletterSubscription,
    signOut,
    updateAccount,
    verifyEmail,
} from '@/modules/account/services/backendClient.ts';

export const ACCOUNT_KEY = ['account'] as const;
export const NEWSLETTER_KEY = ['newsletter'] as const;
export const PREFERENCES_KEY = ['preferences'] as const;

export function useAccountQuery(enabled: Ref<boolean>) {
    return useQuery({queryKey: ACCOUNT_KEY, queryFn: getAccount, enabled});
}

export function useAccountMutations() {
    const queryClient = useQueryClient();
    const setAccount = (account: Account) => queryClient.setQueryData(ACCOUNT_KEY, account);

    const registerMutation = useMutation({mutationFn: register, onSuccess: setAccount});
    const addPasswordMutation = useMutation({mutationFn: addPasswordWithCode, onSuccess: setAccount});
    const loginMutation = useMutation({mutationFn: logIn, onSuccess: setAccount});
    const googleMutation = useMutation({
        mutationFn: (vars: { idToken: string; locale: string }) => continueWithGoogle(vars.idToken, vars.locale),
        onSuccess: setAccount,
    });
    const updateMutation = useMutation({mutationFn: updateAccount, onSuccess: setAccount});
    const verifyEmailMutation = useMutation({mutationFn: verifyEmail, onSuccess: setAccount});
    const resendMutation = useMutation({mutationFn: resendVerificationCode});
    const changePasswordMutation = useMutation({mutationFn: changePassword, onSuccess: setAccount});
    const logoutMutation = useMutation({
        mutationFn: signOut,
        onSettled: () => {
            queryClient.removeQueries({queryKey: ACCOUNT_KEY});
            queryClient.removeQueries({queryKey: NEWSLETTER_KEY});
            queryClient.removeQueries({queryKey: PREFERENCES_KEY});
        },
    });

    return {
        registerMutation,
        addPasswordMutation,
        loginMutation,
        googleMutation,
        updateMutation,
        verifyEmailMutation,
        resendMutation,
        changePasswordMutation,
        logoutMutation,
    };
}

export function useNewsletterMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: setNewsletterSubscription,
        onSuccess: (subscribed: boolean) => queryClient.setQueryData(NEWSLETTER_KEY, subscribed),
    });
}

export function usePreferencesMutations() {
    const queryClient = useQueryClient();
    const setCache = (data: PreferencesPayload) => queryClient.setQueryData(PREFERENCES_KEY, data);

    const replaceMutation = useMutation({mutationFn: replacePreferences, onSuccess: setCache});
    const mergeMutation = useMutation({mutationFn: mergePreferences, onSuccess: setCache});

    return {replaceMutation, mergeMutation};
}
