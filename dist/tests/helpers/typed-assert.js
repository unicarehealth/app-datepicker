import { deepStrictEqual as dse, ok as ok2, strictEqual as se, } from 'assert';
function formatErrorMessage(actual, expected, message) {
    return message !== null && message !== void 0 ? message : `\nExpected:\n${JSON.stringify(expected)}\n\nActual:\n${JSON.stringify(actual)}`;
}
function formatErrorMessageForOk(value, message) {
    return message !== null && message !== void 0 ? message : `\nNot all values are the same: \n\n${JSON.stringify(value)}`;
}
export function allStrictEqual(values, expected, message) {
    return ok2(values.every(n => n === expected), formatErrorMessage(values, expected, message));
}
export function deepStrictEqual(actual, expected, message) {
    return dse(actual, expected, formatErrorMessage(actual, expected, message));
}
export function ok(value, message) {
    return ok2(value, formatErrorMessageForOk(value, message));
}
export function strictEqual(actual, expected, message) {
    return se(actual, expected, formatErrorMessage(actual, expected, message));
}
