import type {DefineNuxtConfig} from "nuxt/config";
import type {SchemaDefinition} from "nuxt/schema";

declare global {
    const defineNuxtConfig: DefineNuxtConfig
    const defineNuxtSchema: (schema: SchemaDefinition) => SchemaDefinition

    interface ImportMetaEnv {
        SMTP_HOST: string
        SMTP_PORT: string
        SMTP_SECURE: string|boolean
        SMTP_USER: string
        SMTP_PASS: string
        SMTP_FROM: string
        APP_NAME: string

        VITE_SUPPORT_EMAIL: string

        DATABASE_URL: string

        JWT_SECRET: string
    }

    interface ImportMeta {
        url: string
        readonly env: ImportMetaEnv
    }
}

export {}