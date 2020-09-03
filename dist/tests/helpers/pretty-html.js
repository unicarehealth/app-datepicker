import pretty from 'pretty';
export function prettyHtml(content) {
    return pretty(content.raw ?
        String.raw(content) :
        content, { ocd: true });
}
