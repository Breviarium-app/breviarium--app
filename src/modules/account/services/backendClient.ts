// API client for breviarium--backend, the same one breviarium--landing talks to.
// Tokens live in Capacitor Preferences (async), cached in memory so sync checks like hasSession() work;
// sessionReady() resolves once that cache is primed, mirroring diaryStore's `loaded` pattern.
import {Preferences} from '@capacitor/preferences';

export const BACKEND_API_ENDPOINT = (
    import.meta.env.VITE_BACKEND_API_ENDPOINT ||
    (import.meta.env.DEV ? 'http://localhost:8000' : '')
).replace(/\/+$/, '');

export class ApiError extends Error {
    constructor(public status: number, public detail?: string) {
        super(`Request failed (${status})`);
    }
}

/** Why /auth/register refused an email that only signs in with Google, after emailing a code to add a password. */
export function isGoogleAccountCodeSent(e: unknown) {
    return e instanceof ApiError && e.status === 409 && e.detail === 'google_account_code_sent';
}

export type Account = {
    name: string;
    email: string;
    email_verified: boolean;
    country: string | null;
    city: string | null;
    has_password: boolean;
    has_google: boolean;
};

export type PreferencesPayload = { preferences: Record<string, unknown>; updated_at: string | null };

type Tokens = { access_token: string; refresh_token: string };
type TokenResponse = Tokens & { user: Account };

const SESSION_KEY = 'account.session';

let cachedTokens: Tokens | null | undefined;
let loadPromise: Promise<void> | null = null;

function loadCache(): Promise<void> {
    if (!loadPromise) {
        loadPromise = Preferences.get({key: SESSION_KEY})
            .then(({value}) => {
                cachedTokens = value ? (JSON.parse(value) as Tokens) : null;
            })
            .catch(() => {
                cachedTokens = null;
            });
    }
    return loadPromise;
}

/** Resolves once the session cache has been read from storage; call before trusting hasSession(). */
export function sessionReady(): Promise<void> {
    return loadCache();
}

export function hasSession(): boolean {
    return !!cachedTokens;
}

type SignedOutListener = () => void;
const signedOutListeners = new Set<SignedOutListener>();

/** Calls `callback` when the session ends without signing out here, e.g. a rejected refresh token. */
export function onSignedOut(callback: SignedOutListener): () => void {
    signedOutListeners.add(callback);
    return () => signedOutListeners.delete(callback);
}

async function saveTokens(tokens: Tokens): Promise<void> {
    cachedTokens = tokens;
    await Preferences.set({key: SESSION_KEY, value: JSON.stringify(tokens)});
}

async function clearTokens(): Promise<void> {
    cachedTokens = null;
    await Preferences.remove({key: SESSION_KEY});
}

async function errorDetail(res: Response): Promise<string | undefined> {
    try {
        const {detail} = await res.json();
        return typeof detail === 'string' ? detail : undefined;
    } catch {
        return undefined;
    }
}

async function send<T>(path: string, {method = 'GET', body, accessToken}: {
    method?: string;
    body?: unknown;
    accessToken?: string;
} = {}): Promise<T> {
    const res = await fetch(`${BACKEND_API_ENDPOINT}${path}`, {
        method,
        headers: {
            ...(body !== undefined && {'Content-Type': 'application/json'}),
            ...(accessToken && {Authorization: `Bearer ${accessToken}`}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) throw new ApiError(res.status, await errorDetail(res));
    return (res.status === 204 || res.status === 202 ? undefined : await res.json()) as T;
}

// The backend rotates refresh tokens and treats a reused one as stolen, ending the session.
// This lock makes concurrent 401s wait for a single refresh instead of racing each other.
let refreshLock: Promise<void> | null = null;

function refreshTokens(staleRefreshToken: string): Promise<void> {
    if (!refreshLock) {
        refreshLock = (async () => {
            await loadCache();
            if (!cachedTokens || cachedTokens.refresh_token !== staleRefreshToken) return;
            try {
                await saveTokens(await send<Tokens>('/auth/refresh', {
                    method: 'POST',
                    body: {refresh_token: staleRefreshToken},
                }));
            } catch (e) {
                // Only a rejected token ends the session, not a network failure or a server error
                if (e instanceof ApiError && e.status === 401) {
                    await clearTokens();
                    signedOutListeners.forEach((listener) => listener());
                }
                throw e;
            }
        })().finally(() => {
            refreshLock = null;
        });
    }
    return refreshLock;
}

async function sendWithSession<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
    await loadCache();
    if (!cachedTokens) throw new ApiError(401);
    const tokens = cachedTokens;
    try {
        return await send<T>(path, {...options, accessToken: tokens.access_token});
    } catch (e) {
        if (!(e instanceof ApiError) || e.status !== 401) throw e;
    }
    await refreshTokens(tokens.refresh_token);
    if (!cachedTokens) throw new ApiError(401);
    return send<T>(path, {...options, accessToken: cachedTokens.access_token});
}

async function startSession(path: string, body: unknown): Promise<Account> {
    const response = await send<TokenResponse>(path, {method: 'POST', body});
    await saveTokens(response);
    return response.user;
}

export function register(input: { name: string; email: string; password: string; locale: string }): Promise<Account> {
    return startSession('/auth/register', input);
}

/** Adds a password to a Google-only account, with the code emailed by register(). Signs in. */
export function addPasswordWithCode(input: { email: string; code: string; new_password: string }): Promise<Account> {
    return startSession('/auth/password/reset', input);
}

export function logIn(input: { email: string; password: string }): Promise<Account> {
    return startSession('/auth/login', input);
}

export function continueWithGoogle(idToken: string, locale: string): Promise<Account> {
    return startSession('/auth/google', {id_token: idToken, locale});
}

/** Forgets the session here and revokes it in the backend, best effort. */
export async function signOut(): Promise<void> {
    await loadCache();
    const tokens = cachedTokens;
    await clearTokens();
    if (tokens) {
        await send('/auth/logout', {method: 'POST', body: {refresh_token: tokens.refresh_token}}).catch(() => {
        });
    }
}

export function getAccount(): Promise<Account> {
    return sendWithSession<Account>('/me');
}

export function updateAccount(changes: { name: string; country: string; city: string }): Promise<Account> {
    return sendWithSession<Account>('/me', {method: 'PATCH', body: changes});
}

export function verifyEmail(code: string): Promise<Account> {
    return sendWithSession<Account>('/auth/email/verify', {method: 'POST', body: {code}});
}

export function resendVerificationCode(): Promise<void> {
    return sendWithSession<void>('/auth/email/resend', {method: 'POST'});
}

export async function changePassword(input: { current_password: string; new_password: string }): Promise<Account> {
    // It signs out every session, this one included, and answers with new tokens
    const response = await sendWithSession<TokenResponse>('/auth/password/change', {method: 'POST', body: input});
    await saveTokens(response);
    return response.user;
}

export async function getNewsletterSubscription(): Promise<boolean> {
    return (await sendWithSession<{ subscribed: boolean }>('/me/newsletter')).subscribed;
}

export async function setNewsletterSubscription(subscribed: boolean): Promise<boolean> {
    return (await sendWithSession<{ subscribed: boolean }>('/me/newsletter', {
        method: 'PUT',
        body: {subscribed},
    })).subscribed;
}

export function getPreferences(): Promise<PreferencesPayload> {
    return sendWithSession<PreferencesPayload>('/me/preferences');
}

export function replacePreferences(preferences: Record<string, unknown>): Promise<PreferencesPayload> {
    return sendWithSession<PreferencesPayload>('/me/preferences', {method: 'PUT', body: {preferences}});
}

export function mergePreferences(preferences: Record<string, unknown>): Promise<PreferencesPayload> {
    return sendWithSession<PreferencesPayload>('/me/preferences', {method: 'PATCH', body: {preferences}});
}
