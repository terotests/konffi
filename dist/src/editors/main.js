"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Doremifa = require("doremifa");
var api_1 = require("./api");
var axios_1 = require("axios");
var ace_1 = require("./ace");
var ace_2 = require("./ace");
Doremifa.setState({
    editors: {},
    loaded: false,
    files: []
});
var html = Doremifa.html;
var setState = Doremifa.setState;
var getState = Doremifa.getState;
function showFolders(state) {
    var _this = this;
    var currFolder = api_1.getCurrentFolder();
    if (!currFolder)
        return html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<div></div>"], ["<div></div>"])));
    var files = currFolder.files;
    var sorter = function (a, fn) { return a.slice().sort(fn); };
    return html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n\n  <button onclick=", ">/</button>\n  <!-- the fields -->\n\n  <div>", "\n  </div>\n  "], ["\n\n  <button onclick=",
        ">/</button>\n  <!-- the fields -->\n\n  <div>",
        "\n  </div>\n  "])), function () {
        window.location.hash = '#file/folderid/' + state.activeProject.folder.id;
    }, sorter(files, function (a, b) {
        if (a.is_file)
            return 1;
        return -1;
    }).map(function (item) {
        return html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      <div \n        class=", "\n        onclick=", ">", "</div>\n    "], ["\n      <div \n        class=", "\n        onclick=",
            ">", "</div>\n    "])), item.typename, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //  && state.currentFileID !== item.id
                if (item.is_file) {
                    // Move to the file...
                    window.location.hash = '#file/fileid/' + item.id + "/folderid/" + currFolder.id;
                }
                if (item.is_folder) {
                    window.location.hash = '#file/folderid/' + item.id;
                }
                return [2 /*return*/];
            });
        }); }, item.name);
    }));
}
exports.showFolders = showFolders;
var readProjectFolder = function (project, path) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default.post('/folder/' + project.id, {
                    path: path
                })];
            case 1: return [2 /*return*/, (_a.sent()).data];
        }
    });
}); };
var height = window.innerHeight;
var debounce = function (delay, fn) {
    var iv = null;
    return function () {
        if (iv)
            clearTimeout(iv);
        iv = setTimeout(function () {
            fn();
        }, delay);
    };
};
var refreshData = function () { return __awaiter(_this, void 0, void 0, function () {
    var _a, projectList, proj;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, axios_1.default.get('/projects')];
            case 1:
                projectList = (_b.sent()).data;
                setState({ projectList: projectList });
                setState({ currentProject: projectList[0] });
                return [4 /*yield*/, readProjectFolder(projectList[0], '/')];
            case 2:
                proj = _b.sent();
                setState({
                    activeProject: {
                        folder: proj
                    },
                    currentFileID: 0,
                    files: [],
                    projectFolders: __assign({}, getState().projectFolders, (_a = {}, _a[projectList[0].id] = proj, _a.activeProject = {
                        folder: proj
                    }, _a))
                });
                if (!getState().params.folderid)
                    window.location.hash = '#file/folderid/' + proj.id;
                setState({ loaded: true });
                return [2 /*return*/];
        }
    });
}); };
var loadEditor = debounce(200, function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, refreshData()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// The Ace editor container..
var aceContainer = html(templateObject_4 || (templateObject_4 = __makeTemplateObject(["<div class=\"editor\" id=\"editorHolder\"\n  style=", "></div>"], ["<div class=\"editor\" id=\"editorHolder\"\n  style=", "></div>"])), "flex:1;height:" + window.innerHeight).onReady(function (tpl) {
    var aceHolder = ace_1.getAceHolder();
    tpl.ids.editorHolder.appendChild(aceHolder.aceDOMContainer);
});
var defaultEditor = (function (state) {
    return html(templateObject_5 || (templateObject_5 = __makeTemplateObject(["<div>", "</div>"], ["<div>", "</div>"])), aceContainer);
});
var editorArea = function (state) {
    if (!state.loaded) {
        return html(templateObject_6 || (templateObject_6 = __makeTemplateObject(["<div>Loading...</div>"], ["<div>Loading...</div>"])));
    }
    var fileMeta = api_1.getFileMetadata();
    var editorName = (fileMeta && fileMeta.editor) || '';
    var editorFn = state.editors[editorName] || defaultEditor;
    // update the ace
    ace_2.updateAceEditor(api_1.getCurrentFile());
    return html(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n<div style=", ">\n  <div>\n    <button onclick=", ">Save Me!</button>\n\n    <button onclick=", ">Save info of current file</button>\n\n    <button onclick=", " >Refresh</button>\n\n  </div>\n  ", " \n</div>\n  "], ["\n<div style=", ">\n  <div>\n    <button onclick=",
        ">Save Me!</button>\n\n    <button onclick=",
        ">Save info of current file</button>\n\n    <button onclick=",
        " >Refresh</button>\n\n  </div>\n  ", " \n</div>\n  "])), "flex:1;height:" + window.innerHeight, function () { return __awaiter(_this, void 0, void 0, function () {
        var currentFile, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentFile = api_1.getCurrentFile();
                    if (!currentFile) return [3 /*break*/, 2];
                    return [4 /*yield*/, axios_1.default.post('/savefile/' + state.currentProject.id, {
                            path: currentFile.path,
                            content: currentFile.contents
                        })];
                case 1:
                    res = _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, function () { return __awaiter(_this, void 0, void 0, function () {
        var curr, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    curr = api_1.getCurrentFile();
                    return [4 /*yield*/, axios_1.default.post('/savefile/' + state.currentProject.id, {
                            path: '/.fmeta/' + curr.path + '.fmeta',
                            content: JSON.stringify({
                                info: 'Saved info about ' + curr.name
                            })
                        })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // setState({})
            refreshData();
            return [2 /*return*/];
        });
    }); }, editorFn(state)).onReady(function (tpl) {
    });
};
exports.initialize = function () {
    Doremifa.mount(document.body, function (state) { return html(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  <div style=\"display:flex;\">\n    <div class=\"filebrowser\">\n      ", "\n    </div>\n    ", "\n  </div>"], ["\n  <div style=\"display:flex;\">\n    <div class=\"filebrowser\">\n      ",
        "\n    </div>\n    ", "\n  </div>"])), Doremifa.router({
        file: showFolders
    }), editorArea(state)).onReady(loadEditor); });
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=main.js.map