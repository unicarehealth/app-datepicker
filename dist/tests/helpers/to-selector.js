export function toSelector(selector) {
    return [
        `.calendar-container:nth-of-type(2)`,
        selector,
    ].join(' ');
}
