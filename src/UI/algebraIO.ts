import { INPUT_FAILED } from "../Base/consts.js"
import { tr } from "../Lang/i18n.js"
import { subscript } from "../Lang/writing.js"
import type { AlgebraIO } from "../Math/algebra.js"
import { input, isActionConfirmed, notify } from "./display.js"
import { resolveFunction } from "./ui.js"

async function askPoints<Count extends 1 | 2 | 3>(count: Count): Promise<PointPairReturn<Count>> {
    const pairs: Point[] = []

    for (let index = 1; index <= count; index++) {
        const x = await input(`x${subscript(index)} = `, { type: "number", placeholder: String(index) }),
            y = await input(`y${subscript(index)} = `, { type: "number", placeholder: String(index) })

        pairs.push({ x: x === INPUT_FAILED ? 0 : x, y: y === INPUT_FAILED ? 0 : y })
    }

    return pairs as PointPairReturn<Count>
}

function describeExpressionError(error: ExpressionError): string {
    if (error.kind === "notReal") return tr("algebra.notReal", { kind: tr(`algebra.kind.${error.actual}`) })
    if (error.reason === "divZero") return tr("algebra.divZero")
    return error.right == null ? tr("algebra.incompatibleFunction", { name: error.operator, kind: tr(`algebra.kind.${error.left}`) }) : tr("algebra.incompatible", { operator: error.operator, left: tr(`algebra.kind.${error.left}`), right: tr(`algebra.kind.${error.right}`) })
}

export const algebraIO: AlgebraIO = {
    askExpression: async (name, placeholder) => input(`${name} = `, { explanation: tr("algebra.variableAsk", { name }), placeholder }),
    askPoints,
    showFunction: async (coefs, kind) => resolveFunction(coefs, kind),
    notifyInvalidValues: async () => notify(tr("errors.error002"), { explanation: tr("errors.reason", { reason: tr("algebra.invalidValues") }), type: "error" }),
    confirmChangeValues: async () => isActionConfirmed(tr("algebra.changeValues"), { explanation: tr("algebra.changeValuesExp") }),
    expressionError: async error => notify(tr("errors.error002"), { explanation: tr("errors.reason", { reason: describeExpressionError(error) }), type: "error" }),
}
