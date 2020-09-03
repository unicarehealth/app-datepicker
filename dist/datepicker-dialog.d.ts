export interface DatepickerDialogClosed extends Pick<DatepickerDialog, 'value'> {
    opened: boolean;
}
export declare type DatepickerDialogOpened = DatepickerDialogClosed & DatepickerFirstUpdated;
import '@material/mwc-button/mwc-button.js';
import { LitElement } from 'lit-element';
import type { WeekNumberType } from 'nodemod/dist/calendar/calendar_typing.js';
import type { DatepickerFirstUpdated, HTMLElementPart, StartView } from './custom_typings.js';
export declare class DatepickerDialog extends LitElement {
    static get styles(): import("lit-element").CSSResult[];
    firstDayOfWeek: number;
    showWeekNumber: boolean;
    weekNumberType: WeekNumberType;
    landscape: boolean;
    startView: StartView;
    min?: string;
    max?: string;
    value: string;
    locale: string;
    disabledDays: string;
    disabledDates?: string;
    weekLabel: string;
    dragRatio: number;
    clearLabel: string;
    dismissLabel: string;
    confirmLabel: string;
    noFocusTrap: boolean;
    alwaysResetValue: boolean;
    private _contentContainer?;
    private _dialogConfirm?;
    private _hasNativeWebAnimation;
    private _focusable?;
    private _focusTrap?;
    private _opened;
    open(): Promise<void>;
    close(supplyValueWithEvent?: boolean): Promise<void>;
    protected shouldUpdate(): boolean;
    protected firstUpdated(): void;
    protected _getUpdateComplete(): Promise<unknown>;
    protected render(): import("lit-element").TemplateResult;
    private _padStart;
    private _setToday;
    private _updateValue;
    private _update;
    private _dismiss;
    private _updateWithKey;
    private _setFocusable;
    private get _datepicker();
    private get _scrim();
}
declare global {
    interface HTMLElement {
        part: HTMLElementPart;
    }
    interface HTMLElementEventMap {
        'datepicker-dialog-closed': CustomEvent<DatepickerDialogClosed>;
        'datepicker-dialog-first-updated': CustomEvent<DatepickerFirstUpdated>;
        'datepicker-dialog-opened': CustomEvent<DatepickerDialogOpened>;
    }
}
//# sourceMappingURL=datepicker-dialog.d.ts.map