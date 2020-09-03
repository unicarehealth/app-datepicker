"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wdio_config_js_1 = require("./wdio.config.js");
const baseCapability = {
    browserVersion: 'latest',
    'sauce:options': {
        build: new Date().toJSON(),
        screenResolution: '800x600',
        seleniumVersion: '3.141.59',
    },
    specs: ['./dist/tests/**/*.spec.js'],
    browserName: 'googlechrome',
    platformName: 'windows 10',
};
const sauceLabsUser = process.env.SAUCE_USERNAME || '';
const sauceLabsAccessKey = process.env.SAUCE_ACCESS_KEY || '';
exports.config = Object.assign(Object.assign({}, wdio_config_js_1.config), { services: ['sauce'], specs: [], region: 'us', user: sauceLabsUser, key: sauceLabsAccessKey, sauceConnect: true, sauceConnectOpts: {
        user: sauceLabsUser,
        accessKey: sauceLabsAccessKey,
    }, capabilities: [
        Object.assign(Object.assign({}, baseCapability), { browserName: 'safari', platformName: 'macos 10.13', 'sauce:options': Object.assign(Object.assign({}, baseCapability['sauce:options']), { screenResolution: '1024x768' }) }),
        Object.assign(Object.assign({}, baseCapability), { browserName: 'microsoftedge', browserVersion: '18' }),
    ] });
