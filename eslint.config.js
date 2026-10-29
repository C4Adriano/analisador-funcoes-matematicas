import eslintCommentsConfigs from "@eslint-community/eslint-plugin-eslint-comments/configs"
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
        "@typescript-eslint/naming-convention": [
            "error",
            { selector: "default", format: null, filter: { regex: "^_+$|[^\\x00-\\x7F]", match: true } },
            { selector: "variable", modifiers: ["const"], format: null, filter: { regex: "[^\\x00-\\x7F]", match: true } },
            { selector: ["objectLiteralProperty", "objectLiteralMethod"], format: null },
            { selector: "variable", modifiers: ["const"], format: ["camelCase", "UPPER_CASE", "PascalCase"], leadingUnderscore: "allow" },
            { selector: "import", format: ["camelCase", "PascalCase"] },
            { selector: "typeLike", format: ["PascalCase"] },
            { selector: "enumMember", format: ["PascalCase"] },
            { selector: "default", format: ["camelCase"], leadingUnderscore: "allow" },
        ],
        "@typescript-eslint/no-unused-expressions": ["warn", { allowTernary: true }],
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
        "@typescript-eslint/no-use-before-define": ["warn", { functions: false }],
        complexity: ["warn", { max: 30 }],
        eqeqeq: ["warn", "smart"],
        "func-style": ["warn", "declaration"],
        "local/no-comments": "warn",
        "max-depth": ["warn", { max: 5 }],
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "one-var": ["warn", { const: "consecutive", let: "consecutive" }],
        "sonarjs/cognitive-complexity": ["warn", 30],
        "unicorn/name-replacements": ["error", { replacements: { args: { parameters: true, arguments: false }, str: { text: true, string: false }, num: { number: false }, dist: { distance: true, distribution: false }, acc: { total: true, accumulator: false } }, allowList: { found: true } }],
        "max-lines": ["warn", { max: 500 }],
        "max-lines-per-function": ["warn", { max: 300 }],
        "max-statements": ["warn", { max: 50 }],
        "sort-imports": ["warn", { ignoreCase: true, ignoreDeclarationSort: true }],
    },
    disabledRules = Object.fromEntries(
        [
            "@typescript-eslint/no-magic-numbers",
            "@typescript-eslint/no-non-null-assertion",
            "@typescript-eslint/no-unsafe-type-assertion",
            "@typescript-eslint/prefer-readonly-parameter-types",
            "id-length",
            "no-await-in-loop",
            "no-continue",
            "no-eq-null",
            "no-param-reassign",
            "no-plusplus",
            "no-ternary",
            "prefer-named-capture-group",
            "regexp/prefer-named-capture-group",
            "require-atomic-updates",
            "security/detect-object-injection",
            "security/detect-possible-timing-attacks",
            "security/detect-unsafe-regex",
            "sonarjs/different-types-comparison",
            "sonarjs/no-nested-conditional",
            "sonarjs/no-nested-template-literals",
            "sonarjs/redundant-type-aliases",
            "sort-keys",
            "sort-vars",
            "unicorn/filename-case",
            "unicorn/max-nested-calls",
            "unicorn/no-array-reduce",
            "unicorn/no-null",
            "unicorn/prefer-switch",
        ].map(ruleName => [ruleName, "off"]),
    ),
    allowedCommentPattern = /^\s*(eslint-|@ts-|\/\s*<reference)/u,
    localPlugin = {
        rules: {
            "no-comments": {
                meta: { type: "suggestion", schema: [], messages: { forbidden: "Comments are not allowed." } },
                create(context) {
                    return {
                        Program() {
                            for (const comment of context.sourceCode.getAllComments()) {
                                if (!allowedCommentPattern.test(comment.value)) context.report({ loc: comment.loc, messageId: "forbidden" })
                            }
                        },
                    }
                },
            },
        },
    }

function layerBlock(layer, index) {
    const forbidden = layers.slice(index + 1)
    return { files: [`src/${layer}/**/*.ts`], rules: { "@typescript-eslint/no-restricted-imports": ["warn", { patterns: forbidden.map(name => ({ group: [`**/${name}/**`], message: `${layer} must not import from ${name} (layer order: ${layers.join(" > ")}).` })) }] } }
}

export default defineConfig([
    { ignores: ["**/node_modules/**", "**/dist/**", "**/.VSCodeCounter/**"] },
    { linterOptions: { reportUnusedDisableDirectives: "warn" } },
    { ignores: ["./package.json", "./package-lock.json", "**/schemas/**"], files: ["**/*.json"], language: "json/json", extends: [json.configs.recommended], rules: { "json/sort-keys": "error", "json/top-level-interop": "error" } },
    { ignores: ["./package.json", "./package-lock.json", "**/schemas/**"], files: ["**/*.jsonc"], language: "json/jsonc", extends: [json.configs.recommended], rules: { "json/sort-keys": "error", "json/top-level-interop": "error" } },
    { files: ["./package.json"], plugins: { "package-json": packageJson }, extends: [packageJsonConfigs.recommended] },
    {
        files: ["src/**/*.ts"],
        extends: [js.configs.all, tseslint.configs.all, unicorn.configs.all, regexp.configs.all, promise.configs["flat/recommended"], security.configs.recommended, sonarjs.configs.recommended, noUnsanitized.configs.recommended, eslintCommentsConfigs.recommended],
        plugins: { regexp, unicorn, promise, security, local: localPlugin },
        languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } },
        rules: { ...disabledRules, ...commonRules },
    },
    ...layers.slice(0, -1).map(layerBlock),
    { files: [ioFile], rules: { "no-alert": "off", "@typescript-eslint/require-await": "off", "unicorn/consistent-boolean-name": "off" } },
    prettierConfig,
])
