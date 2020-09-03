var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import '@material/mwc-button/mwc-button.js';
import { css, html, LitElement, property, query } from 'lit-element';
import { datepickerVariables } from './common-styles.js';
import './custom_typings.js';
import { animateElement } from './helpers/animate-element.js';
import { dispatchCustomEvent } from './helpers/dispatch-custom-event.js';
import { getResolvedDate } from './helpers/get-resolved-date.js';
import { getResolvedLocale } from './helpers/get-resolved-locale.js';
import { setFocusTrap } from './helpers/set-focus-trap.js';
import { toFormattedDateString } from './helpers/to-formatted-date-string.js';
export class DatepickerDialog extends LitElement {
    constructor() {
        super(...arguments);
        this.firstDayOfWeek = 0;
        this.showWeekNumber = false;
        this.weekNumberType = 'first-4-day-week';
        this.landscape = false;
        this.startView = 'calendar';
        this.value = toFormattedDateString(getResolvedDate());
        this.locale = getResolvedLocale();
        this.disabledDays = '';
        this.weekLabel = 'Wk';
        this.dragRatio = .15;
        this.clearLabel = 'clear';
        this.dismissLabel = 'cancel';
        this.confirmLabel = 'set';
        this.noFocusTrap = false;
        this.alwaysResetValue = false;
        this._hasNativeWebAnimation = 'animate' in HTMLElement.prototype;
        this._opened = false;
    }
    static get styles() {
        return [
            datepickerVariables,
            css `
      :host {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: var(--app-datepicker-dialog-z-index, 24);
        -webkit-tap-highlight-color: rgba(0,0,0,0);
      }

      .scrim,
      .content-container {
        pointer-events: auto;
      }

      .scrim {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--app-datepicker-dialog-scrim-bg-color, rgba(0, 0, 0, .55));
        visibility: hidden;
        z-index: 22;
      }

      .content-container {
        position: absolute;
        top: 50%;
        left: 50%;
        max-width: 100%;
        max-height: 100%;
        background-color: var(--app-datepicker-bg-color, #fff);
        transform: translate3d(-50%, -50%, 0);
        border-radius: var(--app-datepicker-dialog-border-radius, 8px);
        will-change: transform, opacity;
        overflow: hidden;
        visibility: hidden;
        opacity: 0;
        z-index: 23;
        box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14),
                    0 9px 46px 8px rgba(0, 0, 0, 0.12),
                    0 11px 15px -7px rgba(0, 0, 0, 0.4);
      }

      .datepicker {
        --app-datepicker-border-top-left-radius: 8px;
        --app-datepicker-border-top-right-radius: 8px;
      }

      .actions-container {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        margin: 0;
        padding: 12px;
        background-color: inherit;
        --mdc-theme-primary: var(--app-datepicker-accent-color, #1a73e8);
      }

      mwc-button[dialog-confirm] {
        margin: 0 0 0 8px;
      }

      .clear {
        margin: 0 auto 0 0;
      }

      /**
       * NOTE: IE11-only fix via CSS hack.
       * Visit https://bit.ly/2DEUNZu|CSS for more relevant browsers' hacks.
       */
      @media screen and (-ms-high-contrast: none) {
        mwc-button[dialog-dismiss] {
          min-width: 10ch;
        }
      }
      `,
        ];
    }
    async open() {
        await this.updateComplete;
        if (this._opened)
            return;
        this.removeAttribute('aria-hidden');
        this.style.display = 'block';
        this._opened = true;
        if (this.alwaysResetValue && this._datepicker)
            this._datepicker.value = this.value;
        await this.requestUpdate();
        const contentContainer = this._contentContainer;
        this._scrim.style.visibility = contentContainer.style.visibility = 'visible';
        await animateElement(contentContainer, {
            hasNativeWebAnimation: this._hasNativeWebAnimation,
            keyframes: [
                { opacity: '0' },
                { opacity: '1' },
            ],
        });
        contentContainer.style.opacity = '1';
        const focusable = this._focusable;
        if (!this.noFocusTrap) {
            this._focusTrap = setFocusTrap(this, [focusable, this._dialogConfirm]);
        }
        focusable.focus();
        dispatchCustomEvent(this, 'datepicker-dialog-opened', {
            firstFocusableElement: focusable,
            opened: true,
            value: this.value,
        });
    }
    async close(supplyValueWithEvent = true) {
        await this.updateComplete;
        if (!this._opened)
            return;
        this._opened = false;
        this._scrim.style.visibility = '';
        const contentContainer = this._contentContainer;
        await animateElement(contentContainer, {
            hasNativeWebAnimation: this._hasNativeWebAnimation,
            keyframes: [
                { opacity: '1' },
                { opacity: '0' },
            ],
        });
        contentContainer.style.opacity =
            contentContainer.style.visibility = '';
        this.setAttribute('aria-hidden', 'true');
        this.style.display = 'none';
        if (!this.noFocusTrap)
            this._focusTrap.disconnect();
        dispatchCustomEvent(this, 'datepicker-dialog-closed', { opened: false, value: supplyValueWithEvent ? this.value : '' });
    }
    shouldUpdate() {
        return !this.hasAttribute('aria-hidden');
    }
    firstUpdated() {
        this.setAttribute('role', 'dialog');
        this.setAttribute('aria-label', 'datepicker');
        this.setAttribute('aria-modal', 'true');
        this.setAttribute('aria-hidden', 'true');
        this.addEventListener('keyup', (ev) => {
            if (ev.keyCode === 27)
                this._dismiss();
        });
        dispatchCustomEvent(this, 'datepicker-dialog-first-updated', {
            value: this.value,
            firstFocusableElement: this._focusable,
        });
    }
    _getUpdateComplete() {
        const datepicker = this._datepicker;
        return (datepicker ? datepicker.updateComplete : Promise.resolve()).then(() => super._getUpdateComplete());
    }
    render() {
        return html `
    <div class="scrim" part="scrim" @click="${this._dismiss}"></div>

    ${this._opened ? html `<div class="content-container" part="dialog-content">
    <app-datepicker class="datepicker"
      .min="${this.min}"
      .max="${this.max}"
      .firstDayOfWeek="${this.firstDayOfWeek}"
      .showWeekNumber="${this.showWeekNumber}"
      .weekNumberType="${this.weekNumberType}"
      .disabledDays="${this.disabledDays}"
      .disabledDates="${this.disabledDates}"
      .landscape="${this.landscape}"
      .locale="${this.locale}"
      .startView="${this.startView}"
      .value="${this.value}"
      .weekLabel="${this.weekLabel}"
      .dragRatio="${this.dragRatio}"
      @datepicker-first-updated="${this._setFocusable}"
      @datepicker-value-updated="${this._updateWithKey}"></app-datepicker>

      <div class="actions-container" part="actions">
        <mwc-button class="clear" part="clear" @click="${this._setToday}">${this.clearLabel}</mwc-button>

        <mwc-button part="dismiss" dialog-dismiss @click="${this._dismiss}">${this.dismissLabel}</mwc-button>
        <mwc-button part="confirm" dialog-confirm @click="${this._update}">${this.confirmLabel}</mwc-button>
      </div>
    </div>` : null}
    `;
    }
    _padStart(val) {
        return `0${val}`.slice(-2);
    }
    _setToday() {
        const today = getResolvedDate();
        const fy = today.getFullYear();
        const m = today.getMonth();
        const d = today.getDate();
        this._datepicker.value = [`${fy}`].concat([1 + m, d].map(this._padStart)).join('-');
    }
    _updateValue() {
        this.value = this._datepicker.value;
    }
    _update() {
        this._updateValue();
        return this.close(true);
    }
    _dismiss() {
        return this.close(false);
    }
    _updateWithKey(ev) {
        const { isKeypress, keyCode } = ev.detail;
        if (!isKeypress || keyCode !== 13 && keyCode !== 32)
            return;
        return this._update();
    }
    _setFocusable(ev) {
        this._focusable = ev.detail && ev.detail.firstFocusableElement;
        this._updateValue();
    }
    get _datepicker() {
        return this.shadowRoot.querySelector('.datepicker');
    }
    get _scrim() {
        return this.shadowRoot.querySelector('.scrim');
    }
}
__decorate([
    property({ type: Number, reflect: true })
], DatepickerDialog.prototype, "firstDayOfWeek", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], DatepickerDialog.prototype, "showWeekNumber", void 0);
__decorate([
    property({ type: String, reflect: true })
], DatepickerDialog.prototype, "weekNumberType", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], DatepickerDialog.prototype, "landscape", void 0);
__decorate([
    property({ type: String, reflect: true })
], DatepickerDialog.prototype, "startView", void 0);
__decorate([
    property({ type: String, reflect: true })
], DatepickerDialog.prototype, "min", void 0);
__decorate([
    property({ type: String, reflect: true })
], DatepickerDialog.prototype, "max", void 0);
__decorate([
    property({ type: String })
], DatepickerDialog.prototype, "value", void 0);
__decorate([
    property({ type: String })
], DatepickerDialog.prototype, "locale", void 0);
__decorate([
    property({ type: String })
], DatepickerDialog.prototype, "disabledDays", void 0);
__decorate([
    property({ type: String })
], DatepickerDialog.prototype, "disabledDates", void 0);
__decorate([
    property({ type: String })
], DatepickerDialog.prototype, "weekLabel", void 0);
__decorate([
    property({ type: Number })
], DatepickerDialog.prototype, "dragRatio", void 0);
__decorate([
    property({ type: String })
], DatepickerDialog.prototype, "clearLabel", void 0);
__decorate([
    property({ type: String })
], DatepickerDialog.prototype, "dismissLabel", void 0);
__decorate([
    property({ type: String })
], DatepickerDialog.prototype, "confirmLabel", void 0);
__decorate([
    property({ type: Boolean })
], DatepickerDialog.prototype, "noFocusTrap", void 0);
__decorate([
    property({ type: Boolean })
], DatepickerDialog.prototype, "alwaysResetValue", void 0);
__decorate([
    query('.content-container')
], DatepickerDialog.prototype, "_contentContainer", void 0);
__decorate([
    query('mwc-button[dialog-confirm]')
], DatepickerDialog.prototype, "_dialogConfirm", void 0);
