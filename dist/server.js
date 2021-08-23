"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const routes_1 = require("./routes");
const app = express_1.default();
const PORT = process.env.PORT || 8000;
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const files = path_1.default.join(__dirname, 'files');
if (!fs_1.default.existsSync(files)) {
    fs_1.default.mkdirSync(files);
}
app.use(express_1.default.static(files));
app.use('/select', routes_1.select);
app.use('/search', routes_1.search);
app.use('/genre', routes_1.genre);
app.use('/download', routes_1.download);
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static('client/dist'));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '..', 'client', 'dist', 'index.html'));
    });
}
app.listen(process.env.PORT || PORT, () => {
    console.log(`⚡️[server]: Server is running at ${PORT} port`);
});
