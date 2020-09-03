import { DATEPICKER_DIALOG_NAME, DATEPICKER_NAME } from '../../constants.js';
import { APP_INDEX_URL } from '../constants.js';
import { cleanHtml } from '../helpers/clean-html.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { toSelector } from '../helpers/to-selector.js';
import { allStrictEqual, deepStrictEqual, strictEqual, } from '../helpers/typed-assert.js';
describe(`${DATEPICKER_DIALOG_NAME}::properties`, () => {
    before(async () => {
        await browser.url(APP_INDEX_URL);
    });
    beforeEach(async () => {
        await browser.executeAsync(async (a, done) => {
            const el = document.createElement(a);
            document.body.appendChild(el);
            el.locale = 'en-US';
            await el.open();
            await el.updateComplete;
            done();
        }, DATEPICKER_DIALOG_NAME);
    });
    afterEach(async () => {
        await browser.executeAsync((a, done) => {
            const el = document.body.querySelector(a);
            if (el)
                document.body.removeChild(el);
            done();
        }, DATEPICKER_DIALOG_NAME);
    });
    it(`takes snapshot`, async () => {
        const browserName = browser.capabilities.browserName;
        await browser.saveScreenshot(`./src/tests/snapshots/${DATEPICKER_DIALOG_NAME}/properties-0-${browserName}.png`);
        await browser.executeAsync(async (a, done) => {
            const el = document.body.querySelector(a);
            el.min = '2020-01-15';
            el.value = '2020-01-17';
            await el.updateComplete;
            done();
        }, DATEPICKER_DIALOG_NAME);
        await browser.saveScreenshot(`./src/tests/snapshots/${DATEPICKER_DIALOG_NAME}/properties-1-${browserName}.png`);
    });
    it(`renders with initial properties`, async () => {
        const values = await browser.executeAsync(async (a, b, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            done([
                n.firstDayOfWeek,
                n2.firstDayOfWeek,
                n.weekNumberType,
                n2.weekNumberType,
                n.startView,
                n2.startView,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME);
        deepStrictEqual(values, [
            0, 0,
            'first-4-day-week', 'first-4-day-week',
            'calendar', 'calendar',
        ]);
    });
    it(`renders with defined 'min'`, async () => {
        const expectedMin = '2000-01-01';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.min = c;
            await n.updateComplete;
            done([
                n.min,
                n2.min,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedMin);
        allStrictEqual(values, expectedMin);
    });
    it(`renders with defined 'max'`, async () => {
        const expectedMax = '2020-02-27';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.min = '2000-01-01';
            n.max = c;
            await n.updateComplete;
            done([
                n.max,
                n2.max,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedMax);
        allStrictEqual(values, expectedMax);
    });
    it(`renders with defined 'value'`, async () => {
        const expectedValue = '2020-02-20';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.min = '2000-01-01';
            n.max = '2020-12-31';
            n.value = c;
            await n.updateComplete;
            done([
                n.value,
                n2.value,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedValue);
        allStrictEqual(values, expectedValue);
    });
    it(`renders with defined 'startView'`, async () => {
        const expectedStartView = 'calendar';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.startView = c;
            await n.updateComplete;
            done([
                n.startView,
                n2.startView,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedStartView);
        allStrictEqual(values, expectedStartView);
    });
    it(`renders with defined 'firstDayOfWeek'`, async () => {
        const expectedFirstDayOfWeek = 1;
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.firstDayOfWeek = c;
            await n.updateComplete;
            done([
                n.firstDayOfWeek,
                n2.firstDayOfWeek,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedFirstDayOfWeek);
        allStrictEqual(values, expectedFirstDayOfWeek);
    });
    it(`renders with defined 'showWeekNumber'`, async () => {
        const expectedShowWeekNumber = true;
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.showWeekNumber = c;
            await n.updateComplete;
            done([
                n.showWeekNumber,
                n2.showWeekNumber,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedShowWeekNumber);
        allStrictEqual(values, expectedShowWeekNumber);
    });
    it(`renders with defined 'weekNumberType'`, async () => {
        const expectedWeekNumberType = 'first-4-day-week';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.weekNumberType = c;
            await n.updateComplete;
            done([
                n.weekNumberType,
                n2.weekNumberType,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedWeekNumberType);
        allStrictEqual(values, expectedWeekNumberType);
    });
    it(`renders with defined 'landscape'`, async () => {
        const expectedLandscape = true;
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.landscape = c;
            await n.updateComplete;
            done([
                n.landscape,
                n2.landscape,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedLandscape);
        allStrictEqual(values, expectedLandscape);
    });
    it(`renders with defined 'locale'`, async () => {
        const expectedLocale = 'ja-JP';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.locale = c;
            await n.updateComplete;
            done([
                n.locale,
                n2.locale,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedLocale);
        allStrictEqual(values, expectedLocale);
    });
    it(`renders with defined 'disabledDays'`, async () => {
        const expectedDisabledDays = '3,5';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.disabledDays = c;
            await n.updateComplete;
            done([
                n.disabledDays,
                n2.disabledDays,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedDisabledDays);
        allStrictEqual(values, expectedDisabledDays);
    });
    it(`renders with defined 'disabledDates'`, async () => {
        const expectedDisabledDates = '2020-02-02,2020-02-15';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.disabledDates = c;
            await n.updateComplete;
            done([
                n.disabledDates,
                n2.disabledDates,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedDisabledDates);
        allStrictEqual(values, expectedDisabledDates);
    });
    it(`renders with defined 'dragRatio'`, async () => {
        const dragRatio = .5;
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.querySelector(a);
            n.dragRatio = c;
            await n.updateComplete;
            const n2 = n.shadowRoot.querySelector(b);
            done([
                n.dragRatio,
                n2.dragRatio,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, dragRatio);
        allStrictEqual(values, dragRatio);
    });
    it(`renders with defined 'weekLabel'`, async () => {
        const expectedWeekLabel = '周数';
        const [initialLabel, ...others] = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            const iniialWeekLabel = n.weekLabel;
            n.weekLabel = c;
            await n.updateComplete;
            done([
                iniialWeekLabel,
                n.weekLabel,
                n2.weekLabel,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedWeekLabel);
        strictEqual(initialLabel, 'Wk');
        allStrictEqual(others, expectedWeekLabel);
    });
    it(`renders with defined 'clearLabel'`, async () => {
        const expectedClearLabel = '重設';
        const [initialClearLabel, ...others] = await browser.executeAsync(async (a, b, c, done) => {
            var _a;
            const n = document.body.querySelector(a);
            const root = n.shadowRoot;
            const initialLabel = n.clearLabel;
            n.clearLabel = c;
            await n.updateComplete;
            const clearButton = root.querySelector(b);
            done([
                initialLabel,
                n.clearLabel,
                (_a = clearButton === null || clearButton === void 0 ? void 0 : clearButton.textContent) !== null && _a !== void 0 ? _a : '',
            ]);
        }, DATEPICKER_DIALOG_NAME, `[part="clear"]`, expectedClearLabel);
        strictEqual(initialClearLabel, 'clear');
        allStrictEqual(others, expectedClearLabel);
    });
    it(`renders with defined 'dismissLabel'`, async () => {
        const expectedDismissLabel = '取消';
        const [initialDismissLabel, ...others] = await browser.executeAsync(async (a, b, c, done) => {
            var _a;
            const n = document.body.querySelector(a);
            const root = n.shadowRoot;
            const initialLabel = n.dismissLabel;
            n.dismissLabel = c;
            await n.updateComplete;
            const clearButton = root.querySelector(b);
            done([
                initialLabel,
                n.dismissLabel,
                (_a = clearButton === null || clearButton === void 0 ? void 0 : clearButton.textContent) !== null && _a !== void 0 ? _a : '',
            ]);
        }, DATEPICKER_DIALOG_NAME, `[part="dismiss"]`, expectedDismissLabel);
        strictEqual(initialDismissLabel, 'cancel');
        allStrictEqual(others, expectedDismissLabel);
    });
    it(`renders with defined 'confirmLabel'`, async () => {
        const expectedConfirmLabel = '取消';
        const [initialConfirmLabel, ...others] = await browser.executeAsync(async (a, b, c, done) => {
            var _a;
            const n = document.body.querySelector(a);
            const root = n.shadowRoot;
            const initialLabel = n.confirmLabel;
            n.confirmLabel = c;
            await n.updateComplete;
            const clearButton = root.querySelector(b);
            done([
                initialLabel,
                n.confirmLabel,
                (_a = clearButton === null || clearButton === void 0 ? void 0 : clearButton.textContent) !== null && _a !== void 0 ? _a : '',
            ]);
        }, DATEPICKER_DIALOG_NAME, `[part="confirm"]`, expectedConfirmLabel);
        strictEqual(initialConfirmLabel, 'set');
        allStrictEqual(others, expectedConfirmLabel);
    });
    it(`renders with defined 'noFocusTrap'`, async () => {
        const expectedNoFocusTap = true;
        const [initialProp, prop, activeElementContent,] = await browser.executeAsync(async (a, b, c, done) => {
            var _a, _b;
            const getDeepActiveElement = () => {
                let $n = document.activeElement;
                while ($n === null || $n === void 0 ? void 0 : $n.shadowRoot) {
                    $n = $n.shadowRoot.activeElement;
                }
                return $n;
            };
            const n = document.body.querySelector(a);
            const initialNoFocusTrap = n.noFocusTrap;
            n.min = '2000-01-01';
            n.value = '2020-02-02';
            n.noFocusTrap = c;
            await n.updateComplete;
            const confirmButton = n.querySelector(b);
            confirmButton === null || confirmButton === void 0 ? void 0 : confirmButton.focus();
            const tabEvent = new CustomEvent('keyup');
            Object.defineProperty(tabEvent, 'keyCode', { value: 9 });
            n.dispatchEvent(tabEvent);
            await n.updateComplete;
            done([
                initialNoFocusTrap,
                n.noFocusTrap,
                (_b = (_a = getDeepActiveElement()) === null || _a === void 0 ? void 0 : _a.outerHTML) !== null && _b !== void 0 ? _b : '',
            ]);
        }, DATEPICKER_DIALOG_NAME, `[part="confirm"]`, expectedNoFocusTap);
        strictEqual(initialProp, false);
        strictEqual(prop, expectedNoFocusTap);
        strictEqual(cleanHtml(activeElementContent), prettyHtml `<button class="btn__year-selector" data-view="yearList">2020</button>`);
    });
    it(`renders with defined 'alwaysResetValue'`, async () => {
        const expectedAlwaysResetValue = true;
        const [initialProp, prop, value, value2, focusedDateContent,] = await browser.executeAsync(async (a, b, c, d, done) => {
            var _a;
            const n = document.body.querySelector(a);
            const root = n.shadowRoot;
            const n2 = root.querySelector(b);
            const initialAlwaysResetValue = n.alwaysResetValue;
            n.min = '2000-01-01';
            n.value = '2020-02-02';
            n.alwaysResetValue = d;
            n2.value = '2020-02-20';
            await n2.updateComplete;
            await n.updateComplete;
            await n.close();
            await n.open();
            await n.updateComplete;
            const focusedDate = n2.shadowRoot.querySelector(c);
            done([
                initialAlwaysResetValue,
                n.alwaysResetValue,
                n.value,
                n2.value,
                (_a = focusedDate === null || focusedDate === void 0 ? void 0 : focusedDate.outerHTML) !== null && _a !== void 0 ? _a : '<nil>',
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, toSelector('.day--focused'), expectedAlwaysResetValue);
        strictEqual(initialProp, false);
        strictEqual(prop, expectedAlwaysResetValue);
        allStrictEqual([value, value2], '2020-02-02');
        strictEqual(cleanHtml(focusedDateContent), prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 2, 2020" aria-selected="true">
      <div class="calendar-day">2</div>
    </td>`);
    });
    it(`renders with different 'firstDayOfWeek' and 'disabledDays'`, async () => {
        const expectedFirstDayOfWeek = 1;
        const expectedDisabledDays = '3,5';
        const values = await browser.executeAsync(async (a, b, c, d, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.firstDayOfWeek = c;
            n.disabledDays = d;
            await n.updateComplete;
            done([
                n.firstDayOfWeek,
                n2.firstDayOfWeek,
                n.disabledDays,
                n2.disabledDays,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedFirstDayOfWeek, expectedDisabledDays);
        deepStrictEqual(values, [
            expectedFirstDayOfWeek,
            expectedFirstDayOfWeek,
            expectedDisabledDays,
            expectedDisabledDays,
        ]);
    });
});
