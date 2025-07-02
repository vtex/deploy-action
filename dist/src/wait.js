"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = wait;
const tslib_1 = require("tslib");
function wait(milliseconds) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            if (isNaN(milliseconds)) {
                throw new Error('milliseconds not a number');
            }
            setTimeout(() => resolve('done!'), milliseconds);
        });
    });
}
//# sourceMappingURL=wait.js.map