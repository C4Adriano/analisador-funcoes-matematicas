import eslintComments from "@eslint-community/eslint-plugin-eslint-comments"
import js from "@eslint/js"
import json from "@eslint/json"
import prettierConfig from "eslint-config-prettier"
import noUnsanitized from "eslint-plugin-no-unsanitized"
import packageJson, { configs as packageJsonConfigs } from "eslint-plugin-package-json"
import promise from "eslint-plugin-promise"
import regexp from "eslint-plugin-regexp"
import security from "eslint-plugin-security"
import sonarjs from "eslint-plugin-sonarjs"
import unicorn from "eslint-plugin-unicorn"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

const layers = ["Base", "Lang", "Math", "UI", "Core"],
    ioFile = "src/UI/io.ts",
    commonRules = {
        "@typescript-eslint/max-params": ["warn", { max: 5 }],
        "@typescript-eslint/no-unused-expressions": ["warn", { allowTernary: true }],
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
        "@typescript-eslint/no-use-before-define": ["warn", { functions: false }],
        eqeqeq: ["warn", "smart"],
        "func-style": ["warn", "declaration"],
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "one-var": ["warn", { const: "consecutive", let: "consecutive" }],
    },
    offGeral = Object.fromEntries(
        [
            "class-methods-use-this",
            "complexity",
            "func-names",
            "id-length",
            "id-match",
            "init-declarations",
            "max-depth",
            "max-lines",
            "max-lines-per-function",
            "max-nested-callbacks",
            "max-params",
            "max-statements",
            "no-await-in-loop",
            "no-bitwise",
            "no-continue",
            "no-eq-null",
            "no-inline-comments",
            "no-magic-numbers",
            "no-nested-ternary",
            "no-param-reassign",
            "no-plusplus",
            "no-ternary",
            "no-throw-literal",
            "no-undefined",
            "no-underscore-dangle",
            "no-warning-comments",
            "require-atomic-updates",
            "sort-imports",
            "sort-keys",
            "sort-vars",
            "@typescript-eslint/member-ordering",
            "@typescript-eslint/naming-convention",
            "@typescript-eslint/no-confusing-void-expression",
            "@typescript-eslint/no-magic-numbers",
            "@typescript-eslint/no-non-null-assertion",
            "@typescript-eslint/no-unsafe-argument",
            "@typescript-eslint/no-unsafe-assignment",
            "@typescript-eslint/no-unsafe-call",
            "@typescript-eslint/no-unsafe-return",
            "@typescript-eslint/no-unsafe-type-assertion",
            "@typescript-eslint/only-throw-error",
            "@typescript-eslint/prefer-readonly-parameter-types",
            "@typescript-eslint/strict-boolean-expressions",
            "regexp/letter-case",
            "security/detect-non-literal-fs-filename",
            "security/detect-object-injection",
            "security/detect-possible-timing-attacks",
            "unicorn/catch-error-name",
            "unicorn/consistent-arrow-return-style",
            "unicorn/consistent-boolean-name",
            "unicorn/consistent-class-member-order",
            "unicorn/filename-case",
            "unicorn/max-nested-calls",
            "unicorn/name-replacements",
            "unicorn/new-for-builtins",
            "unicorn/no-array-callback-reference",
            "unicorn/no-array-reduce",
            "unicorn/no-asterisk-prefix-in-documentation-comments",
            "unicorn/no-nested-ternary",
            "unicorn/no-null",
            "unicorn/no-unreadable-array-destructuring",
            "unicorn/prefer-switch",
            "unicorn/prevent-abbreviations",
            "unicorn/single-line-block-comment-style",
            "unicorn/switch-case-braces",
            "no-alert",
        ].map(ruleName => [ruleName, "off"]),
    )

function layerBlock(layer, index) {
    const forbidden = layers.slice(index + 1)
    return { files: [`src/${layer}/**/*.ts`], rules: { "@typescript-eslint/no-restricted-imports": ["warn", { patterns: forbidden.map(name => ({ group: [`**/${name}/**`], message: `${layer} must not import from ${name} (layer order: ${layers.join(" > ")}).` })) }] } }
}

export default defineConfig([
    { linterOptions: { reportUnusedDisableDirectives: "warn" }, ignores: ["**/node_modules/**", "pessoal/**"] },
    { ignores: ["./package.json", "./package-lock.json", "**/schemas/**"], files: ["**/*.json"], language: "json/json", extends: [json.configs.recommended], rules: { "json/sort-keys": "error", "json/top-level-interop": "error" } },
    { ignores: ["./package.json", "./package-lock.json", "**/schemas/**"], files: ["**/*.jsonc"], language: "json/jsonc", extends: [json.configs.recommended], rules: { "json/sort-keys": "error", "json/top-level-interop": "error" } },
    { files: ["./package.json"], plugins: { "package-json": packageJson }, extends: [packageJsonConfigs.recommended] },
    {
        files: ["src/**/*.ts"],
        extends: [js.configs.all, tseslint.configs.all, unicorn.configs.all, regexp.configs.all, promise.configs["flat/recommended"], security.configs.recommended],
        plugins: { "no-unsanitized": noUnsanitized, "@eslint-community/eslint-comments": eslintComments, regexp, sonarjs, unicorn, promise, security },
        languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } },
        rules: { ...offGeral, ...commonRules },
    },
    // ...layers.slice(0, -1).map(layerBlock),
    { files: [ioFile], rules: { "no-alert": "off", "@typescript-eslint/require-await": "off" } },
    prettierConfig,
])
