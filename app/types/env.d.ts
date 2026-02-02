import type {DefineNuxtConfig} from "nuxt/config";
import type {SchemaDefinition} from "nuxt/schema";

declare global {
    const defineNuxtConfig: DefineNuxtConfig
    const defineNuxtSchema: (schema: SchemaDefinition) => SchemaDefinition

    interface ImportMetaEnv {
        CONTACT_EMAIL: string
        SMTP_HOST: string
        SMTP_PORT: string
        SMTP_SECURE: string|boolean
        SMTP_USER: string
        SMTP_PASS: string

        VITE_PHONE: string
        VITE_EMAIL: string
        VITE_SUPPORT_EMAIL: string
    }

    interface ImportMeta {
        url: string
        readonly env: ImportMetaEnv
    }
}

export {}