declare type Message = string | Error | undefined;
export declare function allStrictEqual<T>(values: T[], expected: T, message?: Message): void;
export declare function deepStrictEqual<T>(actual: T, expected: T, message?: Message): void;
export declare function ok<T>(value: T, message?: Message): void;
export declare function strictEqual<T>(actual: T, expected: T, message?: Message): void;
export {};
//# sourceMappingURL=typed-assert.d.ts.map