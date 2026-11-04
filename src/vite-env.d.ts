/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_API_ENDPOINT?: string;
    readonly VITE_GOOGLE_CLIENT_ID?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
