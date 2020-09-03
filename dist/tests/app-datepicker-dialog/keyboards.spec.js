import { DATEPICKER_DIALOG_NAME, DATEPICKER_NAME } from '../../constants.js';
import '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import { cleanHtml } from '../helpers/clean-html.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { toSelector } from '../helpers/to-selector.js';
import { allStrictEqual, deepStrictEqual, ok, strictEqual, } from '../helpers/typed-assert.js';
describe(`${DATEPICKER_DIALOG_NAME}::keyboards`, () => {
    const focusElement = async (selector, inDialog = false) => {
        return browser.executeAsync(async (a, b, c, d, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            const n3 = (d ? n : n2).shadowRoot.querySelector(c);
            n3.focus();
            await n.updateComplete;
            await new Promise(y => setTimeout(() => y(n3.focus())));
            await n.updateComplete;
            done();
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, selector, inDialog);
    };
    const tapElements = async (selectors, keys) => {
        for (const s of selectors) {
            await focusElement(s);
            await browser.keys(keys);
        }
    };
    before(async () => {
        await browser.url(APP_INDEX_URL);
    });
    beforeEach(async () => {
        await browser.executeAsync(async (a, done) => {
            const el = document.createElement(a);
            el.locale = 'en-US';
            el.min = '2000-01-01';
            el.value = '2020-02-20';
            document.body.appendChild(el);
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
    it(`switches to year list view`, async () => {
        await tapElements(['.btn__year-selector'], ['Space']);
        const hasYearListView = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            const yearListView = n2.shadowRoot.querySelector(c);
            done(yearListView != null);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, '.datepicker-body__year-list-view');
        ok(hasYearListView);
    });
    it(`switches to calendar view`, async () => {
        await browser.executeAsync(async (a, done) => {
            const n = document.body.querySelector(a);
            n.startView = 'yearList';
            await n.updateComplete;
            done();
        }, DATEPICKER_DIALOG_NAME);
        await tapElements(['.btn__calendar-selector'], ['Space']);
        const hasCalendarView = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            const yearListView = n2.shadowRoot.querySelector(c);
            done(yearListView != null);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, '.datepicker-body__calendar-view');
        ok(hasCalendarView);
    });
    it(`focuses date after navigating away when switching to calendar view`, async () => {
        await tapElements([
            `.btn__month-selector[aria-label="Next month"]`,
            `.btn__year-selector`,
        ], ['Space']);
        const hasYearListView = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            const yearListView = n2.shadowRoot.querySelector(c);
            done(yearListView != null);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, '.datepicker-body__year-list-view');
        await tapElements([`.btn__calendar-selector`], ['Space']);
        const [hasCalendarView, focusedDateContent,] = await browser.executeAsync(async (a, b, c, d, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            const root = n2.shadowRoot;
            const yearListView = root.querySelector(c);
            const focusedDate = root.querySelector(d);
            done([
                yearListView != null,
                focusedDate.outerHTML,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, '.datepicker-body__calendar-view', toSelector('.day--focused'));
        allStrictEqual([hasCalendarView, hasYearListView], true);
        strictEqual(cleanHtml(focusedDateContent), prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 20, 2020" aria-selected="true">
      <div class="calendar-day">20</div>
    </td>
    `);
    });
    it(`switches back to calendar view when new year is selected`, async () => {
        const [prop, prop2,] = await browser.executeAsync(async (a, b, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            done([
                n.value,
                n2.value,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME);
        await tapElements([
            '.btn__year-selector',
            [
                `.year-list-view__list-item.year--selected`,
                `+ .year-list-view__list-item`,
                `+ .year-list-view__list-item`,
            ].join(' '),
        ], ['Space']);
        const [prop3, prop4, yearSelectorButtonContent, calendarLabelContent, calendarDaysContents,] = await browser.executeAsync(async (a, b, c, d, e, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            const root = n2.shadowRoot;
            const yearSelectorButton = root.querySelector(c);
            const calendarLabel = root.querySelector(d);
            const calendarDays = Array.from(root.querySelectorAll(e), o => o.textContent);
            done([
                n.value,
                n2.value,
                yearSelectorButton.outerHTML,
                calendarLabel.outerHTML,
                calendarDays,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, '.btn__year-selector', toSelector('.calendar-label'), toSelector('.full-calendar__day'));
        allStrictEqual([prop, prop2, prop3], '2020-02-20');
        strictEqual(prop4, '2022-02-20');
        strictEqual(cleanHtml(yearSelectorButtonContent), prettyHtml `
    <button class="btn__year-selector" data-view="yearList">2022</button>
    `);
        strictEqual(cleanHtml(calendarLabelContent), prettyHtml `
    <div class="calendar-label">February 2022</div>
    `);
        deepStrictEqual(calendarDaysContents.map(n => cleanHtml(n.trim())), [
            '', '', 1, 2, 3, 4, 5,
            6, 7, 8, 9, 10, 11, 12,
            13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26,
            27, 28, '', '', '', '', '',
            '', '', '', '', '', '', '',
        ].map(String));
    });
    it(`closes dialog when dismiss button is tapped`, async () => {
        await focusElement(`.actions-container > mwc-button[dialog-dismiss]`, true);
        await browser.keys(['Space']);
        await (await $(DATEPICKER_DIALOG_NAME)).waitForDisplayed(undefined, true);
        const [cssDisplay, ariaHiddenAttr,] = await browser.executeAsync(async (a, done) => {
            const n = document.body.querySelector(a);
            await n.updateComplete;
            done([
                getComputedStyle(n).display,
                n.getAttribute('aria-hidden'),
            ]);
        }, DATEPICKER_DIALOG_NAME);
        strictEqual(cssDisplay, 'none');
        strictEqual(ariaHiddenAttr, 'true');
    });
    it(`closes dialog with new focused date when confirm button is tapped`, async () => {
        const [prop, prop2, focusedDateContent,] = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            n2.value = '2020-02-13';
            await n2.updateComplete;
            const focusedDate = n2.shadowRoot.querySelector(c);
            done([
                n.value,
                n2.value,
                focusedDate.outerHTML,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, toSelector('.day--focused'));
        await focusElement(`.actions-container > mwc-button[dialog-confirm]`, true);
        await browser.keys(['Space']);
        await (await $(DATEPICKER_DIALOG_NAME)).waitForDisplayed(undefined, true);
        const [prop3, cssDisplay, ariaHiddenAttr,] = await browser.executeAsync(async (a, done) => {
            const n = document.body.querySelector(a);
            await n.updateComplete;
            done([
                n.value,
                getComputedStyle(n).display,
                n.getAttribute('aria-hidden'),
            ]);
        }, DATEPICKER_DIALOG_NAME);
        strictEqual(prop, '2020-02-20');
        allStrictEqual([prop2, prop3], '2020-02-13');
        strictEqual(cssDisplay, 'none');
        strictEqual(ariaHiddenAttr, 'true');
        strictEqual(cleanHtml(focusedDateContent), prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 13, 2020" aria-selected="true">
      <div class="calendar-day">13</div>
    </td>
    `);
    });
    it(`reset value when clear button is tapped`, async () => {
        const [initialVal, todayValue,] = await browser.executeAsync(async (a, b, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            const padStart = (v) => `0${v}`.slice(-2);
            const today = new Date();
            const fy = today.getFullYear();
            const m = today.getMonth();
            const d = today.getDate();
            const todayVal = [`${fy}`].concat([1 + m, d].map(padStart)).join('-');
            n.min = `${fy - 10}-01-01`;
            n2.value = `${fy - 1}-01-01`;
            n.max = `${fy + 10}-01-01`;
            await n2.updateComplete;
            await n.updateComplete;
            done([n2.value, todayVal]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME);
        await focusElement('mwc-button.clear', true);
        await browser.keys(['Space']);
        const prop = await browser.executeAsync(async (a, b, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            done(n2.value);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME);
        strictEqual(initialVal, `${Number(todayValue.slice(0, 4)) - 1}-01-01`);
        strictEqual(prop, todayValue);
    });
    const focusCalendarsContainer = async () => {
        return await browser.executeAsync(async (a, b, c, done) => {
            var _a;
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            const n3 = n2.shadowRoot.querySelector(c);
            n3.focus();
            await n.updateComplete;
            await new Promise(y => setTimeout(() => y(n3.focus())));
            await n.updateComplete;
            let activeElement = document.activeElement;
            while (activeElement === null || activeElement === void 0 ? void 0 : activeElement.shadowRoot) {
                activeElement = activeElement.shadowRoot.activeElement;
            }
            done(`.${Array.from((_a = activeElement === null || activeElement === void 0 ? void 0 : activeElement.classList.values()) !== null && _a !== void 0 ? _a : []).join('.')}`);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, '.calendars-container');
    };
    const browserKeys = async (keyCode, altKey = false) => {
        await focusCalendarsContainer();
        return browser.executeAsync(async (a, b, c, d, e, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            const n3 = n2.shadowRoot.querySelector(c);
            const opt = { keyCode: d, altKey: e };
            const ev = new CustomEvent('keyup', opt);
            Object.keys(opt).forEach((o) => {
                Object.defineProperty(ev, o, { value: opt[o] });
            });
            n3.dispatchEvent(ev);
            done();
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, '.calendars-container', keyCode, altKey);
    };
    const getValuesAfterKeys = async (key, altKey = false) => {
        await focusCalendarsContainer();
        await browserKeys(key, altKey);
        const [prop, prop2, content] = await browser.executeAsync(async (a, b, c, done) => {
            const n = document.body.querySelector(a);
            const n2 = n.shadowRoot.querySelector(b);
            const focusedDate = n2.shadowRoot.querySelector(c);
            done([
                n.value,
                n2.value,
                focusedDate.outerHTML,
            ]);
        }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME, toSelector('.day--focused'));
        return [prop, prop2, cleanHtml(content)];
    };
    it(`focuses date (ArrowLeft)`, async () => {
        const [prop, prop2, focusedDateContent,] = await getValuesAfterKeys(37);
        strictEqual(prop, '2020-02-20');
        strictEqual(prop2, '2020-02-19');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 19, 2020" aria-selected="true">
      <div class="calendar-day">19</div>
    </td>
    `);
    });
    it(`focuses date (ArrowRight)`, async () => {
        const [prop, prop2, focusedDateContent,] = await getValuesAfterKeys(39);
        strictEqual(prop, '2020-02-20');
        strictEqual(prop2, '2020-02-21');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 21, 2020" aria-selected="true">
      <div class="calendar-day">21</div>
    </td>
    `);
    });
    it(`focuses date (ArrowUp)`, async () => {
        const [prop, prop2, focusedDateContent,] = await getValuesAfterKeys(38);
        strictEqual(prop, '2020-02-20');
        strictEqual(prop2, `2020-02-13`);
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 13, 2020" aria-selected="true">
      <div class="calendar-day">13</div>
    </td>
    `);
    });
    it(`focuses date (ArrowDown)`, async () => {
        const [prop, prop2, focusedDateContent,] = await getValuesAfterKeys(40);
        strictEqual(prop, '2020-02-20');
        strictEqual(prop2, '2020-02-27');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 27, 2020" aria-selected="true">
      <div class="calendar-day">27</div>
    </td>
    `);
    });
    it(`focuses date (PageUp)`, async () => {
        const [prop, prop2, focusedDateContent,] = await getValuesAfterKeys(33);
        strictEqual(prop, '2020-02-20');
        strictEqual(prop2, '2020-01-20');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Jan 20, 2020" aria-selected="true">
      <div class="calendar-day">20</div>
    </td>
    `);
    });
    it(`focuses date (PageDown)`, async () => {
        const [prop, prop2, focusedDateContent,] = await getValuesAfterKeys(34);
        strictEqual(prop, '2020-02-20');
        strictEqual(prop2, '2020-03-20');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Mar 20, 2020" aria-selected="true">
      <div class="calendar-day">20</div>
    </td>
    `);
    });
    it(`focuses date (Home)`, async () => {
        const [prop, prop2, focusedDateContent,] = await getValuesAfterKeys(36);
        strictEqual(prop, '2020-02-20');
        strictEqual(prop2, '2020-02-01');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 1, 2020" aria-selected="true">
      <div class="calendar-day">1</div>
    </td>
    `);
    });
    it(`focuses date (End)`, async () => {
        const [prop, prop2, focusedDateContent,] = await getValuesAfterKeys(35);
        strictEqual(prop, '2020-02-20');
        strictEqual(prop2, '2020-02-29');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 29, 2020" aria-selected="true">
      <div class="calendar-day">29</div>
    </td>
    `);
    });
    it(`focuses date (Alt + PageUp)`, async () => {
        const [prop, prop2, focusedDateContent,] = await getValuesAfterKeys(33, true);
        strictEqual(prop, '2020-02-20');
        strictEqual(prop2, '2019-02-20');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 20, 2019" aria-selected="true">
      <div class="calendar-day">20</div>
    </td>
    `);
    });
    it(`focuses date (Alt + PageDown)`, async () => {
        const [prop, prop2, focusedDateContent,] = await getValuesAfterKeys(34, true);
        strictEqual(prop, '2020-02-20');
        strictEqual(prop2, '2021-02-20');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 20, 2021" aria-selected="true">
      <div class="calendar-day">20</div>
    </td>
    `);
    });
});
