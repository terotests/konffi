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
var _1 = require(".");
var html = Doremifa.html;
var setState = Doremifa.setState;
var getState = Doremifa.getState;
exports.tablesView = function (state) {
    var file = _1.getCurrentFile();
    if (!file)
        return html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<div></div>"], ["<div></div>"])));
    var data = JSON.parse(file.contents);
    return html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n<div>\n    <h4>Tables editor</h4>\n    <div>\n      <button onclick=", ">+ row</button>\n    </div>\n    ", "\n</div>    \n    "], ["\n<div>\n    <h4>Tables editor</h4>\n    <div>\n      <button onclick=",
        ">+ row</button>\n    </div>\n    ",
        "\n</div>    \n    "])), function () {
        data.push({ name: 'new row' });
        setState({ currentFile: __assign({}, file, { contents: JSON.stringify(data, null, 2) }) });
    }, data.map(function (row) {
        return html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<div>", "</div>"], ["<div>", "</div>"])), JSON.stringify(row));
    }));
};
// simple "boxes" -editor...
exports.boxesView = function (state) {
    var file = _1.getCurrentFile();
    // load items...
    if (!state.editorFilePath || state.editorFilePath !== file.path) {
        setState({
            editorFilePath: file.path,
            data: JSON.parse(file.contents)
        });
        return html(templateObject_4 || (templateObject_4 = __makeTemplateObject(["<div></div>"], ["<div></div>"])));
    }
    var dragged = null;
    var draggedItem = null;
    return html(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n<div>\n    <h4>SVG boxes editor</h4>\n    Filename : ", "\n    <div>\n    <button onclick=", ">+ box</button>\n    <button onclick=", ">Update</button>\n     ", "\n\n      ", " \n    x\n    ", "\n\n  ", "\n\n    </div>\n    <div>\n    <svg width=", " height=", "\n        onmousemove=", "\n        onmouseup=", "\n        onmouseleave=", "\n      >\n      ", "\n    </svg>\n    </div>\n\n</div>    \n    "], ["\n<div>\n    <h4>SVG boxes editor</h4>\n    Filename : ", "\n    <div>\n    <button onclick=",
        ">+ box</button>\n    <button onclick=",
        ">Update</button>\n     ",
        "\n\n      ",
        " \n    x\n    ",
        "\n\n  ",
        "\n\n    </div>\n    <div>\n    <svg width=", " height=", "\n        onmousemove=",
        "\n        onmouseup=",
        "\n        onmouseleave=",
        "\n      >\n      ",
        "\n    </svg>\n    </div>\n\n</div>    \n    "])), file.path, function () {
        var items = state.data.items;
        items.push({ x: 10, y: 10, width: 100, height: 100, color: "green" });
        setState({});
    }, function () {
        var currFile = _1.getCurrentFile();
        currFile.contents = JSON.stringify(state.data, null, 2);
        setState({});
    }, state.activeItem ? html(templateObject_5 || (templateObject_5 = __makeTemplateObject(["<input type=\"color\" value=", " \n        onchange=", "\n      />"], ["<input type=\"color\" value=", " \n        onchange=",
        "\n      />"])), state.activeItem.color, function (e) {
        if (e.target.value) {
            state.activeItem.color = e.target.value;
            setState({});
        }
    }) : '', state.activeItem ? html(templateObject_6 || (templateObject_6 = __makeTemplateObject(["<input style=\"width:60px;\" value=", " \n      onkeyup=", "\n    />"], ["<input style=\"width:60px;\" value=", " \n      onkeyup=",
        "\n    />"])), state.activeItem.width, function (e) {
        if (e.target.value) {
            state.activeItem.width = parseInt(e.target.value);
            setState({});
        }
    }) : '', state.activeItem ? html(templateObject_7 || (templateObject_7 = __makeTemplateObject(["<input style=\"width:60px;\" value=", " \n    onkeyup=", "\n  />"], ["<input style=\"width:60px;\" value=", " \n    onkeyup=",
        "\n  />"])), state.activeItem.height, function (e) {
        if (e.target.value) {
            state.activeItem.height = parseInt(e.target.value);
            setState({});
        }
    }) : '', state.activeItem ? html(templateObject_8 || (templateObject_8 = __makeTemplateObject(["<input style=\"width:60px;\" value=", " \n  onkeyup=", "\n/>"], ["<input style=\"width:60px;\" value=", " \n  onkeyup=",
        "\n/>"])), state.activeItem.opacity || 0.5, function (e) {
        if (e.target.value) {
            state.activeItem.opacity = parseFloat(e.target.value);
            setState({});
        }
    }) : '', state.data.width, state.data.height, function (e) {
        if (state.draggedItem) {
            var dx = e.pageX - state.dragStart.mx;
            var dy = e.pageY - state.dragStart.my;
            state.draggedItem.x = state.dragStart.itemx + dx;
            state.draggedItem.y = state.dragStart.itemy + dy;
            setState({});
        }
    }, function () {
        setState({ draggedItem: null });
    }, function () {
        setState({ draggedItem: null });
    }, state.data.items.map(function (item) { return html(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n          <rect x=", " y=", " onmousedown=", " width=", " height=", " fill=", " opacity=", "></rect>\n        "], ["\n          <rect x=", " y=", " onmousedown=",
        " width=", " height=", " fill=", " opacity=", "></rect>\n        "])), item.x, item.y, function (e) {
        // mark item as dragged
        if (!state.draggedItem) {
            console.log(e);
            setState({
                draggedItem: item,
                activeItem: item,
                dragStart: {
                    itemx: item.x,
                    itemy: item.y,
                    mx: e.pageX,
                    my: e.pageY
                }
            });
        }
    }, item.width, item.height, item.color, item.opacity || 0.5); }));
};
exports.tsConfigView = function (state) {
    var file = state.currentFile;
    // These items should be in the state...
    var dragged = null;
    var draggedItem = null;
    return html(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n<div>\n    <h4>TypeScript configuration</h4>\n    Filename : ", "\n    <div>\n    <svg width=\"300\" height=\"300\"\n        onmousemove=", "\n        onmouseup=", "\n        onmouseleave=", "\n      >\n      ", "\n    </svg>\n    </div>\n\n</div>    \n    "], ["\n<div>\n    <h4>TypeScript configuration</h4>\n    Filename : ", "\n    <div>\n    <svg width=\"300\" height=\"300\"\n        onmousemove=",
        "\n        onmouseup=",
        "\n        onmouseleave=",
        "\n      >\n      ",
        "\n    </svg>\n    </div>\n\n</div>    \n    "])), file.path, function (e) {
        if (state.draggedItem) {
            var dx = e.pageX - state.dragStart.mx;
            var dy = e.pageY - state.dragStart.my;
            state.draggedItem.x = state.dragStart.itemx + dx;
            state.draggedItem.y = state.dragStart.itemy + dy;
            setState({});
        }
    }, function () {
        setState({ draggedItem: null });
    }, function () {
        setState({ draggedItem: null });
    }, state.items.map(function (item) { return html(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n          <rect x=", " y=", " onmousedown=", " width=", " height=", " fill=", " opacity=\"0.4\"></rect>\n        "], ["\n          <rect x=", " y=", " onmousedown=",
        " width=", " height=", " fill=", " opacity=\"0.4\"></rect>\n        "])), item.x, item.y, function (e) {
        // mark item as dragged
        if (!state.draggedItem) {
            console.log(e);
            setState({ draggedItem: item, dragStart: {
                    itemx: item.x,
                    itemy: item.y,
                    mx: e.pageX,
                    my: e.pageY
                } });
        }
    }, item.width, item.height, item.color); }));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
//# sourceMappingURL=ui.js.map