/// <reference types="vite/client.d.ts" />
interface ImportMetaEnv {
    readonly VITE_PASSWORD: string;
    readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
