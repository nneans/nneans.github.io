import "vite/client";

declare global {
  interface ImportMetaEnv {
    readonly VITE_HIT_COUNTER_API_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
