"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Doremifa = require("doremifa");
var html = Doremifa.html;
var setState = Doremifa.setState;
var getState = Doremifa.getState;
// function to find certain files from the filesystem
exports.forFiles = function (root, fn) {
    fn(root);
    root.files.forEach(function (f) { return exports.forFiles(f, fn); });
};
exports.findRoot = function () {
    var state = getState();
    var res = null;
    try {
        return state.projectFolders[state.currentProject.id];
    }
    catch (e) {
        console.error(e);
    }
    return res;
};
exports.collect = function (fn) {
    var res = [];
    try {
        // reads the active project files...
        exports.forFiles(getState().activeProject.folder, function (file) {
            if (fn(file, exports.getFileMetadata(file)))
                res.push(file);
        });
    }
    catch (e) {
    }
    return res;
};
exports.forDirectory = function (fn) {
    var state = getState();
    var walk = function (f) {
        fn(f);
        f.files.forEach(walk);
    };
    walk(state.activeProject.folder);
};
exports.findFile = function (id) {
    var state = getState();
    if (!state.activeProject)
        return null;
    var found = null;
    var walk = function (f) {
        if (found)
            return;
        if (f.id === id)
            found = f;
        f.files.forEach(walk);
    };
    walk(state.activeProject.folder);
    return found;
};
exports.getCurrentFolder = function () {
    return exports.findFile(getState().params.folderid);
};
exports.getCurrentFile = function () {
    return exports.findFile(getState().params.fileid);
};
exports.getFileMetadata = function (theFile) {
    var metaData = null;
    var state = getState();
    theFile = theFile || exports.getCurrentFile();
    if (!theFile)
        return null;
    var metaname = '/.fmeta' + theFile.path + '.fmeta';
    exports.forFiles(state.activeProject.folder, function (f) {
        if (f.path === metaname) {
            metaData = JSON.parse(f.contents);
        }
    });
    return metaData;
};
//# sourceMappingURL=api.js.map