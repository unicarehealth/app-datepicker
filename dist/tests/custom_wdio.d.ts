interface ChromeCapability {
    browserName: 'chrome';
    'goog:chromeOptions'?: {
        args: string[];
        w3c?: boolean;
    };
}
interface FirefoxCapability {
    browserName: 'firefox';
    'moz:firefoxOptions'?: {
        args: string[];
    };
}
interface SafariCapability {
    browserName: 'safari';
    'apple:safari.options'?: {
        technologyPreview: boolean;
    };
}
interface EdgeCapability {
    browserName: 'microsoftedge';
}
declare type BrowsersCapability = ChromeCapability | FirefoxCapability | SafariCapability | EdgeCapability;
interface BaseCapability extends Partial<Pick<WdioConfig, 'specs'>> {
    maxInstances?: number;
}
export declare type Capability = BaseCapability & BrowsersCapability;
interface SauceLabsBrowserCapability extends Partial<Pick<BaseConfig, 'specs'>> {
    browserVersion: string;
    platformName: string;
    'sauce:options'?: SauceLabsOptions;
}
export interface SauceLabsOptions {
    ['custom-data']?: Record<string, unknown>;
    build?: string;
    name?: string;
    passed?: boolean;
    screenResolution?: string;
    seleniumVersion?: string;
    tags?: string[];
    timeZone?: string;
}
interface SauceLabsChromeCapability extends SauceLabsBrowserCapability, Omit<ChromeCapability, 'browserName'> {
    browserName: 'googlechrome';
}
declare type SauceLabsFirefoxCapability = SauceLabsBrowserCapability & FirefoxCapability;
declare type SauceLabsSafariCapability = SauceLabsBrowserCapability & SafariCapability;
declare type SauceLabsEdgeCapability = SauceLabsBrowserCapability & EdgeCapability;
export declare type SauceLabsCapability = SauceLabsChromeCapability | SauceLabsFirefoxCapability | SauceLabsSafariCapability | SauceLabsEdgeCapability;
interface MochaFramework {
    framework: 'mocha';
    mochaOpts: {
        require?: string[];
        timeout?: number;
        ui: 'bdd' | 'tdd';
        checkLeaks?: boolean;
        asyncOnly?: boolean;
        bail?: boolean;
        allowUncaught?: boolean;
        reporter?: string;
        inlineDiffs?: boolean;
    };
}
interface JasmineFramework {
    framework: 'jasmine';
    jasmineNodeOpts: {
        defaultTimeoutInterval: number;
        grep: null;
        invertGrep: null;
        expectationResultHandler(passed: unknown, assertion: unknown): void;
    };
}
export declare type Framework = MochaFramework | JasmineFramework;
declare type Reporters = 'spec';
export declare type ReportersConfig = [Reporters, Record<string, unknown>];
interface BaseConfig {
    runner: 'local';
    hostname?: string;
    port?: number;
    path?: string;
    protocol?: 'http' | 'https';
    specs: string[];
    exclude: string[];
    maxInstances: number;
    logLevel: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
    outputDir?: string;
    baseUrl: string;
    bail: 0 | 1;
    waitforTimeout: number;
    connectionRetryCount: number;
    specFileRetries: number;
    reporters: (Reporters | ReportersConfig)[];
    filesToWatch?: string[];
    onPrepare?(config: WdioConfig, capabilities: WdioConfig['capabilities']): void;
    beforeSession?(config: WdioConfig, capabilities: WdioConfig['capabilities'], specs: WdioConfig['specs']): void;
    before?(config: WdioConfig, capabilities: WdioConfig['capabilities']): void;
    beforeSuite?(suite: object): void;
    beforeHook?(test: unknown, context: unknown): void;
    afterHook?(test: unknown, context: unknown, { error, result, duration, passed, retries }: any): void;
    beforeTest?(test: unknown, context: unknown): void;
    beforeCommand?(commandName: string, args: string[]): void;
    afterCommand?(commandName: string, args: string[], result: 0 | 1, error: Error): void;
    afterTest?(test: unknown, context: unknown, { error, result, duration, passed, retries }: any): void;
    afterSuite?(suite: object): void;
    after?(result: 0 | 1, capabilities: WdioConfig['capabilities'], specs: WdioConfig['specs']): void;
    afterSession?(config: WdioConfig, capabilities: WdioConfig['capabilities'], specs: WdioConfig['specs']): void;
    onComplete?(exitCode: 0 | 1, config: WdioConfig, capabilities: WdioConfig['capabilities'], results: object): void;
    onReload?(oldSessionId: string, newSessionId: string): void;
}
interface SeleniumArgsDrivers {
    version: string;
}
interface SeleniumArgs {
    drivers: Record<'chrome' | 'firefox', SeleniumArgsDrivers>;
}
interface SeleniumConfig extends BaseConfig {
    capabilities: Capability[];
    services: ['selenium-standalone'];
    seleniumLogs: 'logs';
    seleniumInstallArgs?: SeleniumArgs;
    seleniumArgs?: SeleniumArgs;
}
interface SauceLabsConfig extends BaseConfig {
    services: ['sauce'];
    user?: string;
    key?: string;
    region?: 'us' | 'eu';
    sauceConnect?: boolean;
    sauceConnectOpts: Record<'user' | 'accessKey', string>;
    capabilities: SauceLabsCapability[];
}
declare type Config = SeleniumConfig | SauceLabsConfig;
export declare type WdioConfig = Config & Framework;
export {};
//# sourceMappingURL=custom_wdio.d.ts.map