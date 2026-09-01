import js from "@eslint/js"
import json from "@eslint/json"
import markdown from "@eslint/markdown"
import prettierConfig from "eslint-config-prettier"
import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
    // Ignora diretórios de build/dependências em todos os projetos
    {
        ignores: ["**/dist/**", "**/build/**", "**/out/**", "**/node_modules/**", "**/coverage/**"],
    },

    // === JAVASCRIPT ===
    {
        files: ["*.?(m|c)js"],
        plugins: {
            js,
        },
        extends: ["js/recommended"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2027,
            },
        },
        rules: {
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            "no-use-before-define": ["error", { functions: false, classes: true, variables: true }],
            "consistent-return": "warn",
            "no-eval": "error",
            "no-throw-literal": "error",
        },
    },

    // === TYPESCRIPT ===
    // Requer: npm install typescript-eslint
    ...tseslint.configs.recommended.map(config => ({
        ...config,
        files: ["*.?(m|c)ts"],
    })),
    {
        files: ["*.?(m|c)ts"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2027,
            },
        },
        rules: {
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "consistent-return": "warn",
            "no-throw-literal": "error",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
        },
    },

    // === JSON ===
    // Requer: npm install @eslint/json
    {
        files: ["**/*.json"],
        plugins: { json },
        language: "json/json",
        extends: ["json/recommended"],
    },
    {
        files: ["**/*.jsonc"],
        plugins: { json },
        language: "json/jsonc",
        extends: ["json/recommended"],
    },
    {
        files: ["**/*.json5"],
        plugins: { json },
        language: "json/json5",
        extends: ["json/recommended"],
    },

    // === MARKDOWN ===
    // Requer: npm install @eslint/markdown
    {
        files: ["**/*.md"],
        plugins: { markdown },
        language: "markdown/gfm",
        extends: ["markdown/recommended"],
    },

    // === PRETTIER ===
    // Requer: npm install eslint-config-prettier
    prettierConfig,
])
