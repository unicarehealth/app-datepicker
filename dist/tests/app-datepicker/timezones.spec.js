import { DATEPICKER_NAME } from '../../constants.js';
import { APP_INDEX_URL } from '../constants.js';
import { deepStrictEqual, } from '../helpers/typed-assert.js';
import { getAllDateStrings } from '../timezones.js';
describe('timezones', () => {
    before(async () => {
        await browser.url(APP_INDEX_URL);
    });
    beforeEach(async () => {
        await browser.executeAsync(async (a, done) => {
            const el = document.createElement(a);
            el.locale = 'en-US';
            el.min = '2000-01-01';
            el.value = '2020-01-01';
            document.body.appendChild(el);
            await el.updateComplete;
            done();
        }, DATEPICKER_NAME);
    });
    afterEach(async () => {
        await browser.executeAsync((a, done) => {
            const el = document.body.querySelector(a);
            document.body.removeChild(el);
            done();
        }, DATEPICKER_NAME);
    });
    it(`takes snapshot`, async () => {
        const browserName = browser.capabilities.browserName;
        await browser.saveScreenshot(`./src/tests/snapshots/${DATEPICKER_NAME}/timezones-${browserName}.png`);
    });
    it(`resolves to the correct 'value' in different timezones`, async function timezoneTests() {
        this.timeout(90e3);
        const allDateStrings = getAllDateStrings();
        const results = [];
        const expected = allDateStrings.map(n => n[1].value);
        for (const n of allDateStrings) {
            const valueProp = await browser.executeAsync(async (a, b, done) => {
                const el = document.body.querySelector(a);
                el.value = b;
                await el.updateComplete;
                return done(el.value);
            }, DATEPICKER_NAME, n[1].date);
            results.push(valueProp);
        }
        deepStrictEqual(results, expected);
    });
});
