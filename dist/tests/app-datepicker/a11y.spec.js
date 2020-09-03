import { DATEPICKER_NAME } from '../../constants.js';
import { APP_INDEX_URL } from '../constants.js';
import { deepStrictEqual } from '../helpers/typed-assert.js';
describe('a11y', () => {
    const toError = (result) => {
        if ((result === null || result === void 0 ? void 0 : result.type) === 'success')
            return '';
        const { message, name, stack } = (result !== null && result !== void 0 ? result : {});
        const err = new Error(message);
        if (name)
            err.name = name;
        if (stack)
            err.stack = stack;
        return err;
    };
    before(async () => {
        await browser.url(APP_INDEX_URL);
    });
    beforeEach(async () => {
        await browser.executeAsync(async (a, done) => {
            const el = document.createElement(a);
            document.body.appendChild(el);
            el.locale = 'en-US';
            await el.updateComplete;
            done();
        }, DATEPICKER_NAME);
    });
    afterEach(async () => {
        await browser.executeAsync(async (a, done) => {
            const el = document.body.querySelector(a);
            if (el)
                document.body.removeChild(el);
            done();
        }, DATEPICKER_NAME);
    });
    it(`is accessible`, async () => {
        var _a;
        const resultsTasks = [
            'calendar',
            'yearList',
        ].map(async (startView) => {
            const report = await browser.executeAsync(async (a, b, done) => {
                try {
                    const el = document.body.querySelector(a);
                    el.startView = b;
                    await el.updateComplete;
                    await window.axeReport(el);
                    done({ type: 'success' });
                }
                catch (e) {
                    done({
                        type: 'error',
                        name: e.name,
                        message: e.message,
                        stack: e.stack,
                    });
                }
            }, DATEPICKER_NAME, startView);
            return report;
        });
        const results = await Promise.all(resultsTasks);
        deepStrictEqual((results).every(n => n.type === 'success'), true, toError((_a = results.find(n => n.type === 'error')) !== null && _a !== void 0 ? _a : {
            type: 'error',
            message: 'Test failed with unknown accessibility error',
            name: 'error',
            stack: '',
        }));
    });
});
