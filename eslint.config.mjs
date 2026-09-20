import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

/** @type {import("eslint").Linter.RulesRecord} */
const commonConfig = {
    "block-scoped-var": "warn",
    "consistent-return": "warn",
    curly: ["warn", "multi"],
    "default-case": "warn",
    "default-case-last": "warn",
    eqeqeq: ["warn", "smart"],
    "guard-for-in": "warn",
    "no-array-constructor": "warn",
    "no-await-in-loop": "warn",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-constant-condition": ["warn", { checkLoops: false }],
    "no-duplicate-imports": "warn",
    "no-else-return": ["warn", { allowElseIf: false }],
    "no-extra-bind": "warn",
    "no-implicit-coercion": "warn",
    "no-lone-blocks": "warn",
    "no-lonely-if": "warn",
    "no-multi-assign": "warn",
    "no-negated-condition": "warn",
    "no-new-func": "warn",
    "no-undef-init": "warn",
    "no-unused-expressions": ["warn", { allowTernary: true }],
    "no-useless-call": "warn",
    "no-var": "warn",
    "object-shorthand": ["warn", "always"],
    "one-var": ["warn", { const: "consecutive", let: "consecutive" }],
    "prefer-arrow-callback": "warn",
    "prefer-const": ["warn", { destructuring: "all" }],
    "prefer-exponentiation-operator": "warn",
    "prefer-named-capture-group": "warn",
    "prefer-object-has-own": "warn",
    "prefer-object-spread": "warn",
    "prefer-rest-params": "warn",
    "prefer-spread": "warn",
    "prefer-template": "warn",
    "require-atomic-updates": "warn",
    "require-await": "warn",
    yoda: "warn",
}

export default defineConfig([
    { linterOptions: { reportUnusedDisableDirectives: "warn" }, ignores: ["**/node_modules/**", "package-lock.json"] },

    // === JAVASCRIPT ===
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        extends: [js.configs.recommended],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...globals.browser, ...globals.node, ...globals.es2027 },
        },
        rules: {
            ...commonConfig,

            "no-empty-function": "warn",
            "no-shadow": "warn",
            "no-throw-literal": "off",
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            "no-use-before-define": ["warn", { functions: false, classes: true, variables: true }],
        },
    },

    // === TYPESCRIPT ===
    {
        files: ["**/*.{ts,tsx,mts,cts}"],
        extends: [tseslint.configs.recommended],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
        rules: {
            ...commonConfig,

            "@typescript-eslint/no-confusing-non-null-assertion": "warn",
            "@typescript-eslint/no-dynamic-delete": "warn",
            "@typescript-eslint/no-empty-function": "warn",
            "@typescript-eslint/no-import-type-side-effects": "warn",
            "@typescript-eslint/no-non-null-assertion": "warn",
            "@typescript-eslint/no-shadow": "warn",
            "@typescript-eslint/no-unused-expressions": ["warn", { allowTernary: true }],
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            "@typescript-eslint/no-use-before-define": ["warn", { functions: false, classes: true, variables: true }],
            "@typescript-eslint/prefer-for-of": "warn",
        },
    },
])
