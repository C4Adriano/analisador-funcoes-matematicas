import { Writing } from "./writing.js";
export const Checks = {
    isText(value) {
        return typeof value === "string";
    },
    isValidText(value) {
        return Checks.isText(value) && value.trim().length > 0;
    },
    isNumeric(value) {
        return typeof value === "number";
    },
    isFiniteNumber(value) {
        return Checks.isNumeric(value) && Number.isFinite(value);
    },
    isValue(value) {
        return Checks.isText(value) || Checks.isNumeric(value);
    },
    isValidValue(value) {
        return Checks.isValidText(value) || Checks.isFiniteNumber(value);
    },
    numericPoint(points, index) {
        return Number(Writing.decimal(points[index] ?? 0, true));
    },
};
//# sourceMappingURL=checks.js.map