import { DATEPICKER_NAME } from '../../constants.js';
import '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import { toSelector } from '../helpers/to-selector.js';
import { allStrictEqual, deepStrictEqual, strictEqual, } from '../helpers/typed-assert.js';
describe('events', () => {
    before(async () => {
        await browser.url(APP_INDEX_URL);
    });
    it(`fires 'datepicker-first-updated'`, async () => {
        const resultValues = [];
        const resultContents = [];
        let todayDateValue = '';
        for (const inlineVal of [true, false]) {
            const [val, todayVal, content] = await browser.executeAsync(async (a, b, done) => {
                const n = document.createElement(a);
                const now = new Date();
                const today = [`${now.getFullYear()}`]
                    .concat([1 + now.getMonth(), now.getDate()].map(o => `0${o}`.slice(-2)))
                    .join('-');
                const firstUpdated = new Promise((yay) => {
                    let timer = -1;
                    n.addEventListener('datepicker-first-updated', function handler(ev) {
                        const { firstFocusableElement, value } = ev.detail;
                        const elementTag = firstFocusableElement.localName;
                        const selectorCls = Array.from(firstFocusableElement.classList).find(o => o.indexOf('selector') >= 0);
                        clearTimeout(timer);
                        yay([
                            value,
                            today,
                            `${elementTag}${selectorCls ? `.${selectorCls}` : ''}`,
                        ]);
                        n.removeEventListener('datepicker-first-updated', handler);
                    });
                    timer = window.setTimeout(() => yay(['', '', '']), 15e3);
                });
                n.locale = 'en-US';
                n.min = '2000-01-01';
                n.inline = b;
                document.body.appendChild(n);
                await n.updateComplete;
                const firstUpdatedResult = await firstUpdated;
                document.body.removeChild(n);
                done(firstUpdatedResult);
            }, DATEPICKER_NAME, inlineVal);
            resultValues.push(val);
            resultContents.push(content);
            todayDateValue = todayVal;
        }
        allStrictEqual(resultValues, todayDateValue);
        deepStrictEqual(resultContents, [
            `button.btn__month-selector`,
            `button.btn__year-selector`,
        ]);
    });
    it(`fires 'datepicker-value-selected' event (Enter, Space)`, async () => {
        const keys = [
            13,
            32,
        ];
        const results = [];
        for (const k of keys) {
            const result = await browser.executeAsync(async (a, b, done) => {
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
                await n.updateComplete;
                const n2 = n.shadowRoot.querySelector('.calendars-container');
                domTriggerKey(n2, 37);
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
                domTriggerKey(n2, b);
                await n.updateComplete;
                document.body.removeChild(n);
                done((await enteredValue) === '2020-02-19');
            }, DATEPICKER_NAME, k);
            results.push(result);
        }
        deepStrictEqual(results, [true, true]);
    });
    it(`fires 'datepicker-value-updated' when clicks to select new date`, async () => {
        const [prop, isKeypressVal, selectedVal,] = await browser.executeAsync(async (a, b, done) => {
            var _a;
            const n = document.createElement(a);
            n.locale = 'en-US';
            n.min = '2000-01-01';
            n.value = '2020-02-02';
            document.body.appendChild(n);
            await n.updateComplete;
            const valueUpdated = new Promise((yay) => {
                let timer = -1;
                n.addEventListener('datepicker-value-updated', function handler(ev) {
                    clearTimeout(timer);
                    yay(ev.detail);
                    n.removeEventListener('datepicker-value-updated', handler);
                });
                timer = window.setTimeout(() => yay(null), 15e3);
            });
            const n2 = n.shadowRoot.querySelector(b);
            if (n2 instanceof HTMLButtonElement || n2.tagName === 'MWC-BUTTON') {
                n2.click();
            }
            else {
                ['touchstart', 'touchend'].forEach((o) => {
                    n2.dispatchEvent(new CustomEvent(o, { bubbles: true, composed: true }));
                });
            }
            await n.updateComplete;
            const { isKeypress, value } = (_a = (await valueUpdated)) !== null && _a !== void 0 ? _a : {};
            document.body.removeChild(n);
            done([
                n.value,
                isKeypress,
                value,
            ]);
        }, DATEPICKER_NAME, toSelector(`.full-calendar__day[aria-label="Feb 13, 2020"]`));
        allStrictEqual([prop, selectedVal], '2020-02-13');
        strictEqual(isKeypressVal, false);
    });
});
