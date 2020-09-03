import { DATEPICKER_DIALOG_NAME, DATEPICKER_NAME } from '../../constants.js';
import { APP_INDEX_URL } from '../constants.js';
import { cleanHtml } from '../helpers/clean-html.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { toSelector } from '../helpers/to-selector.js';
import { allStrictEqual, deepStrictEqual, strictEqual, } from '../helpers/typed-assert.js';
describe(`${DATEPICKER_DIALOG_NAME}::attributes`, () => {
    before(async () => {
        await browser.url(APP_INDEX_URL);
    });
    beforeEach(async () => {
        await browser.executeAsync(async (a, done) => {
            const el = document.createElement(a);
            document.body.appendChild(el);
            el.locale = 'en-US';
            el.min = '2000-01-01';
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
        await browser.saveScreenshot(`./src/tests/snapshots/${DATEPICKER_DIALOG_NAME}/attributes-0-${browserName}.png`);
        await browser.executeAsync(async (a, done) => {
            const el = document.body.querySelector(a);
            el.setAttribute('min', '2020-01-15');
            el.setAttribute('value', '2020-01-17');
            await el.updateComplete;
            done();
        }, DATEPICKER_DIALOG_NAME);
        await browser.saveScreenshot(`./src/tests/snapshots/${DATEPICKER_DIALOG_NAME}/attributes-1-${browserName}.png`);
    });
    it(`renders with initial attributes`, async () => {
        const values = await browser.executeAsync(async (a, b, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            done([
                n.getAttribute('firstdayofweek'),
                n2.getAttribute('firstdayofweek'),
                n.getAttribute('startview'),
                n2.getAttribute('startview'),
                n.getAttribute('weeknumbertype'),
                n2.getAttribute('weeknumbertype'),
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME);
        deepStrictEqual(values, [
            '0',
            '0',
            'calendar',
            'calendar',
            'first-4-day-week',
            'first-4-day-week',
        ]);
    });
    it(`renders with defined 'min'`, async () => {
        const expectedMin = '2000-01-01';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.setAttribute('min', c);
            await n.updateComplete;
            done([n.getAttribute('min'), n2.getAttribute('min')]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedMin);
        allStrictEqual(values, expectedMin);
    });
    it(`renders with defined 'max'`, async () => {
        const expectedMax = '2020-02-27';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.setAttribute('max', c);
            await n.updateComplete;
            done([n.getAttribute('max'), n2.getAttribute('max')]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedMax);
        allStrictEqual(values, expectedMax);
    });
    it(`renders with defined 'value'`, async () => {
        const expectedValue = '2020-02-20';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.setAttribute('value', c);
            await n.updateComplete;
            done([
                n.hasAttribute('value'),
                n2.hasAttribute('value'),
                n.value,
                n2.value,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedValue);
        deepStrictEqual(values, [true, false, expectedValue, expectedValue]);
    });
    it(`renders with defined 'startview'`, async () => {
        const expectedStartview = 'calendar';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.setAttribute('startview', c);
            await n.updateComplete;
            done([n.getAttribute('startview'), n2.getAttribute('startview')]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedStartview);
        allStrictEqual(values, expectedStartview);
    });
    it(`renders with defined 'firstdayofweek'`, async () => {
        const expectedFirstdayofweek = '1';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.setAttribute('firstdayofweek', c);
            await n.updateComplete;
            done([n.getAttribute('firstdayofweek'), n2.getAttribute('firstdayofweek')]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedFirstdayofweek);
        allStrictEqual(values, expectedFirstdayofweek);
    });
    it(`renders with defined 'showeeknumber'`, async () => {
        const values = await browser.executeAsync(async (a, b, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.setAttribute('showweeknumber', '');
            await n.updateComplete;
            done([n.hasAttribute('showweeknumber'), n2.hasAttribute('showweeknumber')]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME);
        allStrictEqual(values, true);
    });
    it(`renders with defined 'weeknumbertype'`, async () => {
        const expectedWeeknumbertype = 'first-4-day-week';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.setAttribute('weeknumbertype', c);
            await n.updateComplete;
            done([n.getAttribute('weeknumbertype'), n2.getAttribute('weeknumbertype')]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedWeeknumbertype);
        allStrictEqual(values, expectedWeeknumbertype);
    });
    it(`renders with defined 'landscape'`, async () => {
        const values = await browser.executeAsync(async (a, b, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.setAttribute('landscape', '');
            await n.updateComplete;
            done([n.hasAttribute('landscape'), n2.hasAttribute('landscape')]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME);
        allStrictEqual(values, true);
    });
    it(`renders with defined 'locale'`, async () => {
        const expectedLocale = 'ja-JP';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.setAttribute('locale', c);
            await n.updateComplete;
            done([
                n.getAttribute('locale'),
                n2.getAttribute('locale'),
                n.locale,
                n2.locale,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedLocale);
        deepStrictEqual(values, [expectedLocale, null, expectedLocale, expectedLocale]);
    });
    it(`renders with defined 'disableddays'`, async () => {
        const expectedDisableddays = '3,5';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.setAttribute('disableddays', c);
            await n.updateComplete;
            done([
                n.getAttribute('disableddays'),
                n2.getAttribute('disableddays'),
                n.disabledDays,
                n2.disabledDays,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedDisableddays);
        deepStrictEqual(values, [
            expectedDisableddays,
            null,
            expectedDisableddays,
            expectedDisableddays,
        ]);
    });
    it(`renders with defined 'disableddates'`, async () => {
        const expectedDisableddates = '2020-02-02,2020-02-15';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            n.setAttribute('disableddates', c);
            await n.updateComplete;
            const n2 = n.shadowRoot.querySelector(b);
            done([
                n.getAttribute('disableddates'),
                n2.getAttribute('disableddates'),
                n.disabledDates,
                n2.disabledDates,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedDisableddates);
        deepStrictEqual(values, [
            expectedDisableddates,
            null,
            expectedDisableddates,
            expectedDisableddates,
        ]);
    });
    it(`renders with defined 'dragratio'`, async () => {
        const dragRatio = .5;
        const [prop, prop2, attr,] = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.setAttribute('dragratio', `${c}`);
            await n.updateComplete;
            done([
                n.dragRatio,
                n2.dragRatio,
                n.getAttribute('dragratio'),
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, dragRatio);
        allStrictEqual([prop, prop2], dragRatio);
        strictEqual(attr, `${dragRatio}`);
    });
    it(`renders with defined 'weeklabel'`, async () => {
        const expectedWeeklabel = '周数';
        const values = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            const initialLabel = n.weekLabel;
            n.setAttribute('weeklabel', c);
            await n.updateComplete;
            done([
                initialLabel,
                n.getAttribute('weeklabel'),
                n2.getAttribute('weeklabel'),
                n.weekLabel,
                n2.weekLabel,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedWeeklabel);
        deepStrictEqual(values, [
            'Wk',
            expectedWeeklabel,
            null,
            expectedWeeklabel,
            expectedWeeklabel,
        ]);
    });
    it(`renders with defined 'clearlabel'`, async () => {
        const expectedClearLabel = '重設';
        const [initialClearLabel, ...others] = await browser.executeAsync(async (a, b, c, done) => {
            var _a;
            const n = document.body.querySelector(a);
            const root = n.shadowRoot;
            const initialLabel = n.clearLabel;
            n.setAttribute('clearlabel', c);
            await n.updateComplete;
            const clearButton = root.querySelector(b);
            done([
                initialLabel,
                n.getAttribute('clearlabel'),
                n.clearLabel,
                (_a = clearButton === null || clearButton === void 0 ? void 0 : clearButton.textContent) !== null && _a !== void 0 ? _a : '',
            ]);
        }, DATEPICKER_DIALOG_NAME, `[part="clear"]`, expectedClearLabel);
        strictEqual(initialClearLabel, 'clear');
        allStrictEqual(others, expectedClearLabel);
    });
    it(`renders with defined 'dismisslabel'`, async () => {
        const expectedDismissLabel = '取消';
        const [initialDismissLabel, ...others] = await browser.executeAsync(async (a, b, c, done) => {
            var _a;
            const n = document.body.querySelector(a);
            const root = n.shadowRoot;
            const initialLabel = n.dismissLabel;
            n.setAttribute('dismisslabel', c);
            await n.updateComplete;
            const clearButton = root.querySelector(b);
            done([
                initialLabel,
                n.getAttribute('dismisslabel'),
                n.dismissLabel,
                (_a = clearButton === null || clearButton === void 0 ? void 0 : clearButton.textContent) !== null && _a !== void 0 ? _a : '',
            ]);
        }, DATEPICKER_DIALOG_NAME, `[part="dismiss"]`, expectedDismissLabel);
        strictEqual(initialDismissLabel, 'cancel');
        allStrictEqual(others, expectedDismissLabel);
    });
    it(`renders with defined 'confirmlabel'`, async () => {
        const expectedConfirmLabel = '取消';
        const [initialConfirmLabel, ...others] = await browser.executeAsync(async (a, b, c, done) => {
            var _a;
            const n = document.body.querySelector(a);
            const root = n.shadowRoot;
            const initialLabel = n.confirmLabel;
            n.setAttribute('confirmlabel', c);
            await n.updateComplete;
            const clearButton = root.querySelector(b);
            done([
                initialLabel,
                n.getAttribute('confirmlabel'),
                n.confirmLabel,
                (_a = clearButton === null || clearButton === void 0 ? void 0 : clearButton.textContent) !== null && _a !== void 0 ? _a : '',
            ]);
        }, DATEPICKER_DIALOG_NAME, `[part="confirm"]`, expectedConfirmLabel);
        strictEqual(initialConfirmLabel, 'set');
        allStrictEqual(others, expectedConfirmLabel);
    });
    it(`renders with defined 'nofocustrap'`, async () => {
        const expectedNoFocusTap = true;
        const [initialProp, attr, prop, activeElementContent,] = await browser.executeAsync(async (a, b, c, done) => {
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
            n.setAttribute('nofocustrap', c);
            await n.updateComplete;
            const confirmButton = n.querySelector(b);
            confirmButton === null || confirmButton === void 0 ? void 0 : confirmButton.focus();
            const tabEvent = new CustomEvent('keyup');
            Object.defineProperty(tabEvent, 'keyCode', { value: 9 });
            n.dispatchEvent(tabEvent);
            await n.updateComplete;
            done([
                initialNoFocusTrap,
                n.hasAttribute('nofocustrap'),
                n.noFocusTrap,
                (_b = (_a = getDeepActiveElement()) === null || _a === void 0 ? void 0 : _a.outerHTML) !== null && _b !== void 0 ? _b : '',
            ]);
        }, DATEPICKER_DIALOG_NAME, `[part="confirm"]`, expectedNoFocusTap);
        strictEqual(initialProp, false);
        allStrictEqual([attr, prop], expectedNoFocusTap);
        strictEqual(cleanHtml(activeElementContent), prettyHtml `<button class="btn__year-selector" data-view="yearList">2020</button>`);
    });
    it(`renders with defined 'alwaysresetvalue'`, async () => {
        const expectedAlwaysResetValue = true;
        const [initialProp, attr, prop, value, value2, focusedDateContent,] = await browser.executeAsync(async (a, b, c, d, done) => {
            var _a;
            const n = document.body.querySelector(a);
            const root = n.shadowRoot;
            const n2 = root.querySelector(b);
            const initialAlwaysResetValue = n.alwaysResetValue;
            n.min = '2000-01-01';
            n.value = '2020-02-02';
            n.setAttribute('alwaysresetvalue', d);
            n2.value = '2020-02-20';
            await n2.updateComplete;
            await n.updateComplete;
            await n.close();
            await n.open();
            await n.updateComplete;
            const focusedDate = n2.shadowRoot.querySelector(c);
            done([
                initialAlwaysResetValue,
                n.hasAttribute('alwaysresetvalue'),
                n.alwaysResetValue,
                n.value,
                n2.value,
                (_a = focusedDate === null || focusedDate === void 0 ? void 0 : focusedDate.outerHTML) !== null && _a !== void 0 ? _a : '<nil>',
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, toSelector('.day--focused'), expectedAlwaysResetValue);
        strictEqual(initialProp, false);
        allStrictEqual([prop, attr], expectedAlwaysResetValue);
        allStrictEqual([value, value2], '2020-02-02');
        strictEqual(cleanHtml(focusedDateContent), prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 2, 2020" aria-selected="true">
      <div class="calendar-day">2</div>
    </td>`);
    });
    it(`renders with different 'firstdayofweek' and 'disableddays'`, async () => {
        const expectedFirstdayofweek = '1';
        const expectedDisableddays = '3,5';
        const values = await browser.executeAsync(async (a, b, c, d, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n.setAttribute('firstdayofweek', c);
            n.setAttribute('disableddays', d);
            await n.updateComplete;
            done([
                n.getAttribute('firstdayofweek'),
                n2.getAttribute('firstdayofweek'),
                n.getAttribute('disableddays'),
                n2.getAttribute('disableddays'),
                n.firstDayOfWeek,
                n2.firstDayOfWeek,
                n.disabledDays,
                n2.disabledDays,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, expectedFirstdayofweek, expectedDisableddays);
        deepStrictEqual(values, [
            expectedFirstdayofweek,
            expectedFirstdayofweek,
            expectedDisableddays,
            null,
            Number(expectedFirstdayofweek),
            Number(expectedFirstdayofweek),
            expectedDisableddays,
            expectedDisableddays,
        ]);
    });
});
