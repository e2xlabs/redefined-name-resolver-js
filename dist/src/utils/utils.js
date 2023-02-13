"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmail = exports.EMAIL_REGEX = void 0;
exports.EMAIL_REGEX = /^[\w\d~!$%^&*_=+}{'?\-.]+@((?!_)[\w\d\-.])*\.[\w\d]+$/;
const isEmail = (domain) => {
    return exports.EMAIL_REGEX.test(domain);
};
exports.isEmail = isEmail;
//# sourceMappingURL=utils.js.map