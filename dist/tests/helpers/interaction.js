import { toSelector } from './to-selector.js';
const browserKeys = (elementName) => async (keyCode, altKey = false) => {
    return browser.executeAsync(async (a, b, c, d, done) => {
        const n = document.body.querySelector(a);
        const n2 = n.shadowRoot.querySelector(b);
        const opt = { keyCode: c, altKey: d };
        const ev = new CustomEvent('keyup', opt);
        Object.keys(opt).forEach((o) => {
            Object.defineProperty(ev, o, { value: opt[o] });
        });
        n2.dispatchEvent(ev);
        done();
    }, elementName, '.calendars-container', keyCode, altKey);
};
const clickElements = (elementName, isSafari) => async (classes, prepareOptions) => {
    if (prepareOptions) {
        await browser.executeAsync(async (a, b, done) => {
            const n = document.body.querySelector(a);
            const { props, attrs } = b;
            if (props) {
                Object.keys(props).forEach((o) => {
                    n[o] = props[o];
                });
            }
            if (attrs) {
                Object.keys(attrs).forEach((o) => {
                    n.setAttribute(o.toLowerCase(), String(attrs[o]));
                });
            }
            await n.updateComplete;
            done();
        }, elementName, prepareOptions);
    }
    for (const cls of classes) {
        if (isSafari) {
            await browser.executeAsync(async (a, b, done) => {
                const n = document.body.querySelector(a);
                const n2 = n.shadowRoot.querySelector(b);
                if (n2 instanceof HTMLButtonElement || n2.tagName === 'MWC-BUTTON') {
                    n2.click();
                }
                else {
                    ['touchstart', 'touchend'].forEach((o) => {
                        n2.dispatchEvent(new CustomEvent(o, { bubbles: true, composed: true }));
                    });
                }
                await n.updateComplete;
                done();
            }, elementName, cls);
        }
        else {
            const el = await $(elementName);
            const el2 = (await el.shadow$(cls));
            await el2.click();
        }
    }
};
const focusCalendarsContainer = (elementName) => async (prepareOptions) => {
    return await browser.executeAsync(async (a, b, c, done) => {
        var _a;
        const a1 = document.body.querySelector(a);
        if (c) {
            const { props, attrs } = c;
            if (props) {
                Object.keys(props).forEach((o) => {
                    a1[o] = props[o];
                });
            }
            if (attrs) {
                Object.keys(attrs).forEach((o) => {
                    a1.setAttribute(o.toLowerCase(), String(attrs[o]));
                });
            }
        }
        await a1.updateComplete;
        const b1 = a1.shadowRoot.querySelector(b);
        b1.focus();
        await a1.updateComplete;
        await new Promise(y => setTimeout(() => y(b1.focus())));
        await a1.updateComplete;
        let activeElement = document.activeElement;
        while (activeElement === null || activeElement === void 0 ? void 0 : activeElement.shadowRoot) {
            activeElement = activeElement.shadowRoot.activeElement;
        }
        done(`.${Array.from((_a = activeElement === null || activeElement === void 0 ? void 0 : activeElement.classList.values()) !== null && _a !== void 0 ? _a : []).join('.')}`);
    }, elementName, '.calendars-container', prepareOptions);
};
const dragCalendarsContainer = (elementName, elementName2) => {
    return async (options, prepareOptions) => {
        return browser.executeAsync(async (a, b, c, d, e, f, done) => {
            var _a, _b, _c, _d, _e, _f;
            try {
                const simulateInputEvent = (n, eventName, opts) => {
                    const isPointerEvent = /^pointer/i.test(eventName) &&
                        !('MSPointerEvent' in window) &&
                        !('MSGestureEvent' in window);
                    const otherOptions = {
                        bubbles: true,
                        ...opts,
                    };
                    const ev = isPointerEvent ?
                        new PointerEvent(eventName, otherOptions) :
                        new MouseEvent(eventName, otherOptions);
                    n.dispatchEvent(ev);
                };
                const dragTo = async (target, dragOpts) => {
                    const { x = 0, y = 0, dx = 0, dy = 0, dx2 = 0, dy2 = 0, step = 0, type = 'mouse', } = dragOpts !== null && dragOpts !== void 0 ? dragOpts : {};
                    const isMouse = type === 'mouse';
                    const toPointerEventOptions = (px, py) => {
                        return {
                            clientX: px,
                            pageX: px,
                            offsetX: px,
                            x: px,
                            clientY: py,
                            pageY: py,
                            offsetY: py,
                            y: py,
                        };
                    };
                    const computeSteps = (computeStepsOpts) => {
                        const { ix, iy, xn, yn, stepN, } = computeStepsOpts !== null && computeStepsOpts !== void 0 ? computeStepsOpts : {};
                        const hasX = typeof xn === 'number' && isFinite(xn) && xn !== 0;
                        const hasY = typeof yn === 'number' && isFinite(yn) && yn !== 0;
                        if (!hasX && !hasY)
                            return { x: ix, y: iy, steps: [] };
                        let fx = ix;
                        let fy = iy;
                        const nn = hasX && hasY ? Math.max(xn, yn) : (hasX ? xn : yn);
                        const maxX = ix + nn;
                        const maxY = iy + nn;
                        const total = Math.ceil(Math.abs(nn) / stepN);
                        const factor = nn < 0 ? -1 : 1;
                        const temp = [];
                        for (let i = 0; i <= total; i += 1) {
                            const ni = i * stepN * factor;
                            const mathFn = factor < 0 ? Math.max : Math.min;
                            const nx = hasX ? mathFn(maxX, Math.floor(fx + ni)) : 0;
                            const ny = hasY ? mathFn(maxY, Math.floor(fy + ni)) : 0;
                            if (i === total) {
                                fx = nx;
                                fy = ny;
                            }
                            temp.push([nx, ny]);
                        }
                        return { x: fx, y: fy, steps: temp };
                    };
                    const eachStep = step == null || step <= 0 ? 20 : step;
                    let lastX = x;
                    let lastY = y;
                    let steps = [];
                    for (const [nx, ny] of [
                        [dx, dy],
                        [dx2, dy2],
                    ]) {
                        await new Promise(yay => setTimeout(yay, 500));
                        const results = computeSteps({
                            ix: lastX,
                            iy: lastY,
                            xn: nx,
                            yn: ny,
                            stepN: eachStep,
                        });
                        if (!results.steps.length)
                            continue;
                        lastX = results.x;
                        lastY = results.y;
                        steps = steps.concat(results.steps);
                    }
                    simulateInputEvent(target, isMouse ? 'mousedown' : 'touchstart', toPointerEventOptions(x, y));
                    for (const [nx, ny] of steps) {
                        simulateInputEvent(target, isMouse ? 'mousemove' : 'touchmove', toPointerEventOptions(nx, ny));
                        await new Promise(yay => requestAnimationFrame(yay));
                    }
                    simulateInputEvent(target, isMouse ? 'mouseup' : 'touchend', toPointerEventOptions(lastX, lastY));
                    return {
                        done: true,
                        value: {
                            x: lastX,
                            y: lastY,
                            step: eachStep,
                        },
                    };
                };
                const a1 = document.body.querySelector(a);
                const a2 = b == null ?
                    a1 :
                    a1.shadowRoot.querySelector(b);
                const root = a2.shadowRoot;
                if (f) {
                    const { props, attrs } = f !== null && f !== void 0 ? f : {};
                    if (props) {
                        Object.keys(props).forEach((o) => {
                            a1[o] = props[o];
                        });
                    }
                    if (attrs) {
                        Object.keys(attrs).forEach((o) => {
                            a1.setAttribute(o.toLowerCase(), String(attrs[o]));
                        });
                    }
                }
                if (b)
                    await a2.updateComplete;
                await a1.updateComplete;
                const b1 = root.querySelector(c);
                const a1Rect = a1.getBoundingClientRect();
                const b1Rect = b1.getBoundingClientRect();
                const left = a1Rect.left + (b1Rect.width * (e.x < 0 ? .78 : .22));
                const right = a1Rect.top + (b1Rect.height * .22);
                const transitionComplete = new Promise((yay) => {
                    const timer = setTimeout(() => yay(false), 10e3);
                    const handler = () => {
                        clearTimeout(timer);
                        yay(true);
                        a1.removeEventListener('datepicker-animation-finished', handler);
                    };
                    a1.addEventListener('datepicker-animation-finished', handler);
                });
                await dragTo(b1, {
                    ...e,
                    x: left,
                    y: right,
                    dx: (_a = e === null || e === void 0 ? void 0 : e.x) !== null && _a !== void 0 ? _a : 0,
                    dy: (_b = e === null || e === void 0 ? void 0 : e.y) !== null && _b !== void 0 ? _b : 0,
                    dx2: (_c = e === null || e === void 0 ? void 0 : e.x2) !== null && _c !== void 0 ? _c : 0,
                    dy2: (_d = e === null || e === void 0 ? void 0 : e.y2) !== null && _d !== void 0 ? _d : 0,
                });
                await transitionComplete;
                await a1.updateComplete;
                done((_f = (_e = root.querySelector(d)) === null || _e === void 0 ? void 0 : _e.textContent) !== null && _f !== void 0 ? _f : '');
            }
            catch (err) {
                done(err.stack);
            }
        }, elementName, elementName2, '.calendars-container', toSelector('.calendar-label'), options, prepareOptions);
    };
};
export const interaction = (options) => {
    const { elementName, elementName2, isSafari, } = options !== null && options !== void 0 ? options : {};
    return {
        browserKeys: browserKeys(elementName),
        clickElements: clickElements(elementName, isSafari !== null && isSafari !== void 0 ? isSafari : false),
        dragCalendarsContainer: dragCalendarsContainer(elementName, elementName2),
        focusCalendarsContainer: focusCalendarsContainer(elementName),
    };
};
