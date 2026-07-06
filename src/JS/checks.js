import { Writing } from "./writing.js";
export const Checks = {
    isNumeric(value) {
        return typeof value === "number" && isFinite(value);
    },
    numericPoint(points, index) {
        return Number(Writing.decimal(points[index] ?? 0, true));
    },
};
//# sourceMappingURL=checks.js.map