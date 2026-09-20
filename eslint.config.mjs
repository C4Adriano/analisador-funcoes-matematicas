import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

/** @type {import("eslint").Linter.RulesRecord} */
const commonConfig = {
    "consistent-return": "warn",
    curly: ["warn", "multi"],
    eqeqeq: ["warn", "smart"],
    "guard-for-in": "warn",
    "no-await-in-loop": "warn",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-else-return": ["warn", { allowElseIf: false }],
    "no-extra-bind": "warn",
    "no-implicit-coercion": "warn",
    "no-lone-blocks": "warn",
    "no-lonely-if": "warn",
    "no-negated-condition": "warn",
    "no-new-func": "warn",
    "no-useless-call": "warn",
    "no-var": "warn",
    "object-shorthand": ["warn", "always"],
    "one-var": ["warn", { const: "consecutive", let: "consecutive" }],
    "prefer-const": ["warn", { destructuring: "all" }],
    "prefer-exponentiation-operator": "warn",
    "prefer-named-capture-group": "warn",
    "prefer-object-has-own": "warn",
    "prefer-object-spread": "warn",
    "prefer-template": "warn",
    "require-atomic-updates": "warn",
    "no-duplicate-imports": "warn",
    "block-scoped-var": "warn",
    "default-case": "warn",
    "default-case-last": "warn",
    "no-array-constructor": "warn",
    "no-constant-condition": ["warn", { checkLoops: false }],
    "no-multi-assign": "warn",
    "no-undef-init": "warn",
    "no-unused-expressions": ["warn", { allowTernary: true }],
    "prefer-arrow-callback": "warn",
    "prefer-rest-params": "warn",
    "prefer-spread": "warn",
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

            "no-shadow": "warn",
            "no-throw-literal": "off",
            "no-use-before-define": ["warn", { functions: false, classes: true, variables: true }],
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            "no-empty-function": "warn",
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
            "@typescript-eslint/no-use-before-define": ["warn", { functions: false, classes: true, variables: true }],
            "@typescript-eslint/prefer-for-of": "warn",
            "@typescript-eslint/no-unused-expressions": ["warn", { allowTernary: true }],
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
        },
    },
])
