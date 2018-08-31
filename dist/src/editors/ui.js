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
var html = Doremifa.html;
var setState = Doremifa.setState;
var getState = Doremifa.getState;
exports.tablesView = function (state) {
    var file = api_1.getCurrentFile();
    // setting the state data...
    if (!state.editorFilePath || state.editorFilePath !== file.path) {
        setState({
            editorFilePath: file.path,
            data: JSON.parse(file.contents)
        });
        return html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<div></div>"], ["<div></div>"])));
    }
    // The data of the current item...
    var data = state.data;
    var fields = Object.keys(data.reduce(function (prev, current) {
        return __assign({}, prev, current);
    }, {}));
    file.contents = JSON.stringify(state.data, null, 2);
    // find arrays of primitives...
    var primitives = [];
    api_1.collect(function (file) { return file.name == 'primitives.json'; })
        .forEach(function (file) {
        primitives = primitives.concat(JSON.parse(file.contents));
    });
    return html(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n<div>\n    <h4>", "</h4>\n\n    <button onclick=", ">Search JSON files</button>\n\n    <div>\n      <button onclick=", ">+ row</button>\n    </div>\n\n    <table>\n    <tr>\n      <td></td>\n      ", "\n    </tr>\n    ", "\n    </table>\n</div>    \n    "], ["\n<div>\n    <h4>", "</h4>\n\n    <button onclick=",
        ">Search JSON files</button>\n\n    <div>\n      <button onclick=",
        ">+ row</button>\n    </div>\n\n    <table>\n    <tr>\n      <td></td>\n      ", "\n    </tr>\n    ",
        "\n    </table>\n</div>    \n    "])), file.name, function () {
        // search all files having .json
        console.log(api_1.collect(function (file, meta) {
            if (meta)
                console.log('collect meta ', meta);
            return !!file.path.match('json');
        }));
    }, function () {
        data.push({ name: 'new row', type: 'string', required: '1' });
        setState({});
    }, fields.map(function (f) { return html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<td><b>", "</b></td>"], ["<td><b>", "</b></td>"])), f); }), data.map(function (row, i) {
        return html(templateObject_7 || (templateObject_7 = __makeTemplateObject(["<tr>\n\n        <td><button onclick=", ">x</button></td>\n      \n        ", "</tr>"], ["<tr>\n\n        <td><button onclick=",
            ">x</button></td>\n      \n        ",
            "</tr>"])), function () {
            data.splice(i, 1);
            setState({});
        }, fields.map(function (field) {
            // types from primitives, TODO: modularize
            if (field === 'type') {
                return html(templateObject_5 || (templateObject_5 = __makeTemplateObject(["<td>\n              <select onchange=", ">\n              ", "\n              </select>\n            </td>"], ["<td>\n              <select onchange=",
                    ">\n              ",
                    "\n              </select>\n            </td>"])), function (e) {
                    row[field] = e.target.value;
                }, primitives.map(function (item) {
                    if (item.name === row[field]) {
                        return html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["<option selected value=", ">", "</option>"], ["<option selected value=", ">", "</option>"])), item.name, item.name);
                    }
                    return html(templateObject_4 || (templateObject_4 = __makeTemplateObject(["<option value=", ">", "</option>"], ["<option value=", ">", "</option>"])), item.name, item.name);
                }));
            }
            // different editors for different types, but for now...
            return html(templateObject_6 || (templateObject_6 = __makeTemplateObject(["<td><input value=", " onkeyup=", "/></td>"], ["<td><input value=", " onkeyup=",
                "/></td>"])), row[field], function (e) {
                row[field] = e.target.value;
                setState({});
            });
        }));
    }));
};
// simple "boxes" -editor...
exports.boxesView = function (state) {
    var file = api_1.getCurrentFile();
    // load items...
    if (!state.editorFilePath || state.editorFilePath !== file.path) {
        setState({
            editorFilePath: file.path,
            data: JSON.parse(file.contents)
        });
        return html(templateObject_9 || (templateObject_9 = __makeTemplateObject(["<div></div>"], ["<div></div>"])));
    }
    var dragged = null;
    var draggedItem = null;
    return html(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n<div>\n    <h4>SVG boxes editor</h4>\n    Filename : ", "\n    <div>\n    <button onclick=", ">+ box</button>\n    <button onclick=", ">Update</button>\n     ", "\n\n      ", " \n    x\n    ", "\n\n  ", "\n\n    </div>\n    <div>\n    <svg width=", " height=", "\n        onmousemove=", "\n        onmouseup=", "\n        onmouseleave=", "\n      >\n      ", "\n    </svg>\n    </div>\n\n</div>    \n    "], ["\n<div>\n    <h4>SVG boxes editor</h4>\n    Filename : ", "\n    <div>\n    <button onclick=",
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
        var currFile = api_1.getCurrentFile();
        currFile.contents = JSON.stringify(state.data, null, 2);
        setState({});
    }, state.activeItem ? html(templateObject_10 || (templateObject_10 = __makeTemplateObject(["<input type=\"color\" value=", " \n        onchange=", "\n      />"], ["<input type=\"color\" value=", " \n        onchange=",
        "\n      />"])), state.activeItem.color, function (e) {
        if (e.target.value) {
            state.activeItem.color = e.target.value;
            setState({});
        }
    }) : '', state.activeItem ? html(templateObject_11 || (templateObject_11 = __makeTemplateObject(["<input style=\"width:60px;\" value=", " \n      onkeyup=", "\n    />"], ["<input style=\"width:60px;\" value=", " \n      onkeyup=",
        "\n    />"])), state.activeItem.width, function (e) {
        if (e.target.value) {
            state.activeItem.width = parseInt(e.target.value);
            setState({});
        }
    }) : '', state.activeItem ? html(templateObject_12 || (templateObject_12 = __makeTemplateObject(["<input style=\"width:60px;\" value=", " \n    onkeyup=", "\n  />"], ["<input style=\"width:60px;\" value=", " \n    onkeyup=",
        "\n  />"])), state.activeItem.height, function (e) {
        if (e.target.value) {
            state.activeItem.height = parseInt(e.target.value);
            setState({});
        }
    }) : '', state.activeItem ? html(templateObject_13 || (templateObject_13 = __makeTemplateObject(["<input style=\"width:60px;\" value=", " \n  onkeyup=", "\n/>"], ["<input style=\"width:60px;\" value=", " \n  onkeyup=",
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
    }, state.data.items.map(function (item) { return html(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n          <rect x=", " y=", " onmousedown=", " width=", " height=", " fill=", " opacity=", "></rect>\n        "], ["\n          <rect x=", " y=", " onmousedown=",
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
    return html(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n<div>\n    <h4>TypeScript configuration</h4>\n    Filename : ", "\n    <div>\n    <svg width=\"300\" height=\"300\"\n        onmousemove=", "\n        onmouseup=", "\n        onmouseleave=", "\n      >\n      ", "\n    </svg>\n    </div>\n\n</div>    \n    "], ["\n<div>\n    <h4>TypeScript configuration</h4>\n    Filename : ", "\n    <div>\n    <svg width=\"300\" height=\"300\"\n        onmousemove=",
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
    }, state.items.map(function (item) { return html(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n          <rect x=", " y=", " onmousedown=", " width=", " height=", " fill=", " opacity=\"0.4\"></rect>\n        "], ["\n          <rect x=", " y=", " onmousedown=",
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
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17;
//# sourceMappingURL=ui.js.map