export function sanitizeText(content, options) {
    const { showFocused, showPart, showRole, showTabindex, showToday, } = options !== null && options !== void 0 ? options : {};
    let content2 = content;
    if (!(showFocused !== null && showFocused !== void 0 ? showFocused : true)) {
        content2 = content2.replace(/(\s?day--focused|day--focused\s?)/gi, '');
    }
    if (!(showPart !== null && showPart !== void 0 ? showPart : false)) {
        content2 = content2.replace(/(\s?part=".+?"|part=".+?"\s?)/gi, '');
    }
    if (!(showRole !== null && showRole !== void 0 ? showRole : false)) {
        content2 = content2.replace(/(\s?role=".+?"|role=".+?"\s?)/gi, '');
    }
    if (!(showTabindex !== null && showTabindex !== void 0 ? showTabindex : false)) {
        content2 = content2.replace(/(\s?tabindex=".+?"|tabindex=".+?"\s?)/gi, '');
    }
    if (!(showToday !== null && showToday !== void 0 ? showToday : false)) {
        content2 = content2.replace(/(\s?day--today|day--today\s?)/gi, '');
    }
    return content2
        .replace(/(?:aria-selected="(.+?)").*?(?:aria-label="(.+?)")/gi, (_, p1, p2) => `aria-label="${p2}" aria-selected="${p1}"`)
        .replace(/(?:aria-label="(.+?)").*?(?:abbr="(.+?)")/gi, (_, p1, p2) => `abbr="${p2}" aria-label="${p1}"`)
        .replace(/<!---->/g, '')
        .replace(/\r?\n/gi, '')
        .replace(/(\s?style-scope app-datepicker\s?)/gi, '')
        .replace(/(\s?scope="row"|scope="row"\s?)/g, '')
        .replace(/(\s?class=""|class=""\s?)/g, '')
        .replace(/(\s?style=""|style=""\s?)/g, '');
}
