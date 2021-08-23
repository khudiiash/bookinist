"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const request_1 = __importDefault(require("request"));
const cheerio_1 = __importDefault(require("cheerio"));
const flibusta = __importStar(require("flibusta-api"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const isRu_1 = __importDefault(require("../utils/isRu"));
const cyrillic_to_translit_js_1 = __importDefault(require("cyrillic-to-translit-js"));
const ru = new cyrillic_to_translit_js_1.default();
function authorMatch(a, b) {
    const A = a.toLowerCase().replace(/[^a-zA-Zа-яА-Я\s]|\n/g, '').split(' ').filter(w => w.length > 1);
    const B = b.toLowerCase().replace(/[^a-zA-Zа-яА-Я\s]|\n/g, '').split(' ').filter(w => w.length > 1);
    return A.some(w => B.some(bw => w === bw));
}
function deleteFiles(title, formats, time = 30) {
    setTimeout(() => {
        for (let format of formats) {
            fs_1.default.unlink(`../files/${title}.${format}`, () => console.log(`../files/${title}.${format} is deleted`));
        }
    }, time * 1000);
}
function clearTitle(title) {
    return title.replace(/(?:\.\s.*$|\s\(.*\)$|\s\[.*\]$)/g, '').replace(/\’/g, "'").toLocaleLowerCase().trim();
}
exports.default = express_1.Router().post('/', function (req, res) {
    const reqTitle = clearTitle(req.body.title);
    const reqAuthor = req.body.author;
    const downloads = {};
    if (isRu_1.default(reqTitle) || isRu_1.default(reqAuthor)) {
        const ORIGIN = 'http://flibusta.is';
        flibusta.searchBooks(reqTitle)
            .then(r => {
            const book = r.find(book => clearTitle(book.title) === reqTitle);
            if (!book) {
                res.json({ downloads });
                return;
            }
            const id = book.id;
            const transTitle = ru.transform(book.title, '_');
            const fb2 = fs_1.default.createWriteStream('../files/' + transTitle + '.fb2');
            const mobi = fs_1.default.createWriteStream('../files/' + transTitle + '.mobi');
            const epub = fs_1.default.createWriteStream('../files/' + transTitle + '.epub');
            request_1.default.get(`${ORIGIN}/b/${id}/fb2`, (e, r, b) => {
                http_1.default.get(r.request.uri.href, response => {
                    response.pipe(fb2);
                    fb2.on('finish', () => res.json({ downloads: {
                            fb2: `/${transTitle}.fb2`,
                            mobi: `/${transTitle}.mobi`,
                            epub: `/${transTitle}.epub`
                        } }));
                    deleteFiles(transTitle, ['fb2', 'mobi', 'epub']);
                });
            });
            setTimeout(() => request_1.default.get(`${ORIGIN}/b/${id}/mobi`, (e, r, b) => {
                http_1.default.get(r.request.uri.href, response => {
                    response.pipe(mobi);
                });
            }), 100);
            setTimeout(() => request_1.default.get(`${ORIGIN}/b/${id}/epub`, (e, r, b) => {
                http_1.default.get(r.request.uri.href, response => {
                    response.pipe(epub);
                });
            }), 200);
        });
    }
    else {
        const queryTitle = reqTitle.replace(/\s/g, '+').replace(/'/g, '%27');
        const query = `https://libgen.is/search.php?req=${queryTitle}&open=0&res=100&view=simple&phrase=1&column=title`;
        request_1.default(query, (err, r, body) => {
            const $ = cheerio_1.default.load(body);
            const downloads = {};
            const books = [];
            $('tr[valign]').each((i, item) => {
                if (i === 0)
                    return;
                let [id, author, title, publisher, year, pages, language, size, extension] = $(item).find('td').toArray().map((val, i) => {
                    return i === 2 ? $(val).find('a[title]').clone().children().remove().end().text().trim() : $(val).text();
                });
                const normSize = !/Mb/.test(size) || /Mb/.test(size) && parseInt(size) < 10;
                const url = $(item).find('td:nth-child(10) a').first().attr('href');
                title = title.replace(/(?:\.\s.*$|\s\(.*\)|\:\s.*$$)/g, '').replace(/\’/g, "'");
                if (authorMatch(author, reqAuthor) && title.toLowerCase() === reqTitle.toLowerCase() && url && !books.some(b => b.extension === extension) && /epub|fb2|mobi|pdf/.test(extension) && normSize) {
                    books.push({ url, extension, title });
                }
            });
            let downloaded = 0;
            if (!books.length) {
                res.json({ downloads });
                return;
            }
            for (let i = 0; i < books.length; i++) {
                const { url, extension } = books[i];
                setTimeout(() => request_1.default(url, (e, r, b) => {
                    const $ = cheerio_1.default.load(b);
                    const dl = $('#download a').first().attr('href');
                    const transTitle = ru.transform(reqTitle, "_");
                    const fileName = transTitle + '.' + extension;
                    const file = fs_1.default.createWriteStream('../files/' + fileName);
                    deleteFiles(transTitle, [extension]);
                    if (dl) {
                        http_1.default.get(dl, response => {
                            response.pipe(file);
                            file.on('finish', () => {
                                downloads[extension] = '/' + fileName;
                                downloaded += 1;
                                if (books.length === downloaded) {
                                    res.json({ downloads });
                                }
                            });
                        });
                    }
                }), i * 100);
            }
        });
    }
});
