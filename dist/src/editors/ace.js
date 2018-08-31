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
Object.defineProperty(exports, "__esModule", { value: true });
var Doremifa = require("doremifa");
var api_1 = require("./api");
var aceState = {
    fileid: '',
};
exports.createAceContainer = function () {
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
// only one ace editor for now...
var aceEditor = null;
var settingValue = false;
var aceHolder = exports.createAceContainer();
exports.getAceHolder = function () {
    return aceHolder;
};
// The ACE editor updater
exports.updateAceEditor = function (theFile) {
    if (!theFile)
        return;
    if (theFile.id === aceState.fileid)
        return;
    aceState.fileid = theFile.id;
    var meta = api_1.getFileMetadata();
    if (meta && meta.editor && !meta.ace) {
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
aceEditor = ace.edit(aceHolder.aceDOM);
aceEditor.setTheme("ace/theme/monokai");
aceEditor.session.setMode("ace/mode/typescript");
aceEditor.getSession().on('change', function () {
    var state = Doremifa.getState();
    var strnow = aceEditor.getValue();
    var currentFile = api_1.getCurrentFile();
    // TODO: handle better...
    if (currentFile && !settingValue) {
        currentFile.contents = strnow;
        currentFile.cursorPosition = aceEditor.getCursorPosition();
        // state.files[currentFile.id].contents = strnow
        // state.files[currentFile.id].cursorPosition = aceEditor.getCursorPosition()
    }
    if (currentFile && !settingValue) {
        Doremifa.setState({ currentFile: __assign({}, state.currentFile, { contents: strnow }) });
    }
    else {
        console.log('did not set state for editor change... settingValue', settingValue);
        console.log(state);
    }
});
// The Ace editor container..
var aceContainer = Doremifa.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<div class=\"editor\" id=\"editorHolder\"\n  style=", "></div>"], ["<div class=\"editor\" id=\"editorHolder\"\n  style=", "></div>"])), "flex:1;height:" + window.innerHeight).onReady(function (tpl) {
    var aceHolder = exports.getAceHolder();
    tpl.ids.editorHolder.appendChild(aceHolder.aceDOMContainer);
});
exports.getACETemplate = function () {
    return aceContainer;
};
var templateObject_1;
//# sourceMappingURL=ace.js.map