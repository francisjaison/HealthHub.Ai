
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_CLIENT_SECRET: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_USE_MEDIAPIPE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

