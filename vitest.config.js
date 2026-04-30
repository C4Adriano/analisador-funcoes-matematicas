import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        environment: "jsdom", // ← única mudança
        include: ["**/*.test.js"],
        globals: false,
    },
})
