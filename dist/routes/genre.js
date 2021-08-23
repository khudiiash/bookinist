"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require('../utils');
const cheerio = require('cheerio');
const request = require('request');
const express = require('express');
exports.default = express.Router().post('/', (req, res) => {
    const { url } = req.body;
    if (/litres/.test(url)) {
        request({ uri: url + 'elektronnie-knigi' }, (e, r, html) => {
            const $ = cheerio.load(html);
            const ORIGIN = 'https://www.litres.ru';
            const books = $('.art-standart').toArray().map((el) => {
                const id = $(el).find('.img-a').attr('data-art');
                const author = $(el).find('.art__author a').text();
                const title = $(el).find('.art__name__href').attr('title');
                const url = $(el).find('.art__name__href').attr('href');
                return {
                    title,
                    author,
                    cover: `https://cv1.litres.ru/pub/c/elektronnaya-kniga/cover_415/${id}-${url.replace(/\//g, '-').replace(/\-$/, '')}.jpg`,
                    url: ORIGIN + url,
                };
            });
            res.json({ books });
        });
    }
    else {
        request({ headers: utils.headers.goodreads, uri: url }, (e, r, html) => {
            const $ = cheerio.load(html);
            const books = $('.bookBox').toArray().map((book) => {
                const a = $(book).find('a').first();
                const img = $(book).find('img').first();
                if (!a || !img)
                    return null;
                return {
                    title: $(img).attr('alt'),
                    cover: $(img).attr('src').replace(/\.?_?S\w\d+_/g, ''),
                    url: 'https://www.goodreads.com' + $(a).attr('href'),
                };
            });
            res.json({ books });
        });
    }
});
