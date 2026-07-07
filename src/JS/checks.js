import { Writing } from "./writing.js";
export const Checks = {
    isText(value) {
        return typeof value === "string";
    },
    isNumeric(value) {
        return typeof value === "number";
    },
    isFiniteNumber(value) {
        return typeof value === "number" && Number.isFinite(value);
    },
    isValue(value) {
        return Checks.isText(value) || Checks.isNumeric(value);
    },
    numericPoint(points, index) {
        return Number(Writing.decimal(points[index] ?? 0, true));
    },
};
//# sourceMappingURL=checks.js.map