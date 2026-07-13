import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        environment: "node",
        include: ["tests/**/*.test.ts"],
        globals: false,
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            include: ["src/**/*.{js,ts}"],
            exclude: ["src/**/*.d.ts", "src/JSON/**"],
        },
    },
})
