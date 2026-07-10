import { Commands } from "./commands.js"
import { Writing } from "./writing.js"

import type { Numeric, Value, Text, ValueArray, CommandsNames } from "./values.js"

export const Checks = {
    isText(value: unknown): value is Text {
        return typeof value === "string"
    },

    isValidText(value: unknown): value is Text {
        return Checks.isText(value) && value.trim().length > 0
    },

    isNumeric(value: unknown): value is Numeric {
        return typeof value === "number"
    },

    isFiniteNumber(value: unknown): value is Numeric {
        return Checks.isNumeric(value) && Number.isFinite(value)
    },

    isValue(value: unknown): value is Value {
        return Checks.isText(value) || Checks.isNumeric(value)
    },

    isValidValue(value: unknown): value is Value {
        return Checks.isValidText(value) || Checks.isFiniteNumber(value)
    },

    isCommand(value: Value): value is CommandsNames {
        return typeof value === "string" && Commands.names().includes(value)
    },

    numericPoint(points: ValueArray, index: Numeric): Numeric {
        return Number(Writing.decimal((points[index] ?? 0) as Numeric, true))
    },
}
