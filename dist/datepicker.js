var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, eventOptions, html, LitElement, property, query, } from 'lit-element';
import { cache } from 'lit-html/directives/cache.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { toUTCDate } from 'nodemod/dist/calendar/helpers/to-utc-date.js';
import { iconChevronLeft, iconChevronRight } from './app-datepicker-icons.js';
import { datepickerVariables, resetButton } from './common-styles.js';
import { ALL_NAV_KEYS_SET } from './constants.js';
import './custom_typings.js';
import { animateElement } from './helpers/animate-element.js';
import { computeNextFocusedDate } from './helpers/compute-next-focus-date.js';
import { dispatchCustomEvent } from './helpers/dispatch-custom-event.js';
import { findShadowTarget } from './helpers/find-shadow-target.js';
import { getDateRange } from './helpers/get-date-range.js';
import { getFormatters } from './helpers/get-formatters.js';
import { getMultiCalendars } from './helpers/get-multi-calendars.js';
import { getResolvedDate } from './helpers/get-resolved-date.js';
import { getResolvedLocale } from './helpers/get-resolved-locale.js';
import { hasClass } from './helpers/has-class.js';
import { isValidDate } from './helpers/is-valid-date.js';
import { makeNumberPrecise } from './helpers/make-number-precise.js';
import { passiveHandler } from './helpers/passive-handler.js';
import { splitString } from './helpers/split-string.js';
import { targetScrollTo } from './helpers/target-scroll-to.js';
import { toFormattedDateString } from './helpers/to-formatted-date-string.js';
import { toYearList } from './helpers/to-year-list.js';
import { updateYearWithMinMax } from './helpers/update-year-with-min-max.js';
import { Tracker } from './tracker.js';
export class Datepicker extends LitElement {
    constructor() {
        super();
        this.firstDayOfWeek = 0;
        this.showWeekNumber = false;
        this.weekNumberType = 'first-4-day-week';
        this.landscape = false;
        this.locale = getResolvedLocale();
        this.disabledDays = '';
        this.disabledDates = '';
        this.weekLabel = 'Wk';
        this.inline = false;
        this.dragRatio = .15;
        this._hasMin = false;
        this._hasMax = false;
        this._disabledDaysSet = new Set();
        this._disabledDatesSet = new Set();
        this._dx = -Infinity;
        this._hasNativeWebAnimation = 'animate' in HTMLElement.prototype;
        this._updatingDateWithKey = false;
        const todayDate = getResolvedDate();
        const allFormatters = getFormatters(this.locale);
        const formattedTodayDate = toFormattedDateString(todayDate);
        const max = getResolvedDate('2100-12-31');
        this.value = formattedTodayDate;
        this.startView = 'calendar';
        this._min = new Date(todayDate);
        this._max = new Date(max);
        this._todayDate = todayDate;
        this._maxDate = max;
        this._yearList = toYearList(todayDate, max);
        this._selectedDate = new Date(todayDate);
        this._focusedDate = new Date(todayDate);
        this._formatters = allFormatters;
    }
    get startView() {
        return this._startView;
    }
    set startView(val) {
        const defaultVal = !val ? 'calendar' : val;
        if (defaultVal !== 'calendar' && defaultVal !== 'yearList')
            return;
        const oldVal = this._startView;
        this._startView = defaultVal;
        this.requestUpdate('startView', oldVal);
    }
    get min() {
        return this._hasMin ? toFormattedDateString(this._min) : '';
    }
    set min(val) {
        const valDate = getResolvedDate(val);
        const isValidMin = isValidDate(val, valDate);
        this._min = isValidMin ? valDate : this._todayDate;
        this._hasMin = isValidMin;
        this.requestUpdate('min');
    }
    get max() {
        return this._hasMax ? toFormattedDateString(this._max) : '';
    }
    set max(val) {
        const valDate = getResolvedDate(val);
        const isValidMax = isValidDate(val, valDate);
        this._max = isValidMax ? valDate : this._maxDate;
        this._hasMax = isValidMax;
        this.requestUpdate('max');
    }
    get value() {
        return toFormattedDateString(this._focusedDate);
    }
    set value(val) {
        const valDate = getResolvedDate(val);
        const validValue = isValidDate(val, valDate) ? valDate : this._todayDate;
        this._focusedDate = new Date(validValue);
        this._selectedDate = this._lastSelectedDate = new Date(validValue);
    }
    get datepickerBodyCalendarView() {
        return this.shadowRoot.querySelector('.datepicker-body__calendar-view');
    }
    get calendarsContainer() {
        return this.shadowRoot.querySelector('.calendars-container');
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._tracker) {
            this._tracker.disconnect();
            this._tracker = undefined;
        }
    }
    render() {
        if (this._formatters.locale !== this.locale)
            this._formatters = getFormatters(this.locale);
        const datepickerBodyContent = 'yearList' === this._startView ?
            this._renderDatepickerYearList() : this._renderDatepickerCalendar();
        const datepickerHeaderContent = this.inline ?
            null :
            html `<div class="datepicker-header" part="header">${this._renderHeaderSelectorButton()}</div>`;
        return html `
    ${datepickerHeaderContent}
    <div class="datepicker-body" part="body">${cache(datepickerBodyContent)}</div>
    `;
    }
    firstUpdated() {
        let firstFocusableElement;
        if ('calendar' === this._startView) {
            firstFocusableElement = (this.inline ?
                this.shadowRoot.querySelector('.btn__month-selector') :
                this._buttonSelectorYear);
        }
        else {
            firstFocusableElement = this._yearViewListItem;
        }
        dispatchCustomEvent(this, 'datepicker-first-updated', { firstFocusableElement, value: this.value });
    }
    updated(changed) {
        const startView = this._startView;
        if (changed.has('min') || changed.has('max')) {
            this._yearList = toYearList(this._min, this._max);
            if ('yearList' === startView)
                this.requestUpdate();
            const minTime = +this._min;
            const maxTime = +this._max;
            if (getDateRange(minTime, maxTime) > 864e5) {
                const focusedDateTime = +this._focusedDate;
                let newValue = focusedDateTime;
                if (focusedDateTime < minTime)
                    newValue = minTime;
                if (focusedDateTime > maxTime)
                    newValue = maxTime;
                this.value = toFormattedDateString(new Date(newValue));
            }
        }
        if (changed.has('_startView') || changed.has('startView')) {
            if ('yearList' === startView) {
                const selectedYearScrollTop = 48 * (this._selectedDate.getUTCFullYear() - this._min.getUTCFullYear() - 2);
                targetScrollTo(this._yearViewFullList, { top: selectedYearScrollTop, left: 0 });
            }
            if ('calendar' === startView && null == this._tracker) {
                const calendarsContainer = this.calendarsContainer;
                let $down = false;
                let $move = false;
                let $transitioning = false;
                if (calendarsContainer) {
                    const handlers = {
                        down: () => {
                            if ($transitioning)
                                return;
                            $down = true;
                            this._dx = 0;
                        },
                        move: (pointer, oldPointer) => {
                            if ($transitioning || !$down)
                                return;
                            const dx = this._dx;
                            const hasMin = (dx < 0 && hasClass(calendarsContainer, 'has-max-date')) ||
                                (dx > 0 && hasClass(calendarsContainer, 'has-min-date'));
                            if (!hasMin && Math.abs(dx) > 0 && $down) {
                                $move = true;
                                calendarsContainer.style.transform = `translateX(${makeNumberPrecise(dx)}px)`;
                            }
                            this._dx = hasMin ? 0 : dx + (pointer.x - oldPointer.x);
                        },
                        up: async (_$, _$$, ev) => {
                            if ($down && $move) {
                                const dx = this._dx;
                                const maxWidth = calendarsContainer.getBoundingClientRect().width / 3;
                                const didPassThreshold = Math.abs(dx) > (Number(this.dragRatio) * maxWidth);
                                const transitionDuration = 350;
                                const transitionEasing = 'cubic-bezier(0, 0, .4, 1)';
                                const transformTo = didPassThreshold ? makeNumberPrecise(maxWidth * (dx < 0 ? -1 : 1)) : 0;
                                $transitioning = true;
                                await animateElement(calendarsContainer, {
                                    hasNativeWebAnimation: this._hasNativeWebAnimation,
                                    keyframes: [
                                        { transform: `translateX(${dx}px)` },
                                        {
                                            transform: `translateX(${transformTo}px)`,
                                        },
                                    ],
                                    options: {
                                        duration: transitionDuration,
                                        easing: transitionEasing,
                                    },
                                });
                                if (didPassThreshold) {
                                    this._updateMonth(dx < 0 ? 'next' : 'previous').handleEvent();
                                }
                                $down = $move = $transitioning = false;
                                this._dx = -Infinity;
                                calendarsContainer.removeAttribute('style');
                                dispatchCustomEvent(this, 'datepicker-animation-finished');
                            }
                            else if ($down) {
                                this._updateFocusedDate(ev);
                                $down = $move = false;
                                this._dx = -Infinity;
                            }
                        },
                    };
                    this._tracker = new Tracker(calendarsContainer, handlers);
                }
            }
            if (changed.get('_startView') && 'calendar' === startView) {
                this._focusElement('[part="year-selector"]');
            }
        }
        if (this._updatingDateWithKey) {
            this._focusElement('[part="calendars"]:nth-of-type(2) .day--focused');
            this._updatingDateWithKey = false;
        }
    }
    _focusElement(selector) {
        const focusedTarget = this.shadowRoot.querySelector(selector);
        if (focusedTarget)
            focusedTarget.focus();
    }
    _renderHeaderSelectorButton() {
        const { yearFormat, dateFormat } = this._formatters;
        const isCalendarView = this.startView === 'calendar';
        const focusedDate = this._focusedDate;
        const formattedDate = dateFormat(focusedDate);
        const formatterFy = yearFormat(focusedDate);
        return html `
    <button
      class="${classMap({ 'btn__year-selector': true, selected: !isCalendarView })}"
      part="year-selector"
      data-view="${'yearList'}"
      @click="${this._updateView('yearList')}">${formatterFy}</button>

    <div class="datepicker-toolbar" part="toolbar">
      <button
        class="${classMap({ 'btn__calendar-selector': true, selected: isCalendarView })}"
        part="calendar-selector"
        data-view="${'calendar'}"
        @click="${this._updateView('calendar')}">${formattedDate}</button>
    </div>
    `;
    }
    _renderDatepickerYearList() {
        const { yearFormat } = this._formatters;
        const focusedDateFy = this._focusedDate.getUTCFullYear();
        return html `
    <div class="datepicker-body__year-list-view" part="year-list-view">
      <div class="year-list-view__full-list" part="year-list" @click="${this._updateYear}">
      ${this._yearList.map(n => html `<button
        class="${classMap({
            'year-list-view__list-item': true,
            'year--selected': focusedDateFy === n,
        })}"
        part="year"
        .year="${n}">${yearFormat(toUTCDate(n, 0, 1))}</button>`)}</div>
    </div>
    `;
    }
    _renderDatepickerCalendar() {
        const { longMonthYearFormat, dayFormat, fullDateFormat, longWeekdayFormat, narrowWeekdayFormat, } = this._formatters;
        const disabledDays = splitString(this.disabledDays, Number);
        const disabledDates = splitString(this.disabledDates, getResolvedDate);
        const showWeekNumber = this.showWeekNumber;
        const $focusedDate = this._focusedDate;
        const firstDayOfWeek = this.firstDayOfWeek;
        const todayDate = getResolvedDate();
        const $selectedDate = this._selectedDate;
        const $max = this._max;
        const $min = this._min;
        const { calendars, disabledDaysSet, disabledDatesSet, weekdays } = getMultiCalendars({
            dayFormat,
            fullDateFormat,
            longWeekdayFormat,
            narrowWeekdayFormat,
            firstDayOfWeek,
            disabledDays,
            disabledDates,
            locale: this.locale,
            selectedDate: $selectedDate,
            showWeekNumber: this.showWeekNumber,
            weekNumberType: this.weekNumberType,
            max: $max,
            min: $min,
            weekLabel: this.weekLabel,
        });
        const hasMinDate = !calendars[0].calendar.length;
        const hasMaxDate = !calendars[2].calendar.length;
        const weekdaysContent = weekdays.map(o => html `<th
        class="calendar-weekday"
        part="calendar-weekday"
        role="columnheader"
        aria-label="${o.label}"
      >
        <div class="weekday" part="weekday">${o.value}</div>
      </th>`);
        const calendarsContent = repeat(calendars, n => n.key, ({ calendar }, ci) => {
            if (!calendar.length) {
                return html `<div class="calendar-container" part="calendar"></div>`;
            }
            const calendarAriaId = `calendarcaption${ci}`;
            const midCalendarFullDate = calendar[1][1].fullDate;
            const isMidCalendar = ci === 1;
            const $newFocusedDate = isMidCalendar && !this._isInVisibleMonth($focusedDate, $selectedDate) ?
                computeNextFocusedDate({
                    disabledDaysSet,
                    disabledDatesSet,
                    hasAltKey: false,
                    keyCode: 36,
                    focusedDate: $focusedDate,
                    selectedDate: $selectedDate,
                    minTime: +$min,
                    maxTime: +$max,
                }) :
                $focusedDate;
            return html `
      <div class="calendar-container" part="calendar">
        <table class="calendar-table" part="table" role="grid" aria-labelledby="${calendarAriaId}">
          <caption id="${calendarAriaId}">
            <div class="calendar-label" part="label">${midCalendarFullDate ? longMonthYearFormat(midCalendarFullDate) : ''}</div>
          </caption>

          <thead role="rowgroup">
            <tr class="calendar-weekdays" part="weekdays" role="row">${weekdaysContent}</tr>
          </thead>

          <tbody role="rowgroup">${calendar.map((calendarRow) => {
                return html `<tr role="row">${calendarRow.map((calendarCol, i) => {
                    const { disabled, fullDate, label, value } = calendarCol;
                    if (!fullDate && value && showWeekNumber && i < 1) {
                        return html `<th
                      class="full-calendar__day weekday-label"
                      part="calendar-day"
                      scope="row"
                      role="rowheader"
                      abbr="${label}"
                      aria-label="${label}"
                    >${value}</th>`;
                    }
                    if (!value || !fullDate) {
                        return html `<td class="full-calendar__day day--empty" part="calendar-day"></td>`;
                    }
                    const curTime = +new Date(fullDate);
                    const isCurrentDate = +$focusedDate === curTime;
                    const shouldTab = isMidCalendar && $newFocusedDate.getUTCDate() === Number(value);
                    return html `
                  <td
                    tabindex="${shouldTab ? '0' : '-1'}"
                    class="${classMap({
                        'full-calendar__day': true,
                        'day--disabled': disabled,
                        'day--today': +todayDate === curTime,
                        'day--focused': !disabled && isCurrentDate,
                    })}"
                    part="calendar-day"
                    role="gridcell"
                    aria-disabled="${disabled ? 'true' : 'false'}"
                    aria-label="${label}"
                    aria-selected="${isCurrentDate ? 'true' : 'false'}"
                    .fullDate="${fullDate}"
                    .day="${value}"
                  >
                    <div class="calendar-day" part="day">${value}</div>
                  </td>
                  `;
                })}</tr>`;
            })}</tbody>
        </table>
      </div>
      `;
        });
        this._disabledDatesSet = disabledDatesSet;
        this._disabledDaysSet = disabledDaysSet;
        return html `
    <div class="datepicker-body__calendar-view" part="calendar-view">
      <div class="calendar-view__month-selector" part="month-selectors">
        <div class="month-selector-container">${hasMinDate ? null : html `
          <button
            class="btn__month-selector"
            part="month-selector"
            aria-label="Previous month"
            @click="${this._updateMonth('previous')}"
          >${iconChevronLeft}</button>
        `}</div>

        <div class="month-selector-container">${hasMaxDate ? null : html `
          <button
            class="btn__month-selector"
            part="month-selector"
            aria-label="Next month"
            @click="${this._updateMonth('next')}"
          >${iconChevronRight}</button>
        `}</div>
      </div>

      <div
        class="${classMap({
            'calendars-container': true,
            'has-min-date': hasMinDate,
            'has-max-date': hasMaxDate,
        })}"
        part="calendars"
        @keyup="${this._updateFocusedDateWithKeyboard}"
      >${calendarsContent}</div>
    </div>
    `;
    }
    _updateView(view) {
        const handleUpdateView = () => {
            if ('calendar' === view) {
                this._selectedDate = this._lastSelectedDate =
                    new Date(updateYearWithMinMax(this._focusedDate, this._min, this._max));
            }
            this._startView = view;
        };
        return passiveHandler(handleUpdateView);
    }
    _updateMonth(updateType) {
        const handleUpdateMonth = () => {
            const calendarsContainer = this.calendarsContainer;
            if (null == calendarsContainer)
                return this.updateComplete;
            const dateDate = this._lastSelectedDate || this._selectedDate;
            const minDate = this._min;
            const maxDate = this._max;
            const isPreviousMonth = updateType === 'previous';
            const newSelectedDate = toUTCDate(dateDate.getUTCFullYear(), dateDate.getUTCMonth() + (isPreviousMonth ? -1 : 1), 1);
            const newSelectedDateFy = newSelectedDate.getUTCFullYear();
            const newSelectedDateM = newSelectedDate.getUTCMonth();
            const minDateFy = minDate.getUTCFullYear();
            const minDateM = minDate.getUTCMonth();
            const maxDateFy = maxDate.getUTCFullYear();
            const maxDateM = maxDate.getUTCMonth();
            const isLessThanYearAndMonth = newSelectedDateFy < minDateFy ||
                (newSelectedDateFy <= minDateFy && newSelectedDateM < minDateM);
            const isMoreThanYearAndMonth = newSelectedDateFy > maxDateFy ||
                (newSelectedDateFy >= maxDateFy && newSelectedDateM > maxDateM);
            if (isLessThanYearAndMonth || isMoreThanYearAndMonth)
                return this.updateComplete;
            this._lastSelectedDate = newSelectedDate;
            this._selectedDate = this._lastSelectedDate;
            return this.updateComplete;
        };
        return passiveHandler(handleUpdateMonth);
    }
    _updateYear(ev) {
        const selectedYearEl = findShadowTarget(ev, (n) => hasClass(n, 'year-list-view__list-item'));
        if (selectedYearEl == null)
            return;
        const newFocusedDate = updateYearWithMinMax(new Date(this._focusedDate).setUTCFullYear(+selectedYearEl.year), this._min, this._max);
        this._selectedDate = this._lastSelectedDate = new Date(newFocusedDate);
        this._focusedDate = new Date(newFocusedDate);
        this._startView = 'calendar';
    }
    _updateFocusedDate(ev) {
        const selectedDayEl = findShadowTarget(ev, (n) => hasClass(n, 'full-calendar__day'));
        if (selectedDayEl == null ||
            [
                'day--empty',
                'day--disabled',
                'day--focused',
                'weekday-label',
            ].some(n => hasClass(selectedDayEl, n)))
            return;
        this._focusedDate = new Date(selectedDayEl.fullDate);
        dispatchCustomEvent(this, 'datepicker-value-updated', {
            isKeypress: false,
            value: this.value,
        });
    }
    _updateFocusedDateWithKeyboard(ev) {
        const keyCode = ev.keyCode;
        if (13 === keyCode || 32 === keyCode) {
            dispatchCustomEvent(this, 'datepicker-value-updated', {
                keyCode,
                isKeypress: true,
                value: this.value,
            });
            this._focusedDate = new Date(this._selectedDate);
            return;
        }
        if (keyCode === 9 || !ALL_NAV_KEYS_SET.has(keyCode))
            return;
        const selectedDate = this._selectedDate;
        const nextFocusedDate = computeNextFocusedDate({
            keyCode,
            selectedDate,
            disabledDatesSet: this._disabledDatesSet,
            disabledDaysSet: this._disabledDaysSet,
            focusedDate: this._focusedDate,
            hasAltKey: ev.altKey,
            maxTime: +this._max,
            minTime: +this._min,
        });
        if (!this._isInVisibleMonth(nextFocusedDate, selectedDate)) {
            this._selectedDate = this._lastSelectedDate = nextFocusedDate;
        }
        this._focusedDate = nextFocusedDate;
        this._updatingDateWithKey = true;
        dispatchCustomEvent(this, 'datepicker-value-updated', {
            keyCode,
            isKeypress: true,
            value: this.value,
        });
    }
    _isInVisibleMonth(dateA, dateB) {
        const dateAFy = dateA.getUTCFullYear();
        const dateAM = dateA.getUTCMonth();
        const dateBFY = dateB.getUTCFullYear();
        const dateBM = dateB.getUTCMonth();
        return dateAFy === dateBFY && dateAM === dateBM;
    }
}
Datepicker.styles = [
    datepickerVariables,
    resetButton,
    css `
    :host {
      width: 312px;
      /** NOTE: Magic number as 16:9 aspect ratio does not look good */
      /* height: calc((var(--app-datepicker-width) / .66) - var(--app-datepicker-footer-height, 56px)); */
      background-color: var(--app-datepicker-bg-color, #fff);
      color: var(--app-datepicker-color, #000);
      border-radius:
        var(--app-datepicker-border-top-left-radius, 0)
        var(--app-datepicker-border-top-right-radius, 0)
        var(--app-datepicker-border-bottom-right-radius, 0)
        var(--app-datepicker-border-bottom-left-radius, 0);
      contain: content;
      overflow: hidden;
    }
    :host([landscape]) {
      display: flex;

      /** <iphone-5-landscape-width> - <standard-side-margin-width> */
      min-width: calc(568px - 16px * 2);
      width: calc(568px - 16px * 2);
    }

    .datepicker-header + .datepicker-body {
      border-top: 1px solid var(--app-datepicker-separator-color, #ddd);
    }
    :host([landscape]) > .datepicker-header + .datepicker-body {
      border-top: none;
      border-left: 1px solid var(--app-datepicker-separator-color, #ddd);
    }

    .datepicker-header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      position: relative;
      padding: 16px 24px;
    }
    :host([landscape]) > .datepicker-header {
      /** :this.<one-liner-month-day-width> + :this.<side-padding-width> */
      min-width: calc(14ch + 24px * 2);
    }

    .btn__year-selector,
    .btn__calendar-selector {
      color: var(--app-datepicker-selector-color, rgba(0, 0, 0, .55));
      cursor: pointer;
      /* outline: none; */
    }
    .btn__year-selector.selected,
    .btn__calendar-selector.selected {
      color: currentColor;
    }

    /**
      * NOTE: IE11-only fix. This prevents formatted focused date from overflowing the container.
      */
    .datepicker-toolbar {
      width: 100%;
    }

    .btn__year-selector {
      font-size: 16px;
      font-weight: 700;
    }
    .btn__calendar-selector {
      font-size: 36px;
      font-weight: 700;
      line-height: 1;
    }

    .datepicker-body {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .datepicker-body__calendar-view {
      min-height: 56px;
    }

    .calendar-view__month-selector {
      display: flex;
      align-items: center;

      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding: 0 8px;
      z-index: 1;
    }

    .month-selector-container {
      max-height: 56px;
      height: 100%;
    }
    .month-selector-container + .month-selector-container {
      margin: 0 0 0 auto;
    }

    .btn__month-selector {
      padding: calc((56px - 24px) / 2);
      /**
        * NOTE: button element contains no text, only SVG.
        * No extra height will incur with such setting.
        */
      line-height: 0;
    }
    .btn__month-selector > svg {
      fill: currentColor;
    }

    .calendars-container {
      display: flex;
      justify-content: center;

      position: relative;
      top: 0;
      left: calc(-100%);
      width: calc(100% * 3);
      transform: translateZ(0);
      will-change: transform;
      /**
        * NOTE: Required for Pointer Events API to work on touch devices.
        * Native \`pan-y\` action will be fired by the browsers since we only care about the
        * horizontal direction. This is great as vertical scrolling still works even when touch
        * event happens on a datepicker's calendar.
        */
      touch-action: pan-y;
      /* outline: none; */
    }

    .year-list-view__full-list {
      max-height: calc(48px * 7);
      overflow-y: auto;

      scrollbar-color: var(--app-datepicker-scrollbar-thumb-bg-color, rgba(0, 0, 0, .35)) rgba(0, 0, 0, 0);
      scrollbar-width: thin;
    }
    .year-list-view__full-list::-webkit-scrollbar {
      width: 8px;
      background-color: rgba(0, 0, 0, 0);
    }
    .year-list-view__full-list::-webkit-scrollbar-thumb {
      background-color: var(--app-datepicker-scrollbar-thumb-bg-color, rgba(0, 0, 0, .35));
      border-radius: 50px;
    }
    .year-list-view__full-list::-webkit-scrollbar-thumb:hover {
      background-color: var(--app-datepicker-scrollbar-thumb-hover-bg-color, rgba(0, 0, 0, .5));
    }

    .calendar-weekdays > th,
    .weekday-label {
      color: var(--app-datepicker-weekday-color, rgba(0, 0, 0, .55));
      font-weight: 400;
      transform: translateZ(0);
      will-change: transform;
    }

    .calendar-container,
    .calendar-label,
    .calendar-table {
      width: 100%;
    }

    .calendar-container {
      position: relative;
      padding: 0 16px 16px;
    }

    .calendar-table {
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none;

      border-collapse: collapse;
      border-spacing: 0;
      text-align: center;
    }

    .calendar-label {
      display: flex;
      align-items: center;
      justify-content: center;

      height: 56px;
      font-weight: 500;
      text-align: center;
    }

    .calendar-weekday,
    .full-calendar__day {
      position: relative;
      width: calc(100% / 7);
      height: 0;
      padding: calc(100% / 7 / 2) 0;
      outline: none;
      text-align: center;
    }
    .full-calendar__day:not(.day--disabled):focus {
      outline: #000 dotted 1px;
      outline: -webkit-focus-ring-color auto 1px;
    }
    :host([showweeknumber]) .calendar-weekday,
    :host([showweeknumber]) .full-calendar__day {
      width: calc(100% / 8);
      padding-top: calc(100% / 8);
      padding-bottom: 0;
    }
    :host([showweeknumber]) th.weekday-label {
      padding: 0;
    }

    /**
      * NOTE: Interesting fact! That is ::after will trigger paint when dragging. This will trigger
      * layout and paint on **ONLY** affected nodes. This is much cheaper as compared to rendering
      * all :::after of all calendar day elements. When dragging the entire calendar container,
      * because of all layout and paint trigger on each and every ::after, this becomes a expensive
      * task for the browsers especially on low-end devices. Even though animating opacity is much
      * cheaper, the technique does not work here. Adding 'will-change' will further reduce overall
      * painting at the expense of memory consumption as many cells in a table has been promoted
      * a its own layer.
      */
    .full-calendar__day:not(.day--empty):not(.day--disabled):not(.weekday-label) {
      transform: translateZ(0);
      will-change: transform;
    }
    .full-calendar__day:not(.day--empty):not(.day--disabled):not(.weekday-label).day--focused::after,
    .full-calendar__day:not(.day--empty):not(.day--disabled):not(.day--focused):not(.weekday-label):hover::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--app-datepicker-accent-color, #1a73e8);
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
    }
    .full-calendar__day:not(.day--empty):not(.day--disabled):not(.weekday-label) {
      cursor: pointer;
      pointer-events: auto;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .full-calendar__day.day--focused:not(.day--empty):not(.day--disabled):not(.weekday-label)::after,
    .full-calendar__day.day--today.day--focused:not(.day--empty):not(.day--disabled):not(.weekday-label)::after {
      opacity: 1;
    }

    .calendar-weekday > .weekday,
    .full-calendar__day > .calendar-day {
      display: flex;
      align-items: center;
      justify-content: center;

      position: absolute;
      top: 5%;
      left: 5%;
      width: 90%;
      height: 90%;
      color: currentColor;
      font-size: 14px;
      pointer-events: none;
      z-index: 1;
    }
    .full-calendar__day.day--today {
      color: var(--app-datepicker-accent-color, #1a73e8);
    }
    .full-calendar__day.day--focused,
    .full-calendar__day.day--today.day--focused {
      color: var(--app-datepicker-focused-day-color, #fff);
    }
    .full-calendar__day.day--empty,
    .full-calendar__day.weekday-label,
    .full-calendar__day.day--disabled > .calendar-day {
      pointer-events: none;
    }
    .full-calendar__day.day--disabled:not(.day--today) {
      color: var(--app-datepicker-disabled-day-color, rgba(0, 0, 0, .55));
    }

    .year-list-view__list-item {
      position: relative;
      width: 100%;
      padding: 12px 16px;
      text-align: center;
      /** NOTE: Reduce paint when hovering and scrolling, but this increases memory usage */
      /* will-change: opacity; */
      /* outline: none; */
    }
    .year-list-view__list-item::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--app-datepicker-focused-year-bg-color, #000);
      opacity: 0;
      pointer-events: none;
    }
    .year-list-view__list-item:focus::after {
      opacity: .05;
    }
    .year-list-view__list-item.year--selected {
      color: var(--app-datepicker-accent-color, #1a73e8);
      font-size: 24px;
      font-weight: 500;
    }

    @media (any-hover: hover) {
      .btn__month-selector:hover,
      .year-list-view__list-item:hover {
        cursor: pointer;
      }
      .full-calendar__day:not(.day--empty):not(.day--disabled):not(.day--focused):not(.weekday-label):hover::after {
        opacity: .15;
      }
      .year-list-view__list-item:hover::after {
        opacity: .05;
      }
    }

    @supports (background: -webkit-canvas(squares)) {
      .calendar-container {
        padding: 56px 16px 16px;
      }

      table > caption {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
        will-change: transform;
      }
    }
    `,
];
__decorate([
    property({ type: Number, reflect: true })
], Datepicker.prototype, "firstDayOfWeek", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], Datepicker.prototype, "showWeekNumber", void 0);
__decorate([
    property({ type: String, reflect: true })
], Datepicker.prototype, "weekNumberType", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], Datepicker.prototype, "landscape", void 0);
__decorate([
    property({ type: String, reflect: true })
], Datepicker.prototype, "startView", null);
__decorate([
    property({ type: String, reflect: true })
], Datepicker.prototype, "min", null);
__decorate([
    property({ type: String, reflect: true })
], Datepicker.prototype, "max", null);
__decorate([
    property({ type: String })
], Datepicker.prototype, "value", null);
__decorate([
    property({ type: String })
], Datepicker.prototype, "locale", void 0);
__decorate([
    property({ type: String })
], Datepicker.prototype, "disabledDays", void 0);
__decorate([
    property({ type: String })
], Datepicker.prototype, "disabledDates", void 0);
__decorate([
    property({ type: String })
], Datepicker.prototype, "weekLabel", void 0);
__decorate([
    property({ type: Boolean })
], Datepicker.prototype, "inline", void 0);
__decorate([
    property({ type: Number })
], Datepicker.prototype, "dragRatio", void 0);
__decorate([
    property({ type: Date, attribute: false })
], Datepicker.prototype, "_selectedDate", void 0);
__decorate([
    property({ type: Date, attribute: false })
], Datepicker.prototype, "_focusedDate", void 0);
__decorate([
    property({ type: String, attribute: false })
], Datepicker.prototype, "_startView", void 0);
__decorate([
    query('.year-list-view__full-list')
], Datepicker.prototype, "_yearViewFullList", void 0);
__decorate([
    query('.btn__year-selector')
], Datepicker.prototype, "_buttonSelectorYear", void 0);
__decorate([
    query('.year-list-view__list-item')
], Datepicker.prototype, "_yearViewListItem", void 0);
__decorate([
    eventOptions({ passive: true })
], Datepicker.prototype, "_updateYear", null);
__decorate([
    eventOptions({ passive: true })
], Datepicker.prototype, "_updateFocusedDateWithKeyboard", null);
