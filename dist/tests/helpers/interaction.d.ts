import type { Datepicker } from '../../datepicker.js';
interface OptionsDragTo {
    x: number;
    y: number;
    dx?: number;
    dy?: number;
    dx2?: number;
    dy2?: number;
    step?: number;
    type?: 'mouse' | 'touch';
}
export interface DragOptions extends Partial<Omit<OptionsDragTo, 'dx' | 'dy' | 'dx2' | 'dy2'>> {
    x2?: number;
    y2?: number;
}
export interface InteractionOption {
    elementName: string;
    elementName2?: string;
    isSafari?: boolean;
}
export declare const interaction: (options: InteractionOption) => {
    browserKeys: (keyCode: number, altKey?: boolean) => Promise<any>;
    clickElements: (classes: string[], prepareOptions?: Partial<Record<"props" | "attrs", Partial<Pick<Datepicker, "max" | "landscape" | "value" | "locale" | "disabledDates" | "disabledDays" | "firstDayOfWeek" | "min" | "showWeekNumber" | "weekLabel" | "weekNumberType" | "startView" | "inline" | "dragRatio" | "datepickerBodyCalendarView" | "calendarsContainer">>>> | undefined) => Promise<void>;
    dragCalendarsContainer: (options: DragOptions, prepareOptions?: Partial<Record<"props" | "attrs", Partial<Pick<Datepicker, "max" | "landscape" | "value" | "locale" | "disabledDates" | "disabledDays" | "firstDayOfWeek" | "min" | "showWeekNumber" | "weekLabel" | "weekNumberType" | "startView" | "inline" | "dragRatio" | "datepickerBodyCalendarView" | "calendarsContainer">>>> | undefined) => Promise<string>;
    focusCalendarsContainer: (prepareOptions?: Partial<Record<"props" | "attrs", Partial<Pick<Datepicker, "max" | "landscape" | "value" | "locale" | "disabledDates" | "disabledDays" | "firstDayOfWeek" | "min" | "showWeekNumber" | "weekLabel" | "weekNumberType" | "startView" | "inline" | "dragRatio" | "datepickerBodyCalendarView" | "calendarsContainer">>>> | undefined) => Promise<string>;
};
export {};
//# sourceMappingURL=interaction.d.ts.map