import { isFiniteNumber } from "../Core/checks.js";
import { readStorage, removeStorage, writeStorage } from "../Core/storage.js";
import { variables } from "./algebra.js";
import { round } from "./numeric.js";
const STORAGE_KEY = "currentFunction", STORAGE_PREFIX = `${STORAGE_KEY}.`, SAVED_KEYS = ["a", "b", "c", "type"], FUNCTION_TYPES = ["poly", "exp", "log", "sin", "cos", "tan", "csc", "sec", "cot"], DEFAULT_FUNCTION = { a: "a", b: "b", c: "c", type: "poly" };
function isFunctionType(value) {
    return FUNCTION_TYPES.includes(value);
}
function parseSavedCoef(raw, variable) {
    if (raw === variable)
        return variable;
    if (raw == null || raw.trim() === "")
        return null;
    const value = Number(raw);
    return isFiniteNumber(value) ? value : null;
}
function settleCoef(value, variable) {
    return value === variable ? variable : round(Number(value));
}
export class MathFunction {
    type;
    a;
    b;
    c;
    constructor({ type = "poly", a = "a", b = "b", c = "c" } = {}) {
        this.type = type;
        this.a = a;
        this.b = b;
        this.c = c;
    }
    get numericA() {
        return Number(this.a);
    }
    get numericB() {
        return Number(this.b);
    }
    get numericC() {
        return Number(this.c);
    }
    get numericCoefs() {
        return isFiniteNumber(this.numericA) && isFiniteNumber(this.numericB) && isFiniteNumber(this.numericC);
    }
    get variableA() {
        return this.a === "a";
    }
    get variableB() {
        return this.b === "b";
    }
    get variableC() {
        return this.c === "c";
    }
    get variableCoefs() {
        return this.variableA || this.variableB || this.variableC;
    }
    get isConstant() {
        return this.numericA === 0 && this.numericB === 0;
    }
    get isAffine() {
        return this.numericA === 0 && this.numericB !== 0;
    }
    get isQuadratic() {
        return this.numericA !== 0;
    }
    get isValidExpLog() {
        return this.numericA > 0 && this.numericA !== 1 && this.numericB !== 0;
    }
    get isConstantExpLog() {
        return this.numericA === 0 || this.numericA === 1 || this.numericB === 0;
    }
    get isInvalidExpLog() {
        return this.numericA < 0;
    }
    get isValidTrig() {
        return this.numericA !== 0 && this.numericB !== 0;
    }
    get isConstantTrig() {
        return this.numericA === 0 || this.numericB === 0;
    }
    resolveCoefs = (solved) => {
        this.a = settleCoef(solved.a, "a");
        this.b = settleCoef(solved.b, "b");
        this.c = settleCoef(solved.c, "c");
        this.save();
    };
    refreshCoefs = () => {
        this.a = variables("a");
        this.b = variables("b");
        this.c = variables("c");
        this.save();
    };
    toCoefficients = () => ({ a: this.a, b: this.b, c: this.c });
    toNumericCoefficients = () => ({ a: this.numericA, b: this.numericB, c: this.numericC });
    save = () => {
        for (const key of SAVED_KEYS)
            writeStorage(STORAGE_PREFIX + key, String(this[key]));
    };
    load = () => {
        removeStorage(STORAGE_KEY);
        const a = parseSavedCoef(readStorage(`${STORAGE_PREFIX}a`), "a"), b = parseSavedCoef(readStorage(`${STORAGE_PREFIX}b`), "b"), c = parseSavedCoef(readStorage(`${STORAGE_PREFIX}c`), "c"), type = readStorage(`${STORAGE_PREFIX}type`);
        if (a == null || b == null || c == null || !isFunctionType(type))
            return false;
        Object.assign(this, { a, b, c, type });
        return true;
    };
    reset = () => {
        Object.assign(this, DEFAULT_FUNCTION);
    };
}
