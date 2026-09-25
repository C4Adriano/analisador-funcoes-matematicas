import { resolveUnknown, round, variables } from "./algebra.js";
import { isFiniteNumber } from "./checks.js";
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
    resolveCoefs = () => {
        const solved = resolveUnknown({ a: this.a, b: this.b, c: this.c }, this.type);
        this.a = round(Number(solved.a));
        this.b = round(Number(solved.b));
        this.c = round(Number(solved.c));
    };
    refreshCoefs = () => {
        this.a = variables("a");
        this.b = variables("b");
        this.c = variables("c");
    };
    toCoefficients = () => ({ a: this.a, b: this.b, c: this.c });
    toNumericCoefficients = () => ({ a: this.numericA, b: this.numericB, c: this.numericC });
    clone = () => new MathFunction({ type: this.type, a: this.a, b: this.b, c: this.c });
}
