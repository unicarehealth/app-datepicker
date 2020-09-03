import { DATEPICKER_NAME } from '../../constants.js';
import '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import { cleanHtml } from '../helpers/clean-html.js';
import { interaction } from '../helpers/interaction.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { toSelector } from '../helpers/to-selector.js';
import { allStrictEqual, deepStrictEqual, strictEqual, } from '../helpers/typed-assert.js';
describe('edge cases', () => {
    const isSafari = browser.capabilities.browserName === 'Safari';
    const { browserKeys, clickElements, focusCalendarsContainer, } = interaction({ isSafari, elementName: DATEPICKER_NAME });
    before(async () => {
        await browser.url(APP_INDEX_URL);
    });
    beforeEach(async () => {
        await browser.executeAsync(async (a, done) => {
            const el = document.createElement(a);
            el.locale = 'en-US';
            el.min = '2000-01-01';
            el.value = '2020-02-02';
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
    it(`updates month after navigating with keyboard and mouse`, async () => {
        const getValues = () => browser.executeAsync(async (a, b, done) => {
            const n = document.body.querySelector(a);
            const calendarLabel = n.shadowRoot.querySelector(b);
            done([
                n.value,
                calendarLabel.outerHTML,
            ]);
        }, DATEPICKER_NAME, toSelector('.calendar-label'));
        await focusCalendarsContainer();
        await browserKeys(34);
        await browserKeys(34);
        const [prop, calendarLabelContent] = await getValues();
        await clickElements([
            `.btn__month-selector[aria-label="Previous month"]`,
        ]);
        const [prop2, calendarLabelContent2] = await getValues();
        allStrictEqual([prop, prop2], '2020-04-02');
        strictEqual(cleanHtml(calendarLabelContent), prettyHtml `
    <div class="calendar-label">April 2020</div>
    `);
        strictEqual(cleanHtml(calendarLabelContent2), prettyHtml `
    <div class="calendar-label">March 2020</div>
    `);
    });
    const getValuesAfterKeys = async (key, altKey = false, prepareOptions) => {
        await browser.executeAsync(async (a, b, done) => {
            var _a, _b;
            const n = document.body.querySelector(a);
            if (b) {
                const attrs = (_a = b.attrs) !== null && _a !== void 0 ? _a : {};
                const props = (_b = b.props) !== null && _b !== void 0 ? _b : {};
                Object.keys(attrs !== null && attrs !== void 0 ? attrs : {}).forEach((k) => {
                    n[k] = attrs[k];
                });
                Object.keys(props !== null && props !== void 0 ? props : {}).forEach((k) => {
                    n[k] = props[k];
                });
            }
            else {
                n.min = '2000-01-01';
                n.value = '2020-02-29';
            }
            await n.updateComplete;
            done();
        }, DATEPICKER_NAME, prepareOptions);
        await clickElements(Array.from('123', () => (`.btn__month-selector[aria-label="Next month"]`)));
        await focusCalendarsContainer();
        await browserKeys(key, altKey);
        const [prop, content] = await browser.executeAsync(async (a, b, done) => {
            const n = document.body.querySelector(a);
            const focusedDate = n.shadowRoot.querySelector(b);
            done([
                n.value,
                focusedDate.outerHTML,
            ]);
        }, DATEPICKER_NAME, toSelector('.day--focused'));
        return [prop, cleanHtml(content)];
    };
    it(`focuses first day of month when focused date does not exist (Arrows)`, async () => {
        const arrowKeys = [
            40,
            37,
            39,
            38,
        ];
        const props = [];
        const focusedDateContents = [];
        for (const arrowKey of arrowKeys) {
            const [prop, focusedDateContent] = await getValuesAfterKeys(arrowKey);
            props.push(prop);
            focusedDateContents.push(focusedDateContent);
        }
        allStrictEqual(props, '2020-05-01');
        allStrictEqual(focusedDateContents, prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="May 1, 2020" aria-selected="true">
      <div class="calendar-day">1</div>
    </td>
    `);
    });
    it(`focuses first day of month when focused date does not exist (Home, End)`, async () => {
        const arrowKeys = [
            36,
            35,
        ];
        const props = [];
        const focusedDateContents = [];
        for (const arrowKey of arrowKeys) {
            const [prop, focusedDateContent] = await getValuesAfterKeys(arrowKey);
            props.push(prop);
            focusedDateContents.push(focusedDateContent);
        }
        deepStrictEqual(props, ['2020-05-01', '2020-05-31']);
        deepStrictEqual(focusedDateContents, [1, 31].map(n => prettyHtml(`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="May ${n}, 2020" aria-selected="true">
      <div class="calendar-day">${n}</div>
    </td>
    `)));
    });
    it(`focuses first day of month when focused date does not exist (PageDown, PageUp)`, async () => {
        const arrowKeys = [
            34,
            33,
        ];
        const props = [];
        const focusedDateContents = [];
        for (const arrowKey of arrowKeys) {
            const [prop, focusedDateContent] = await getValuesAfterKeys(arrowKey);
            props.push(prop);
            focusedDateContents.push(focusedDateContent);
        }
        deepStrictEqual(props, ['2020-06-01', '2020-04-01']);
        deepStrictEqual(focusedDateContents, ['Jun', 'Apr'].map(n => prettyHtml(`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="${n} 1, 2020" aria-selected="true">
      <div class="calendar-day">1</div>
    </td>
    `)));
    });
    it(`focuses first day of month when focused date does not exist (Alt + {PageDown, PageUp})`, async () => {
        const arrowKeys = [
            34,
            33,
        ];
        const props = [];
        const focusedDateContents = [];
        for (const arrowKey of arrowKeys) {
            const [prop, focusedDateContent] = await getValuesAfterKeys(arrowKey, true);
            props.push(prop);
            focusedDateContents.push(focusedDateContent);
        }
        deepStrictEqual(props, ['2021-05-01', '2019-05-01']);
        deepStrictEqual(focusedDateContents, [2021, 2019].map(n => prettyHtml(`
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="May 1, ${n}" aria-selected="true">
      <div class="calendar-day">1</div>
    </td>
    `)));
    });
    it(`focuses first focusable day of month (Enter, Space)`, async () => {
        const keys = [13, 32];
        const props = [];
        const focusedDateContents = [];
        for (const key of keys) {
            const [prop, focusedDateContent] = await getValuesAfterKeys(key, false, {
                props: {
                    min: '2000-01-01',
                    value: '2019-11-30',
                },
            });
            props.push(prop);
            focusedDateContents.push(focusedDateContent);
        }
        allStrictEqual(props, '2020-02-01');
        allStrictEqual(focusedDateContents.map(n => cleanHtml(n)), prettyHtml `
    <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 1, 2020" aria-selected="true">
      <div class="calendar-day">1</div>
    </td>
    `);
    });
    it(`reset invalid 'value' to 'min' or 'max'`, async () => {
        const inputs = [
            ['2020-02-02', '2020-02-27', '2020-01-01'],
            ['2020-02-02', '2020-02-27', '2020-03-01'],
            ['2020-02-02', '2020-02-27', ''],
            ['2020-02-02', '2020-02-27', 'lol'],
            ['2020-02-02', '2020-02-27', undefined],
        ];
        const maxValues = [];
        const minValues = [];
        const values = [];
        const focusedDateContents = [];
        for (const input of inputs) {
            const [minProp, maxProp, valueProp, focusedDateContent,] = await browser.executeAsync(async (a, b, c, d, e, done) => {
                const n = document.body.querySelector(a);
                n.min = b;
                n.max = c;
                n.value = d;
                while (!(await n.updateComplete)) {
                }
                const focusedDate = n.shadowRoot.querySelector(e);
                done([
                    n.min,
                    n.max,
                    n.value,
                    (focusedDate === null || focusedDate === void 0 ? void 0 : focusedDate.outerHTML) || '<empty>',
                ]);
            }, DATEPICKER_NAME, ...input, toSelector('.day--focused'));
            minValues.push(minProp);
            maxValues.push(maxProp);
            values.push(valueProp);
            focusedDateContents.push(focusedDateContent);
        }
        allStrictEqual(maxValues, '2020-02-27');
        allStrictEqual(minValues, '2020-02-02');
        deepStrictEqual(focusedDateContents.map(n => cleanHtml(n)), [
            prettyHtml `
      <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 2, 2020" aria-selected="true">
        <div class="calendar-day">2</div>
      </td>
      `,
            ...Array.from('1234', () => prettyHtml(`
      <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 27, 2020" aria-selected="true">
        <div class="calendar-day">27</div>
      </td>
      `)),
        ]);
    });
});
