"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./fs/server");
server_1.startServer({
    path: process.env.KONFFI || process.cwd(),
    port: 3000
});
//# sourceMappingURL=server.js.map