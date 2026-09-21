import { Algebra } from "./algebra.js";
import { Checks } from "./checks.js";
export class MathFunction {
    type;
    a;
    b;
    c;
    constructor({ type = "poly", a = "a", b = "b", c = "c", } = {}) {
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
        return (Checks.isFiniteNumber(this.numericA) &&
            Checks.isFiniteNumber(this.numericB) &&
            Checks.isFiniteNumber(this.numericC));
    }
    get variableA() {
        return this.a == "a";
    }
    get variableB() {
        return this.b == "b";
    }
    get variableC() {
        return this.c == "c";
    }
    get variableCoefs() {
        return this.variableA || this.variableB || this.variableC;
    }
    get isConstant() {
        return this.numericA == 0 && this.numericB == 0;
    }
    get isAffine() {
        return this.numericA == 0 && this.numericB !== 0;
    }
    get isQuadratic() {
        return this.numericA !== 0;
    }
    get isValidExpLog() {
        return this.numericA > 0 && this.numericA !== 1 && this.numericB !== 0;
    }
    get isConstantExpLog() {
        return this.numericA == 0 || this.numericA == 1 || this.numericB == 0;
    }
    get isInvalidExpLog() {
        return this.numericA < 0;
    }
    get isValidTrig() {
        return this.numericA !== 0 && this.numericB !== 0;
    }
    get isConstantTrig() {
        return this.numericA == 0 || this.numericB == 0;
    }
    resolveCoefs = () => {
        const solved = Algebra.resolveUnknown({ a: this.a, b: this.b, c: this.c }, this.type);
        this.a = Algebra.round(solved.a);
        this.b = Algebra.round(solved.b);
        this.c = Algebra.round(solved.c);
    };
    refreshCoefs = () => {
        this.a = Algebra.variables("a");
        this.b = Algebra.variables("b");
        this.c = Algebra.variables("c");
    };
    toCoefficients = () => ({ a: this.a, b: this.b, c: this.c });
    clone = () => new MathFunction({ type: this.type, a: this.a, b: this.b, c: this.c });
}
