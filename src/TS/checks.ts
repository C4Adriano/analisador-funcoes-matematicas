import { Writing } from "./writing.js"

import type * as Values from "./values.js"

export const Checks = {
    isNumeric(value: Values.Value | undefined): value is Values.Numeric {
        return typeof value === "number" && isFinite(value)
    },

    numericPoint(points: Values.ValueArray, index: number): Values.Numeric {
        return Number(Writing.decimal(points[index] ?? 0, true))
    },
}
