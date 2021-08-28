
import {headers} from '../utils';
import cheerio from 'cheerio';
import request from 'request';
import express, { Request, Response } from 'express';
import isRu from '../utils/isRu'
import { SearchBook } from '../types'


export default express.Router().post('/', (req: Request, res: Response) => {

    if (isRu(req.body.query)) {
        request(`https://www.litres.ru/pages/rmd_search_arts/?q=${encodeURI(req.body.query)}`, (err, r, body) => {
            const $ = cheerio.load(body)
            const ORIGIN = 'https://www.litres.ru'
            const books = $('div[data-type="art"]').toArray().map((item, i) => {
                const title = $(item).find('.art-item__name a').first().text()
                const url = ORIGIN + $(item).find('.art-item__name a').first().attr('href')
                const author = $(item).find('.art-item__author_label').first().text()
                const cover = $(item).find('img.cover_img').first().attr('src')?.replace('cover_120', 'cover_330')
                console.log({title, url, author, cover})
                return {title, url, author, cover} as SearchBook
            })
            res.json({books})
        } )
    } else {
        const ORIGIN = 'https://www.goodreads.com'
        const query = req.body.query.replace(/\s/g, '+').toLowerCase()
        let url = `https://www.goodreads.com/search?q=${query}&qid=`
        request({ headers: headers.goodreads, uri: url }, (e, r, body) => {
            const $ = cheerio.load(body)
            const books = $('tr').toArray().map((item: cheerio.Element,i: number) => {
                return {
                    title: $(item).find('.bookTitle span').text(),
                    url: ORIGIN + $(item).find('.bookTitle').attr('href'),
                    cover: $(item).find('.bookCover').attr('src')?.replace(/\.?_?S\w\d+_/g, ''),
                    author: $(item).find('.authorName span[itemprop="name"]').first().text()
                }
            })
            res.json({ books })
        });

    }
    
})