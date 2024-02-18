"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const path_1 = tslib_1.__importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'index.html'));
});
app.get('/chat', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'dummy.html'));
});
app.get('/solve', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'solve.html'));
});
app.listen(9751, () => {
    console.log('Example app listening on port 3000!');
});
//# sourceMappingURL=dummy.js.map