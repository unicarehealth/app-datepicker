import { DATEPICKER_NAME } from '../../constants.js';
import '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import { cleanHtml } from '../helpers/clean-html.js';
import { interaction } from '../helpers/interaction.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { toSelector } from '../helpers/to-selector.js';
import { deepStrictEqual, strictEqual, } from '../helpers/typed-assert.js';
const { focusCalendarsContainer, browserKeys } = interaction({ elementName: DATEPICKER_NAME });
describe('keyboards', () => {
    const getValuesAfterKeys = async (key, altKey = false, prepareOptions) => {
        await focusCalendarsContainer(prepareOptions);
        await browserKeys(key, altKey);
        const [prop, content] = await browser.executeAsync(async (a, b, done) => {
            var _a;
            const n = document.body.querySelector(a);
            await n.updateComplete;
            const focusedDate = n.shadowRoot.querySelector(b);
            done([
                n.value,
                (_a = focusedDate === null || focusedDate === void 0 ? void 0 : focusedDate.outerHTML) !== null && _a !== void 0 ? _a : '',
            ]);
        }, DATEPICKER_NAME, toSelector('.day--focused'));
        return [prop, cleanHtml(content)];
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
            await el.updateComplete;
            done();
        }, DATEPICKER_NAME);
    });
    afterEach(async () => {
        await browser.executeAsync((a, done) => {
            const el = document.body.querySelector(a);
            if (el)
                document.body.removeChild(el);
            done();
        }, DATEPICKER_NAME);
    });
    it(`focuses date (ArrowLeft)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(37);
        strictEqual(prop, `2020-02-19`);
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 19, 2020" aria-selected="true">
      <div class="calendar-day">19</div>
    </td>
    `);
    });
    it(`focuses date (ArrowLeft + first focusable date + disabled date)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(37, false, {
            props: {
                disabledDates: '2020-02-19',
                value: '2020-02-20',
            },
        });
        strictEqual(prop, `2020-02-18`);
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 18, 2020" aria-selected="true">
      <div class="calendar-day">18</div>
    </td>
    `);
    });
    it(`focuses date (ArrowRight)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(39);
        strictEqual(prop, `2020-02-21`);
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 21, 2020" aria-selected="true">
      <div class="calendar-day">21</div>
    </td>
    `);
    });
    it(`focuses date (ArrowRight + first focusable date + disabled date)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(39, false, {
            props: {
                disabledDates: '2020-02-21',
                value: '2020-02-20',
            },
        });
        strictEqual(prop, `2020-02-22`);
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 22, 2020" aria-selected="true">
      <div class="calendar-day">22</div>
    </td>
    `);
    });
    it(`focuses date (ArrowUp)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(38);
        strictEqual(prop, `2020-02-13`);
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 13, 2020" aria-selected="true">
      <div class="calendar-day">13</div>
    </td>
    `);
    });
    it(`focuses date (ArrowUp + first focusable date + disabled date)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(38, false, {
            props: {
                disabledDates: '2020-02-13',
                value: '2020-02-20',
            },
        });
        strictEqual(prop, `2020-02-14`);
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 14, 2020" aria-selected="true">
      <div class="calendar-day">14</div>
    </td>
    `);
    });
    it(`focuses date (ArrowDown)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(40);
        strictEqual(prop, '2020-02-27');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 27, 2020" aria-selected="true">
      <div class="calendar-day">27</div>
    </td>
    `);
    });
    it(`focuses date (ArrowDown + first focusable date + disabled date)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(40, false, {
            props: {
                disabledDates: '2020-02-27',
                value: '2020-02-20',
            },
        });
        strictEqual(prop, '2020-02-26');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 26, 2020" aria-selected="true">
      <div class="calendar-day">26</div>
    </td>
    `);
    });
    it(`focuses date (PageUp)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(33);
        strictEqual(prop, '2020-01-20');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Jan 20, 2020" aria-selected="true">
      <div class="calendar-day">20</div>
    </td>
    `);
    });
    it(`focuses date (PageUp + first focusable date + disabled date)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(33, false, {
            props: {
                disabledDates: '2020-01-20',
                value: '2020-02-20',
            },
        });
        strictEqual(prop, '2020-01-21');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Jan 21, 2020" aria-selected="true">
      <div class="calendar-day">21</div>
    </td>
    `);
    });
    it(`focuses date (PageUp + first focusable date + disabled date + min date)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(33, false, {
            props: {
                min: '2020-02-02',
                value: '2020-02-20',
            },
        });
        strictEqual(prop, '2020-02-02');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 2, 2020" aria-selected="true">
      <div class="calendar-day">2</div>
    </td>
    `);
    });
    it(`focuses date (PageDown)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(34);
        strictEqual(prop, '2020-03-20');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Mar 20, 2020" aria-selected="true">
      <div class="calendar-day">20</div>
    </td>
    `);
    });
    it(`focuses date (PageDown + first focusable date + disabled date)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(34, false, {
            props: {
                disabledDates: '2020-03-20',
                value: '2020-02-20',
            },
        });
        strictEqual(prop, '2020-03-19');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Mar 19, 2020" aria-selected="true">
      <div class="calendar-day">19</div>
    </td>
    `);
    });
    it(`focuses date (PageDown + first focusable date + disabled date + max date)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(34, false, {
            props: {
                max: '2020-02-27',
                value: '2020-02-20',
            },
        });
        strictEqual(prop, '2020-02-27');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 27, 2020" aria-selected="true">
      <div class="calendar-day">27</div>
    </td>
    `);
    });
    it(`focuses date (Home)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(36);
        strictEqual(prop, '2020-02-01');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 1, 2020" aria-selected="true">
      <div class="calendar-day">1</div>
    </td>
    `);
    });
    it(`focuses date (Home + first focusable date + disabled date)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(36, false, {
            props: {
                disabledDates: '2020-02-01',
                value: '2020-02-20',
            },
        });
        strictEqual(prop, '2020-02-02');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 2, 2020" aria-selected="true">
      <div class="calendar-day">2</div>
    </td>
    `);
    });
    it(`focuses date (Home + first focusable date + disabled date + min date)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(36, false, {
            props: {
                min: '2020-02-17',
                value: '2020-02-20',
            },
        });
        strictEqual(prop, '2020-02-17');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 17, 2020" aria-selected="true">
      <div class="calendar-day">17</div>
    </td>
    `);
    });
    it(`focuses date (End)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(35);
        strictEqual(prop, '2020-02-29');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 29, 2020" aria-selected="true">
      <div class="calendar-day">29</div>
    </td>
    `);
    });
    it(`focuses date (End + first focusable date + disabled date)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(35, false, {
            props: {
                disabledDates: '2020-02-29',
                value: '2020-02-20',
            },
        });
        strictEqual(prop, '2020-02-28');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 28, 2020" aria-selected="true">
      <div class="calendar-day">28</div>
    </td>
    `);
    });
    it(`focuses date (End + first focusable date + disabled date + max date)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(35, false, {
            props: {
                max: '2020-02-27',
                value: '2020-02-20',
            },
        });
        strictEqual(prop, '2020-02-27');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 27, 2020" aria-selected="true">
      <div class="calendar-day">27</div>
    </td>
    `);
    });
    it(`focuses date (Alt + PageUp)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(33, true);
        strictEqual(prop, '2019-02-20');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 20, 2019" aria-selected="true">
      <div class="calendar-day">20</div>
    </td>
    `);
    });
    it(`focuses date (Alt + PageUp + first focusable date + disabled date)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(33, true, {
            props: {
                disabledDates: '2019-02-20',
                value: '2020-02-20',
            },
        });
        strictEqual(prop, '2019-02-21');
        strictEqual(focusedDateContent, prettyHtml `
      <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 21, 2019" aria-selected="true">
        <div class="calendar-day">21</div>
      </td>
      `);
    });
    it(`focuses date (Alt + PageUp + first focusable date + disabled date + min date)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(33, true, {
            props: {
                min: '2019-02-27',
                value: '2020-02-20',
            },
        });
        strictEqual(prop, '2019-02-27');
        strictEqual(focusedDateContent, prettyHtml `
      <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 27, 2019" aria-selected="true">
        <div class="calendar-day">27</div>
      </td>
      `);
    });
    it(`focuses date (Alt + PageDown)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(34, true);
        strictEqual(prop, '2021-02-20');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 20, 2021" aria-selected="true">
      <div class="calendar-day">20</div>
    </td>
    `);
    });
    it(`focuses date (Alt + PageDown + first focusable date + disabled date)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(34, true, {
            props: {
                disabledDates: '2021-02-20',
                value: '2020-02-20',
            },
        });
        strictEqual(prop, '2021-02-19');
        strictEqual(focusedDateContent, prettyHtml `
      <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 19, 2021" aria-selected="true">
        <div class="calendar-day">19</div>
      </td>
      `);
    });
    it(`focuses date (Alt + PageDown + first focusable date + disabled date + max date)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(34, true, {
            props: {
                max: '2021-02-17',
                value: '2020-02-20',
            },
        });
        strictEqual(prop, '2021-02-17');
        strictEqual(focusedDateContent, prettyHtml `
      <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 17, 2021" aria-selected="true">
        <div class="calendar-day">17</div>
      </td>
      `);
    });
    it(`focuses last day of month when new date is invalid (PageDown)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(34, false, {
            props: {
                min: '2000-01-01',
                value: '2020-01-31',
            },
        });
        const [prop2, focusedDateContent2] = await getValuesAfterKeys(34, false, {
            props: {
                value: '2020-03-31',
            },
        });
        strictEqual(prop, '2020-02-29');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 29, 2020" aria-selected="true">
      <div class="calendar-day">29</div>
    </td>
    `);
        strictEqual(prop2, '2020-04-30');
        strictEqual(focusedDateContent2, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Apr 30, 2020" aria-selected="true">
      <div class="calendar-day">30</div>
    </td>
    `);
    });
    it(`focuses last day of month when new date is invalid (PageUp)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(33, false, {
            props: {
                min: '2000-01-01',
                value: '2020-03-31',
            },
        });
        const [prop2, focusedDateContent2] = await getValuesAfterKeys(33, false, {
            props: {
                value: '2020-05-31',
            },
        });
        strictEqual(prop, '2020-02-29');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 29, 2020" aria-selected="true">
      <div class="calendar-day">29</div>
    </td>
    `);
        strictEqual(prop2, '2020-04-30');
        strictEqual(focusedDateContent2, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Apr 30, 2020" aria-selected="true">
      <div class="calendar-day">30</div>
    </td>
    `);
    });
    it(`focuses last day of month when new date is invalid (Alt + PageDown)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(34, true, {
            props: {
                min: '2000-01-01',
                value: '2020-02-29',
            },
        });
        strictEqual(prop, '2021-02-28');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 28, 2021" aria-selected="true">
      <div class="calendar-day">28</div>
    </td>
    `);
    });
    it(`focuses last day of month when new date is invalid (Alt + PageUp)`, async () => {
        const [prop, focusedDateContent] = await getValuesAfterKeys(33, true, {
            props: {
                min: '2000-01-01',
                value: '2020-02-29',
            },
        });
        strictEqual(prop, '2019-02-28');
        strictEqual(focusedDateContent, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 28, 2019" aria-selected="true">
      <div class="calendar-day">28</div>
    </td>
    `);
    });
    it(`updates 'tabindex' on all affected dates (ArrowLeft)`, async () => {
        const focusedDateSelector = toSelector('.day--focused');
        const getFocusedDate = (s) => browser.executeAsync(async (a, b, done) => {
            var _a, _b, _c;
            const n = document.body.querySelector(a);
            done((_c = (_b = (_a = n.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector(b)) === null || _b === void 0 ? void 0 : _b.outerHTML) !== null && _c !== void 0 ? _c : '');
        }, DATEPICKER_NAME, s);
        const initialFocusedDateContent = await getFocusedDate(focusedDateSelector);
        await focusCalendarsContainer();
        await browserKeys(37);
        const [oldFocusedDateContent, newFocusedDateContent,] = await Promise.all([
            getFocusedDate(toSelector(`[aria-label="Feb 20, 2020"]`)),
            getFocusedDate(focusedDateSelector),
        ]);
        deepStrictEqual([
            initialFocusedDateContent,
            oldFocusedDateContent,
        ].map(n => cleanHtml(n, { showTabindex: true })), ['0', '-1'].map((n) => {
            const isTab = '0' === n;
            return prettyHtml(`
        <td tabindex="${n}" class="full-calendar__day${isTab ? ' day--focused' : ''}" aria-disabled="false" aria-label="Feb 20, 2020" aria-selected="${isTab ? 'true' : 'false'}">
          <div class="calendar-day">20</div>
        </td>
        `);
        }));
        strictEqual(cleanHtml(newFocusedDateContent, { showTabindex: true }), prettyHtml `
    <td tabindex="0" class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 19, 2020" aria-selected="true">
      <div class="calendar-day">19</div>
    </td>
    `);
    });
});
