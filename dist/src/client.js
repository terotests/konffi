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
var axios_1 = require("axios");
var editors_1 = require("./editors");
var UI = require("./editors/ui");
var html = Doremifa.html;
var setState = Doremifa.setState;
var getState = Doremifa.getState;
var rootFolder = null;
var createAceContainer = function () {
    var aceDOMContainer = document.createElement('div');
    var aceDOM = document.createElement('div');
    aceDOM.setAttribute('style', 'flex:1;');
    aceDOMContainer.setAttribute('style', 'flex:1;display:flex;');
    aceDOMContainer.appendChild(aceDOM);
    document.body.appendChild(aceDOMContainer);
    return {
        aceDOMContainer: aceDOMContainer,
        aceDOM: aceDOM
    };
};
var aceHolder = createAceContainer();
Doremifa.setState({
    loaded: false,
    editorBinded: false,
    files: [],
    time: (new Date).toTimeString(),
    // test items from the state
    items: [
        { x: 100, y: 100, color: "blue", width: 100, height: 100 },
        { x: 110, y: 110, color: "red", width: 100, height: 100 },
        { x: 50, y: 50, color: "orange", width: 44, height: 44 },
    ]
});
console.log(JSON.stringify([
    { x: 100, y: 100, color: "blue", width: 100, height: 100 },
    { x: 110, y: 110, color: "red", width: 100, height: 100 },
    { x: 50, y: 50, color: "orange", width: 44, height: 44 },
], null, 2));
// OK, these could be in state too...
var aceEditor = null;
var projectList = null;
var settingValue = false;
var fileIds = {};
// simple example of editors...
var aceState = {
    fileid: '',
};
var updateAceEditor = function () {
    var theFile = editors_1.getCurrentFile();
    if (!theFile)
        return;
    if (theFile.id === aceState.fileid)
        return;
    aceState.fileid = theFile.id;
    var meta = editors_1.getFileMetadata();
    if (meta && meta.editor) {
        aceHolder.aceDOMContainer.style.display = 'none';
    }
    else {
        aceHolder.aceDOMContainer.style.display = 'block';
    }
    var item = theFile;
    if (aceEditor && theFile) {
        aceEditor.setValue(theFile.contents, 1);
        aceEditor.resize();
        settingValue = false;
        // the cursor position for the file ??? 
        if (theFile.cursorPosition) {
            var cursor = theFile.cursorPosition;
            aceEditor.focus();
            aceEditor.gotoLine(cursor.row + 1, cursor.column, true);
        }
        switch (item.exttype) {
            case ".ts":
                aceEditor.session.setMode("ace/mode/typescript");
                break;
            case ".md":
                aceEditor.session.setMode("ace/mode/markdown");
                break;
            default:
                aceEditor.session.setMode("ace/mode/typescript");
        }
        aceEditor.setOptions({
            maxLines: 30
        });
    }
};
var usedEditors = {
    "tables": UI.tablesView,
    "boxes": UI.boxesView,
    "tsconfig": UI.tsConfigView
};
var readProjectFolder = function (project, path) { return __awaiter(_this, void 0, void 0, function () {
    var state, found_1, walk_project_1, rootOf, mapFiles;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                state = getState();
                if (state.projectFolders && state.projectFolders[project.id]) {
                    found_1 = null;
                    walk_project_1 = function (folder) {
                        if (found_1)
                            return;
                        if (folder.path == path) {
                            found_1 = folder;
                        }
                        else {
                            for (var _i = 0, _a = folder.files; _i < _a.length; _i++) {
                                var f = _a[_i];
                                if (f.is_folder)
                                    walk_project_1(f);
                            }
                        }
                    };
                    walk_project_1(state.projectFolders[project.id]);
                    return [2 /*return*/, found_1];
                }
                return [4 /*yield*/, axios_1.default.post('/folder/' + project.id, {
                        path: path
                    })];
            case 1:
                rootOf = (_a.sent()).data;
                mapFiles = function (folder) {
                    fileIds[folder.id] = folder;
                    folder.files.forEach(mapFiles);
                };
                mapFiles(rootOf);
                rootOf.is_read = true;
                return [2 /*return*/, rootOf];
        }
    });
}); };
function showFiles(state) {
    var _this = this;
    var currFolder = fileIds[state.params.folderid];
    if (!currFolder)
        return html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<div></div>"], ["<div></div>"])));
    var files = currFolder.files;
    var sorter = function (a, fn) { return a.slice().sort(fn); };
    return html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n\n  <button onclick=", ">...</button>\n  <!-- the fields -->\n\n  <div>", "\n  </div>\n  "], ["\n\n  <button onclick=",
        ">...</button>\n  <!-- the fields -->\n\n  <div>",
        "\n  </div>\n  "])), function () {
        window.location.hash = '#file/folderid/' + state.activeProject.folder.id;
    }, sorter(files, function (a, b) {
        if (a.is_file)
            return 1;
        return -1;
    }).map(function (item) {
        return html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      <div \n        class=", "\n        onclick=", ">", "</div>\n    "], ["\n      <div \n        class=", "\n        onclick=",
            ">", "</div>\n    "])), item.typename, function () { return __awaiter(_this, void 0, void 0, function () {
            var folder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //  && state.currentFileID !== item.id
                        if (item.is_file) {
                            // Move to the file...
                            window.location.hash = '#file/fileid/' + item.id + "/folderid/" + currFolder.id;
                        }
                        if (!item.is_folder) return [3 /*break*/, 2];
                        return [4 /*yield*/, readProjectFolder(state.currentProject, item.path)];
                    case 1:
                        folder = _a.sent();
                        window.location.hash = '#file/folderid/' + folder.id + "/fileid/" + folder.id;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); }, item.name);
    }));
}
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
var refreshData = debounce(200, function () { return __awaiter(_this, void 0, void 0, function () {
    var _a, projectList, proj, state;
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
                    currentFileID: 0,
                    files: [],
                    projectFolders: __assign({}, getState().projectFolders, (_a = {}, _a[projectList[0].id] = proj, _a.activeProject = {
                        folder: proj
                    }, _a))
                });
                state = getState();
                if (state.currentFile) {
                }
                else {
                }
                window.location.hash = '#file/folderid/' + proj.id;
                setState({ loaded: true });
                return [2 /*return*/];
        }
    });
}); });
var loadEditor = debounce(200, function () { return __awaiter(_this, void 0, void 0, function () {
    var _a, state, projectList, proj, currFolder;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                state = getState();
                return [4 /*yield*/, axios_1.default.get('/projects')];
            case 1:
                projectList = (_b.sent()).data;
                setState({ projectList: projectList });
                setState({ currentProject: projectList[0] });
                return [4 /*yield*/, readProjectFolder(projectList[0], '/')
                    // Set the project folder...
                ];
            case 2:
                proj = _b.sent();
                // Set the project folder...
                setState({
                    activeProject: {
                        folder: proj
                    },
                    projectFolders: __assign({}, getState().projectFolders, (_a = {}, _a[projectList[0].id] = proj, _a))
                });
                currFolder = editors_1.getCurrentFolder();
                if (!state.params.folderid)
                    window.location.hash = '#file/folderid/' + proj.id;
                setState({ loaded: true });
                return [2 /*return*/];
        }
    });
}); });
// The Ace editor container..
var aceContainer = html(templateObject_4 || (templateObject_4 = __makeTemplateObject(["<div class=\"editor\" id=\"editorHolder\"\n  style=", "></div>"], ["<div class=\"editor\" id=\"editorHolder\"\n  style=", "></div>"])), "flex:1;height:" + window.innerHeight).onReady(function (tpl) {
    console.log('container @ ready ');
    console.log(tpl);
    tpl.ids.editorHolder.appendChild(aceHolder.aceDOMContainer);
    if (aceEditor) {
        aceEditor.resize();
    }
    // console.log('onReady at aceContainer ', tpl)
});
// 
var editJSON = function (strdata) {
    var data = JSON.parse(strdata);
    if (Array.isArray(data)) {
        var allKeys_1 = Object.keys(data.reduce(function (prev, curr) {
            return __assign({}, prev, curr);
        }, {}));
        return html(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n<table>\n  <thead>\n    <tr>\n    ", "   \n    </tr>\n  </thead>\n  ", "\n</table>    \n    "], ["\n<table>\n  <thead>\n    <tr>\n    ",
            "   \n    </tr>\n  </thead>\n  ",
            "\n</table>    \n    "])), allKeys_1.map(function (colname) {
            return html(templateObject_5 || (templateObject_5 = __makeTemplateObject(["<td>", "</td>"], ["<td>", "</td>"])), colname);
        }), data.map(function (item) {
            return html(templateObject_8 || (templateObject_8 = __makeTemplateObject(["<tr>\n      ", "\n    </tr>"], ["<tr>\n      ",
                "\n    </tr>"])), allKeys_1.map(function (colname) {
                var c = item[colname];
                if (c.length > 20) {
                    return html(templateObject_6 || (templateObject_6 = __makeTemplateObject(["<td><div class=\"incomplete\">", "...</div></td>"], ["<td><div class=\"incomplete\">", "...</div></td>"])), c.substring(0, 20));
                }
                return html(templateObject_7 || (templateObject_7 = __makeTemplateObject(["<td>", "</td>"], ["<td>", "</td>"])), c);
            }));
        }));
    }
    return html(templateObject_10 || (templateObject_10 = __makeTemplateObject(["<pre>", "</pre>"], ["<pre>", "</pre>"])), JSON.stringify(data, null, 2));
};
// currently default editor === n
var defaultEditor = (function (state) {
    return html(templateObject_11 || (templateObject_11 = __makeTemplateObject(["<div style=\"border:1px solid blue;\">container : ", "</div>"], ["<div style=\"border:1px solid blue;\">container : ", "</div>"])), aceContainer);
});
var editorArea = function (state) {
    if (!state.loaded) {
        return html(templateObject_12 || (templateObject_12 = __makeTemplateObject(["<div>Loading...</div>"], ["<div>Loading...</div>"])));
    }
    var fileMeta = editors_1.getFileMetadata();
    var editorName = (fileMeta && fileMeta.editor) || '';
    var editorFn = usedEditors[editorName] || defaultEditor;
    // update the ace
    updateAceEditor();
    return html(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n<div style=", ">\n  <div>\n    <button onclick=", ">Save Me!</button>\n\n    <button onclick=", ">Save info of current file</button>\n\n    <button onclick=", " >Refresh</button>\n\n  </div>\n  <div>\n    ", "\n  </div>\n  <div>\n    ", "\n  </div>\n    ", " \n</div>\n  "], ["\n<div style=", ">\n  <div>\n    <button onclick=",
        ">Save Me!</button>\n\n    <button onclick=",
        ">Save info of current file</button>\n\n    <button onclick=",
        " >Refresh</button>\n\n  </div>\n  <div>\n    ", "\n  </div>\n  <div>\n    ", "\n  </div>\n    ", " \n</div>\n  "])), "flex:1;height:" + window.innerHeight, function () { return __awaiter(_this, void 0, void 0, function () {
        var currentFile, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentFile = editors_1.getCurrentFile();
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
                    curr = editors_1.getCurrentFile();
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
    }); }, (fileMeta && fileMeta.editor) || 'no editor defined', fileMeta ? fileMeta.info : '', editorFn(state)).onReady(function (tpl) {
    });
};
// main HTML...
// Simple JSON data editor built using doremifa
Doremifa.mount(document.body, function (state) { return html(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n<div style=\"display:flex;\">\n  <div class=\"filebrowser\">\n    ", "\n  </div>\n  ", "\n</div>"], ["\n<div style=\"display:flex;\">\n  <div class=\"filebrowser\">\n    ",
    "\n  </div>\n  ", "\n</div>"])), Doremifa.router({
    file: showFiles
}), editorArea(state)).onReady(loadEditor); });
// setInterval( _ => { setState({time:(new Date).toTimeString()})},1000)  
// Editor must be placed into an existing DOM element
aceEditor = ace.edit(aceHolder.aceDOM);
aceEditor.setTheme("ace/theme/monokai");
aceEditor.session.setMode("ace/mode/typescript");
// problem: also fired when setValue() is called
aceEditor.getSession().on('change', function () {
    var state = Doremifa.getState();
    var strnow = aceEditor.getValue();
    var currentFile = editors_1.getCurrentFile();
    // TODO: handle better...
    if (currentFile && !settingValue) {
        currentFile.contents = strnow;
        currentFile.cursorPosition = aceEditor.getCursorPosition();
        // state.files[currentFile.id].contents = strnow
        // state.files[currentFile.id].cursorPosition = aceEditor.getCursorPosition()
    }
    if (currentFile && !settingValue) {
        setState({ currentFile: __assign({}, state.currentFile, { contents: strnow }) });
    }
    else {
        console.log('did not set state for editor change... settingValue', settingValue);
        console.log(state);
    }
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
//# sourceMappingURL=client.js.map