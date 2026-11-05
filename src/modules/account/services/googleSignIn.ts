// Wraps @capawesome/capacitor-google-sign-in so the Profile tab has one sign-in call on every
// platform. `clientId` must be the WEB OAuth client ID even on iOS/Android: the plugin always uses
// it as the token audience, which is what the backend's GOOGLE_CLIENT_IDS checks against. iOS also
// needs its own client ID, set natively via GIDClientID in ios/App/App/Info.plist.
import {Capacitor} from '@capacitor/core';
import {GoogleSignIn} from '@capawesome/capacitor-google-sign-in';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export const googleSignInEnabled = Boolean(CLIENT_ID);

export type GoogleSignInResult = {
    idToken: string;
    pictureUrl: string | null;
};

let initialized: Promise<void> | null = null;

function ensureInitialized(): Promise<void> {
    if (!initialized) {
        initialized = googleSignInEnabled
            ? GoogleSignIn.initialize({
                clientId: CLIENT_ID as string,
                // Only read by the web implementation; signIn() there throws without it. Must be
                // registered as an Authorized redirect URI for VITE_GOOGLE_CLIENT_ID in Google Cloud.
                redirectUrl: `${window.location.origin}/profile`,
            })
            : Promise.resolve();
    }
    return initialized;
}

// The hash Google's implicit flow redirects back with; absent on every ordinary page load, so
// handleRedirectCallback() (which throws unconditionally otherwise) is only worth calling with it.
function hasRedirectResult(): boolean {
    return /(^|&)(id_token|error)=/.test(window.location.hash.slice(1));
}

/**
 * Call once at startup. On the web build, a sign-in redirects away and back instead of resolving
 * in place; this picks up the ID token after that round trip. No-op on native, when disabled, and
 * on an ordinary load that isn't returning from Google.
 */
export async function completeRedirectSignIn(): Promise<GoogleSignInResult | null> {
    if (!googleSignInEnabled || Capacitor.getPlatform() !== 'web' || !hasRedirectResult()) return null;
    await ensureInitialized();
    try {
        const result = await GoogleSignIn.handleRedirectCallback();
        return result ? {idToken: result.idToken, pictureUrl: result.imageUrl} : null;
    } catch (error) {
        console.error('Error completing Google sign-in redirect:', error);
        return null;
    }
}

/**
 * Starts sign-in. Resolves with the ID token on native platforms; on web it redirects and this
 * promise never settles — the token arrives later from completeRedirectSignIn() on next load.
 */
export async function signInWithGoogle(): Promise<GoogleSignInResult | null> {
    await ensureInitialized();
    const result = await GoogleSignIn.signIn();
    return result ? {idToken: result.idToken, pictureUrl: result.imageUrl} : null;
}
