"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Doremifa = require("doremifa");
var UI = require("./editors/ui");
var ACE = require("./editors/ace");
var API = require("./editors/api");
var main_1 = require("./editors/main");
Doremifa.setState({
    editors: {
        "tables": UI.tablesView,
        "boxes": UI.boxesView,
        "tsconfig": UI.tsConfigView,
        "package": function (state) {
            ACE.updateAceEditor(API.getCurrentFile());
            return Doremifa.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n<div>Editor for package.json</div>  \n", "\n        "], ["\n<div>Editor for package.json</div>  \n", "\n        "])), ACE.getACETemplate());
        }
    }
});
main_1.initialize();
var templateObject_1;
//# sourceMappingURL=client.js.map