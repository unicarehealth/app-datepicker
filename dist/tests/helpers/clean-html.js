import { prettyHtml } from './pretty-html.js';
import { sanitizeText } from './sanitize-text.js';
export function cleanHtml(s, options) {
    return prettyHtml(sanitizeText(s, options));
}
