"use strict";
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
var ignore_folders = [
    'node_modules',
    '.git'
];
var fileHash = {};
var crypto = require('crypto');
var createHash = function (data) { return crypto.createHash('md5').update(data).digest("hex"); };
var getFile = function (hash) {
    return fileHash[hash];
};
var mkdir = function (path) {
    var fs = require('fs');
    var fPath = require('path');
    var parts = fPath.normalize(path).split('/');
    var curr_path = '';
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var p = parts_1[_i];
        curr_path = curr_path + p + '/';
        if (!fs.existsSync(curr_path)) {
            fs.mkdirSync(curr_path);
        }
    }
};
var projects = [
    { id: '1', name: 'konffi', full_path: '/Users/tero/dev/static/git/konffi/' }
];
function getProjects() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, projects];
        });
    });
}
exports.getProjects = getProjects;
function findProject(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, projects.filter(function (p) { return p.id === id; }).pop()];
        });
    });
}
exports.findProject = findProject;
// TODO: use file ID values
function readFileContent(id) {
    return __awaiter(this, void 0, void 0, function () {
        var fileObj, fs, fsPath;
        return __generator(this, function (_a) {
            fileObj = fileHash[id];
            if (fileObj) {
                fs = require('fs');
                fsPath = require('path');
                return [2 /*return*/, fs.readFileSync(fileObj.full_path, 'utf8')];
            }
            return [2 /*return*/, {
                    text: ''
                }];
        });
    });
}
exports.readFileContent = readFileContent;
var read_dir = function (path, parent, recursive) {
    if (recursive === void 0) { recursive = false; }
    return __awaiter(_this, void 0, void 0, function () {
        var fs, fsPath, res, _i, _a, file, full_path, obj, stat;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fs = require('fs');
                    fsPath = require('path');
                    res = [];
                    _i = 0, _a = fs.readdirSync(path);
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    file = _a[_i];
                    full_path = fsPath.normalize(path + '/' + file);
                    obj = {
                        id: createHash(full_path),
                        name: file,
                        path: '',
                        full_path: full_path,
                        is_file: true,
                        is_folder: false,
                        typename: 'file',
                        exttype: fsPath.extname(full_path),
                        files: []
                    };
                    fileHash[obj.id] = obj;
                    stat = fs.lstatSync(full_path);
                    obj.is_folder = stat.isDirectory();
                    obj.is_file = stat.isFile();
                    obj.typename = obj.is_folder ? 'folder' : 'file';
                    // add the file to the parent folder
                    parent.files.push(obj);
                    if (!(obj.is_folder && recursive)) return [3 /*break*/, 3];
                    return [4 /*yield*/, read_dir(obj.full_path, obj)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: 
                /*
                stats.isFile()
                stats.isDirectory()
                stats.isBlockDevice()
                stats.isCharacterDevice()
                stats.isSymbolicLink() (only valid with fs.lstat())
                stats.isFIFO()
                stats.isSocket()
                */
                return [2 /*return*/, res];
            }
        });
    });
};
function readFolder(path, recursive) {
    if (recursive === void 0) { recursive = false; }
    return __awaiter(this, void 0, void 0, function () {
        var fs, fsPath, root_path, root;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fs = require('fs');
                    fsPath = require('path');
                    root_path = fsPath.normalize(path + '/');
                    root = {
                        id: createHash(root_path),
                        path: '',
                        name: '/',
                        full_path: root_path,
                        is_file: false,
                        is_folder: true,
                        typename: 'folder',
                        exttype: '',
                        files: []
                    };
                    return [4 /*yield*/, read_dir(path, root, recursive)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, root];
            }
        });
    });
}
exports.readFolder = readFolder;
function readDirectory(id) {
    return __awaiter(this, void 0, void 0, function () {
        var fileObj, fs, fsPath;
        return __generator(this, function (_a) {
            fileObj = fileHash[id];
            if (fileObj) {
                fs = require('fs');
                fsPath = require('path');
                return [2 /*return*/, fs.readFileSync(fileObj.full_path, 'utf8')];
            }
            return [2 /*return*/, {
                    text: ''
                }];
        });
    });
}
exports.readDirectory = readDirectory;
var readProjectFolder = function (project, path, recursive, parent) {
    if (recursive === void 0) { recursive = false; }
    return __awaiter(_this, void 0, void 0, function () {
        var fs, fsPath, root_path, root, _i, _a, file, full_path, stat, is_dir, obj;
        return __generator(this, function (_b) {
            fs = require('fs');
            fsPath = require('path');
            root_path = fsPath.normalize(project.full_path + '/' + path + '/');
            root = {
                id: createHash(root_path),
                path: path,
                name: path,
                full_path: root_path,
                is_file: false,
                is_folder: true,
                typename: 'folder',
                exttype: '',
                files: []
            };
            if (parent)
                root = parent;
            for (_i = 0, _a = fs.readdirSync(root_path); _i < _a.length; _i++) {
                file = _a[_i];
                full_path = fsPath.normalize(root_path + '/' + file);
                stat = fs.lstatSync(full_path);
                is_dir = stat.isDirectory();
                obj = {
                    id: createHash(full_path),
                    name: file,
                    path: fsPath.normalize(path + '/' + file),
                    full_path: full_path,
                    is_file: true,
                    is_folder: false,
                    typename: 'file',
                    exttype: fsPath.extname(full_path),
                    files: [],
                    contents: ''
                };
                fileHash[obj.id] = obj;
                obj.is_folder = stat.isDirectory();
                obj.is_file = stat.isFile();
                obj.typename = obj.is_folder ? 'folder' : 'file';
                // read all contents
                if (obj.is_file) {
                    obj.contents = fs.readFileSync(obj.full_path, 'utf8');
                }
                if (ignore_folders.indexOf(obj.name) < 0) {
                    root.files.push(obj);
                }
                if (recursive && obj.is_folder) {
                    // filter node_modules away from this...
                    if (obj.path.indexOf('node_modules') < 0) {
                        readProjectFolder(project, obj.path, recursive, obj);
                    }
                }
            }
            /*
            stats.isFile()
            stats.isDirectory()
            stats.isBlockDevice()
            stats.isCharacterDevice()
            stats.isSymbolicLink() (only valid with fs.lstat())
            stats.isFIFO()
            stats.isSocket()
            */
            return [2 /*return*/, root];
        });
    });
};
// read a directory of a project
function readDir(project, path, recursive) {
    if (recursive === void 0) { recursive = false; }
    return __awaiter(this, void 0, void 0, function () {
        var fsPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fsPath = require('path');
                    return [4 /*yield*/, readProjectFolder(project, fsPath.normalize(path), recursive)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.readDir = readDir;
var _readProjectFile = function (project, path) { return __awaiter(_this, void 0, void 0, function () {
    var fs, fsPath, root_path, full_path;
    return __generator(this, function (_a) {
        fs = require('fs');
        fsPath = require('path');
        root_path = fsPath.normalize(project.full_path + '/' + path);
        full_path = root_path;
        return [2 /*return*/, {
                id: createHash(root_path),
                path: path,
                name: fsPath.basename(path),
                full_path: root_path,
                is_file: true,
                is_folder: false,
                typename: 'file',
                exttype: fsPath.extname(full_path),
                files: [],
                contents: fs.readFileSync(full_path, 'utf8')
            }];
    });
}); };
function readProjectFile(project, path) {
    return __awaiter(this, void 0, void 0, function () {
        var fsPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fsPath = require('path');
                    return [4 /*yield*/, _readProjectFile(project, path)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.readProjectFile = readProjectFile;
// saveProjectFile
var _saveProjectFile = function (project, path, content) { return __awaiter(_this, void 0, void 0, function () {
    var fs, fsPath, root_path;
    return __generator(this, function (_a) {
        console.log('... saving file...');
        fs = require('fs');
        fsPath = require('path');
        root_path = fsPath.normalize(project.full_path + '/' + path);
        // make sure the path does exist...
        mkdir(fsPath.dirname(root_path));
        fs.writeFileSync(root_path, content);
        return [2 /*return*/];
    });
}); };
function saveProjectFile(project, path, content) {
    return __awaiter(this, void 0, void 0, function () {
        var fsPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fsPath = require('path');
                    return [4 /*yield*/, _saveProjectFile(project, path, content)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, _readProjectFile(project, path)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.saveProjectFile = saveProjectFile;
//# sourceMappingURL=server.js.map