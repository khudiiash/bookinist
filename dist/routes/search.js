"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const cheerio_1 = __importDefault(require("cheerio"));
const request_1 = __importDefault(require("request"));
const express_1 = __importDefault(require("express"));
const isRu_1 = __importDefault(require("../utils/isRu"));
exports.default = express_1.default.Router().post('/', (req, res) => {
    if (isRu_1.default(req.body.query)) {
        request_1.default(`https://www.litres.ru/pages/rmd_search_arts/?q=${encodeURI(req.body.query)}`, (err, r, body) => {
            const $ = cheerio_1.default.load(body);
            const ORIGIN = 'https://www.litres.ru';
            const books = $('div[data-type="art"]').toArray().map((item, i) => {
                var _a;
                const title = $(item).find('.art-item__name a').first().text();
                const url = ORIGIN + $(item).find('.art-item__name a').first().attr('href');
                const author = $(item).find('.art-item__author_label').first().text();
                const cover = (_a = $(item).find('img.cover_img').first().attr('src')) === null || _a === void 0 ? void 0 : _a.replace('cover_120', 'cover_330');
                console.log({ title, url, author, cover });
                return { title, url, author, cover };
            });
            res.json({ books });
        });
    }
    else {
        const ORIGIN = 'https://www.goodreads.com';
        const query = req.body.query.replace(/\s/g, '+').toLowerCase();
        let url = `https://www.goodreads.com/search?q=${query}&qid=`;
        request_1.default({ headers: utils_1.headers.goodreads, uri: url }, (e, r, body) => {
            const $ = cheerio_1.default.load(body);
            const books = $('tr').toArray().map((item, i) => {
                var _a;
                return {
                    title: $(item).find('.bookTitle span').text(),
                    url: ORIGIN + $(item).find('.bookTitle').attr('href'),
                    cover: (_a = $(item).find('.bookCover').attr('src')) === null || _a === void 0 ? void 0 : _a.replace(/\.?_?S\w\d+_/g, ''),
                    author: $(item).find('.authorName span[itemprop="name"]').first().text()
                };
            });
            res.json({ books });
        });
    }
});
