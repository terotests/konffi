"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Doremifa = require("doremifa");
var UI = require("./editors/ui");
var main_1 = require("./editors/main");
Doremifa.setState({
    editors: {
        "tables": UI.tablesView,
        "boxes": UI.boxesView,
        "tsconfig": UI.tsConfigView
    }
});
main_1.initialize();
//# sourceMappingURL=client.js.map