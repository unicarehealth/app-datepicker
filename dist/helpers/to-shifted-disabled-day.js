export function toShiftedDisabledDay(firstDayOfWeek, disabledDay) {
    const day = disabledDay - firstDayOfWeek;
    return day < 0 ? 7 + day : day;
}
