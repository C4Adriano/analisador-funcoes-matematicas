import js from "@eslint/js"
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
        files: ["**/*.{js,mjs,cjs,jsx}"],
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
                ...globals.es2021,
            },
        },
        rules: {
            "no-param-reassign": "off",
            "prefer-const": "off",
            "no-useless-assignment": "off",
            eqeqeq: "off",
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
        files: ["**/*.{ts,tsx,mts,cts}"],
    })),
    {
        files: ["**/*.{ts,tsx,mts,cts}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
            },
        },
        rules: {
            eqeqeq: "off",
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "consistent-return": "warn",
            "no-throw-literal": "error",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
        },
    },

    // === PRETTIER ===
    // Sempre por último: desativa qualquer regra de formatação que
    // colidiria com o Prettier (js/recommended ou typescript-eslint.recommended
    // podem trazer alguma no futuro). Requer: npm install eslint-config-prettier
    prettierConfig,
])
