import { DATEPICKER_NAME } from '../../constants.js';
import { APP_INDEX_URL } from '../constants.js';
import { cleanHtml } from '../helpers/clean-html.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { toSelector } from '../helpers/to-selector.js';
import { allStrictEqual, deepStrictEqual, strictEqual, } from '../helpers/typed-assert.js';
describe('initial render', () => {
    describe('calendar view', () => {
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
        it(`takes snapshot`, async () => {
            const browserName = browser.capabilities.browserName;
            await browser.saveScreenshot(`./src/tests/snapshots/${DATEPICKER_NAME}/initial-render-calendar-view-${browserName}.png`);
        });
        it(`renders initial content`, async () => {
            const prop = await browser.executeAsync(async (a, done) => {
                const n = document.body.querySelector(a);
                done(n.locale);
            }, DATEPICKER_NAME);
            strictEqual(prop, 'en-US');
        });
        it(`renders calendar view`, async () => {
            const [calendarLabelContent, calendarDaysContents,] = await browser.executeAsync(async (a, b, c, done) => {
                const n = document.body.querySelector(a);
                const root = n.shadowRoot;
                const calendarLabel = root.querySelector(b);
                const calendarDays = Array.from(root.querySelectorAll(c), o => o.textContent);
                done([
                    calendarLabel.outerHTML,
                    calendarDays,
                ]);
            }, DATEPICKER_NAME, toSelector('.calendar-label'), toSelector('.full-calendar__day'));
            strictEqual(cleanHtml(calendarLabelContent), prettyHtml `<div class="calendar-label">February 2020</div>`);
            deepStrictEqual(calendarDaysContents.map(n => n.trim()), [
                '', '', '', '', '', '', 1,
                2, 3, 4, 5, 6, 7, 8,
                9, 10, 11, 12, 13, 14, 15,
                16, 17, 18, 19, 20, 21, 22,
                23, 24, 25, 26, 27, 28, 29,
                '', '', '', '', '', '', '',
            ].map(String));
        });
        it(`renders today's date`, async () => {
            const [todayDateContent, dateLabel, calendarDay,] = await browser.executeAsync(async (a, b, done) => {
                const n = document.body.querySelector(a);
                n.value = '';
                await n.updateComplete;
                const n2 = n.shadowRoot.querySelector(b);
                const now = new Date();
                const formattedDate = Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }).format(now);
                done([
                    n2.outerHTML,
                    formattedDate,
                    now.getDate(),
                ]);
            }, DATEPICKER_NAME, toSelector('.day--today'));
            strictEqual(cleanHtml(todayDateContent, {
                showToday: true,
                showFocused: false,
            }), prettyHtml(`
      <td class="full-calendar__day day--today" aria-disabled="false" aria-label="${dateLabel}" aria-selected="true">
        <div class="calendar-day">${calendarDay}</div>
      </td>
      `));
        });
        it(`focuses date based on 'value'`, async () => {
            const focusedDateContent = await browser.executeAsync(async (a, b, done) => {
                const n = document.body.querySelector(a);
                const focusedDate = n.shadowRoot.querySelector(b);
                done(focusedDate.outerHTML);
            }, DATEPICKER_NAME, toSelector('.day--focused'));
            strictEqual(cleanHtml(focusedDateContent), prettyHtml `
      <td class="full-calendar__day day--focused" aria-disabled="false" aria-label="Feb 2, 2020" aria-selected="true">
        <div class="calendar-day">2</div>
      </td>
      `);
        });
    });
    describe('year list view', () => {
        before(async () => {
            await browser.url(APP_INDEX_URL);
        });
        beforeEach(async () => {
            await browser.executeAsync(async (a, done) => {
                const el = document.createElement(a);
                el.locale = 'en-US';
                el.min = '2000-01-01';
                el.startView = 'yearList';
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
        it(`takes snapshot`, async () => {
            const browserName = browser.capabilities.browserName;
            await browser.saveScreenshot(`./src/tests/snapshots/${DATEPICKER_NAME}/initial-render-year-view-${browserName}.png`);
        });
        it(`renders initial content`, async () => {
            const yearListItemsContents = await browser.executeAsync(async (a, b, done) => {
                const n = document.body.querySelector(a);
                const yearListItems = Array.from(n.shadowRoot.querySelectorAll(b), o => o.textContent);
                done(yearListItems);
            }, DATEPICKER_NAME, '.year-list-view__list-item');
            deepStrictEqual(yearListItemsContents.map(n => n.trim()), Array.from(Array(2100 - 2000 + 1), (_, i) => `${2000 + i}`));
        });
        it(`focuses this year`, async () => {
            const focusedYearContent = await browser.executeAsync(async (a, b, done) => {
                const n = document.body.querySelector(a);
                const focusedYear = n.shadowRoot.querySelector(b);
                done(focusedYear.outerHTML);
            }, DATEPICKER_NAME, '.year-list-view__list-item.year--selected');
            strictEqual(cleanHtml(focusedYearContent), prettyHtml `
      <button class="year-list-view__list-item year--selected">2020</button>
      `);
        });
        it(`has contents with 'part' attributes`, async () => {
            const results = [];
            const parts = [
                [
                    [
                        'body',
                        'calendar',
                        'calendar-day',
                        'calendar-selector',
                        'calendar-view',
                        'calendars',
                        'day',
                        'header',
                        'label',
                        'month-selector',
                        'month-selectors',
                        'table',
                        'toolbar',
                        'weekday',
                        'weekdays',
                        'year-selector',
                    ],
                    'calendar',
                ],
                [
                    [
                        'body',
                        'calendar-selector',
                        'header',
                        'toolbar',
                        'year',
                        'year-list',
                        'year-list-view',
                        'year-selector',
                    ],
                    'yearList',
                ],
            ];
            for (const part of parts) {
                const result = await browser.executeAsync(async (a, [b, c], done) => {
                    const n = document.body.querySelector(a);
                    n.startView = c;
                    await n.updateComplete;
                    const partContents = b.map(o => n.shadowRoot.querySelector(`[part="${o}"]`));
                    done(partContents.every(o => o instanceof HTMLElement));
                }, DATEPICKER_NAME, part);
                results.push(result);
            }
            allStrictEqual(results, true);
        });
    });
});
