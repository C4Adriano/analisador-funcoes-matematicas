import js from "@eslint/js"
import json from "@eslint/json"
import markdown from "@eslint/markdown"
import prettierConfig from "eslint-config-prettier"
import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
    {
        ignores: ["**/node_modules/**"],
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
            "prefer-const": ["warn", { destructuring: "all" }],
            "no-var": "error",
            "no-shadow": "warn",
            "no-useless-assignment": "warn",
            "block-scoped-var": "error",
            "no-undef-init": "warn",
            eqeqeq: ["off", "smart"],
            "no-self-compare": "error",
            yoda: "warn",
            curly: ["warn", "multi-line"],
            "no-else-return": ["warn", { allowElseIf: false }],
            "no-lonely-if": "warn",
            "no-nested-ternary": "off",
            "no-unneeded-ternary": "warn",
            "default-case": "warn",
            "default-case-last": "warn",
            "no-fallthrough": "error",
            "no-case-declarations": "error",
            "array-callback-return": "error",
            "no-constant-condition": ["error", { checkLoops: false }],
            "no-param-reassign": ["off", { props: false }],
            "prefer-arrow-callback": "warn",
            "arrow-body-style": ["warn", "as-needed"],
            "no-return-await": "warn",
            "require-await": "warn",
            "no-async-promise-executor": "error",
            "no-promise-executor-return": "error",
            "object-shorthand": ["warn", "always"],
            "prefer-template": "warn",
            "prefer-spread": "warn",
            "prefer-rest-params": "warn",
            "no-array-constructor": "warn",
            "no-new-object": "warn",
            "no-useless-concat": "warn",
            "no-useless-computed-key": "warn",
            "no-useless-rename": "warn",
            "no-duplicate-imports": "error",
            "no-multi-assign": "warn",
            "no-implicit-coercion": "warn",
            "no-plusplus": "off",
            "no-bitwise": "off",
            complexity: ["warn", 30],
            "max-depth": ["warn", 4],
            "no-magic-numbers": "off",
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
                ...globals.es2027,
            },
        },
        rules: {
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "consistent-return": "warn",
            "no-throw-literal": "error",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            "no-shadow": "off",
            "@typescript-eslint/no-shadow": "warn",
            "no-use-before-define": "off",
            "@typescript-eslint/no-use-before-define": ["error", { functions: false, classes: true, variables: true }],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
            "@typescript-eslint/no-non-null-assertion": "warn",
            "@typescript-eslint/no-inferrable-types": "warn",
            "@typescript-eslint/array-type": ["warn", { default: "array" }],
            "@typescript-eslint/no-empty-function": "warn",
            "@typescript-eslint/ban-ts-comment": ["warn", { "ts-ignore": "allow-with-description" }],
            "prefer-const": ["warn", { destructuring: "all" }],
            "no-var": "error",
            eqeqeq: ["off", "smart"],
            curly: ["warn", "multi-line"],
            "no-else-return": ["warn", { allowElseIf: false }],
            "no-lonely-if": "warn",
            "no-nested-ternary": "off",
            "object-shorthand": ["warn", "always"],
            "prefer-template": "warn",
            "no-duplicate-imports": "error",
        },
    },

    // === JSON ===
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
    {
        files: ["**/*.md"],
        plugins: { markdown },
        language: "markdown/gfm",
        extends: ["markdown/recommended"],
    },

    // === PRETTIER ===
    prettierConfig,
])
