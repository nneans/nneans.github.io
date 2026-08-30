/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HIT_COUNTER_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
