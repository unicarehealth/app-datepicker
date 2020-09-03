import { DATEPICKER_DIALOG_NAME, DATEPICKER_NAME } from '../../constants.js';
import '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import { deepStrictEqual, strictEqual, } from '../helpers/typed-assert.js';
describe(`${DATEPICKER_DIALOG_NAME}::events`, () => {
    before(async () => {
        await browser.url(APP_INDEX_URL);
    });
    it(`fires 'datepicker-value-updated' event (Enter, Space)`, async () => {
        const keys = [
            13,
            32,
        ];
        const results = [];
        for (const k of keys) {
            const result = await browser.executeAsync(async (a, b, c, done) => {
                const domTriggerKey = (root, keyCode) => {
                    const ev = new CustomEvent('keyup', { keyCode });
                    Object.defineProperty(ev, 'keyCode', { value: keyCode });
                    root.dispatchEvent(ev);
                };
                const n = document.createElement(a);
                n.locale = 'en-US';
                n.min = '2000-01-01';
                n.value = '2020-02-20';
                document.body.appendChild(n);
                await n.open();
                await n.updateComplete;
                const n2 = n.shadowRoot.querySelector(b);
                const n3 = n2.shadowRoot.querySelector('.calendars-container');
                domTriggerKey(n3, 37);
                const enteredValue = new Promise((yay) => {
                    let timer = -1;
                    n.addEventListener('datepicker-value-updated', function handler(ev) {
                        const { isKeypress, keyCode, value } = ev.detail;
                        const selectedValue = isKeypress && (keyCode === 13 || keyCode === 32) ? value : '';
                        clearTimeout(timer);
                        yay(selectedValue);
                        n.removeEventListener('datepicker-value-updated', handler);
                    });
                    timer = window.setTimeout(() => yay(''), 15e3);
                });
                domTriggerKey(n3, c);
                await n.updateComplete;
                document.body.removeChild(n);
                done((await enteredValue) === '2020-02-19');
            }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, k);
            results.push(result);
        }
        deepStrictEqual(results, [true, true]);
    });
    it(`fires 'datepicker-dialog-first-updated'`, async () => {
        const result = await browser.executeAsync(async (a, done) => {
            const n = document.createElement(a);
            const firstUpdated = new Promise((yay) => {
                let timer = -1;
                function handler() {
                    clearTimeout(timer);
                    yay(true);
                    n.removeEventListener('datepicker-dialog-first-updated', handler);
                }
                n.addEventListener('datepicker-dialog-first-updated', handler);
                timer = window.setTimeout(() => yay(false), 15e3);
            });
            document.body.appendChild(n);
            n.locale = 'en-US';
            await n.updateComplete;
            const firstUpdatedResult = await firstUpdated;
            document.body.removeChild(n);
            done(firstUpdatedResult);
        }, DATEPICKER_DIALOG_NAME);
        strictEqual(result, true);
    });
    it(`fires 'datepicker-dialog-opened'`, async () => {
        const result = await browser.executeAsync(async (a, done) => {
            const n = document.createElement(a);
            const dialogOpened = new Promise((yay) => {
                let timer = -1;
                function handler() {
                    clearTimeout(timer);
                    yay(true);
                    n.removeEventListener('datepicker-dialog-opened', handler);
                }
                n.addEventListener('datepicker-dialog-opened', handler);
                timer = window.setTimeout(() => yay(false), 15e3);
            });
            document.body.appendChild(n);
            n.locale = 'en-US';
            await n.open();
            await n.updateComplete;
            const dialogOpenedResult = await dialogOpened;
            document.body.removeChild(n);
            done(dialogOpenedResult);
        }, DATEPICKER_DIALOG_NAME);
        strictEqual(result, true);
    });
    it(`fires 'datepicker-dialog-closed'`, async () => {
        const result = await browser.executeAsync(async (a, done) => {
            const n = document.createElement(a);
            const dialogClosed = new Promise((yay) => {
                let timer = -1;
                function handler() {
                    clearTimeout(timer);
                    yay(true);
                    n.removeEventListener('datepicker-dialog-closed', handler);
                }
                n.addEventListener('datepicker-dialog-closed', handler);
                timer = window.setTimeout(() => yay(false), 15e3);
            });
            document.body.appendChild(n);
            n.locale = 'en-US';
            await n.open();
            await n.updateComplete;
            await n.close();
            await n.updateComplete;
            const dialogClosedResult = await dialogClosed;
            document.body.removeChild(n);
            done(dialogClosedResult);
        }, DATEPICKER_DIALOG_NAME);
        strictEqual(result, true);
    });
});
