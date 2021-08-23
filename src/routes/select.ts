
import cheerio from 'cheerio'
import request from 'request'
import {headers} from '../utils'
import { Request, response, Response, Router } from "express";
import {Info, Genre, Book, Review} from '../types'
import isRu from '../utils/isRu'
export default Router().post('/', function (req: Request, res: Response) {
    const body = req.body as any
    const { url, title, cover, author } = body
    if (!url || !title) return
    if (isRu(title) || isRu(author)) {
        request(url, (err: Error, r: request.Response, body: string) => {
            const $ = cheerio.load(body)
            const ORIGIN = 'https://www.litres.ru'
            const description = $('div[itemprop="description"]').first().html()
            const info = {} as any
            $('.blocks li').each((i: number, e: cheerio.Element) => info[$(e).find('strong').first().text().replace(':','')] = $(e).find('span').length ? $(e).find('span').text() : $(e).clone().children().remove().end().text().trim())
            delete info['Дата выхода на ЛитРес']
            const reviews: Review[] = $('.recense_wrapper').toArray().map((el: cheerio.Element):Review => {
                const date =  $(el).find('.recense__date').text()
                return {
                    name: $(el).find('.recense__info .user-name span').first().text(),
                    date: date.split('').map((ch,i) => {if (date.substring(0,i) === date.substring(i,date.length)) return date.substring(i,date.length)}).find(s => s) || date,
                    text: $(el).find('.recense__text').text()
                } as Review
            }).slice(0,6)
            const year = info['Дата написания']
            const similars = $('.standart-slider .art-standart').toArray().map((item: cheerio.Element, i: number) => {
                const id = $(item).find('.img-a').attr('data-art')
                const url = $(item).find('.img-a').first().attr('href')
                return {
                    cover: `https://cv1.litres.ru/pub/c/elektronnaya-kniga/cover_250/${id}${url?.replace(/\//g, '-').replace(/\-$/, '')}.jpg`, 
                    title: $(item).find('.art__name a').first().text(),
                    author: $(item).find('.art__author a').first().text(),
                    url: ORIGIN + $(item).find('.img-a').first().attr('href')
                }
            })

            const authorBooks = $('#slider-author-books .art-standart').toArray().map((item: cheerio.Element, i: number) => {
                const id = $(item).find('.img-a').attr('data-art')
                const url = $(item).find('.img-a').first().attr('href')
                return {
                    cover: `https://cv1.litres.ru/pub/c/elektronnaya-kniga/cover_250/${id}${url?.replace(/\//g, '-').replace(/\-$/, '')}.jpg`, 
                    title: $(item).find('.art__name a').first().text(),
                    author: $(item).find('.art__author a').first().text(),
                    url: ORIGIN + $(item).find('.img-a').first().attr('href')
                }
            })
            const genres = $('.biblio_book_info a.biblio_info__link').toArray().map((item: cheerio.Element, i: number) => {
                return {
                    title: $(item).text(),
                    url: ORIGIN + $(item).attr('href'),
                    amount: Math.round($('.biblio_book_info a.biblio_info__link').length * 1000 - i * (600 - Math.random() * 100))
                }
            })

            const authorLink = url.replace(/\/[^\/]*\/$/, '/ob-avtore/')

            request(authorLink, (err: Error, r: request.Response, body: string) => {
                const $ = cheerio.load(body)
                const authorBio = $('.person-page__html').first().html()
                const author = $('.author_name h1').first().text()
                const authorPhoto = $('.biblio_author_image img').attr('src')?.startsWith('/') ? ORIGIN + $('.biblio_author_image img').attr('src') : $('.biblio_author_image img').attr('src')
                const book = {
                    title,
                    author,
                    cover,
                    description, 
                    authorBio, 
                    info, 
                    authorPhoto, 
                    authorLink, 
                    authorBooks,
                    reviews,
                    year, 
                    genres, 
                    similars
                } as Book
                res.json(book)
            })
        })
    } else {
        request({ headers: headers.goodreads, uri: url }, (e: Error, r: request.Response, body: string) => {
            const $ = cheerio.load(body)
            const ORIGIN = 'https://www.goodreads.com'
            let authorBio:string = $('.bookAuthorProfile__about span').last().html() as string
            let year = ''
            let description = $('#description span[id^="freeText"]').last().text().replace(/You can find an alternative cover edition for this ISBN here and here\./, '').replace(/\.(?=[А-ЯA-Z])/g, '. ')
            const authorLink = ORIGIN + $('.bookAuthorProfile__name a').first().attr('href')
            const author = $('.bookAuthorProfile__name a').first().text()
            const similars = $('.bookCarousel li.cover').toArray().map((el: cheerio.Element, i: number) => {
                return {
                    url: $(el).find('a').first().attr('href'),
                    cover: $(el).find('img').first().attr('src')?.replace(/\.?_?S\w\d+_/g, ''),
                    title: $(el).find('img').first().attr('alt'),
                }
            })
            $('.row').each((i, e) => {
                const text = $(e).text()
                if (text && /Published/.test(text) && /\d{4}/.test(text)) {
                    const match = text.match(/\d{4}/)
                    if (match?.length) year = match[0]
                }
            })
            const bookAuthorProfilePhoto =  $('.bookAuthorProfile__photo').first()
            const bookAuthorProfilePhotoStyle:string = bookAuthorProfilePhoto.attr('style') || ''
            const authorPhoto = bookAuthorProfilePhotoStyle ? bookAuthorProfilePhotoStyle.replace('background-image: url(', '').replace(');', '') : ''

            const info = {} as Info
            const genres = [] as Genre[]
            const rowItems = $('.infoBoxRowItem')
            const authorBooks = $('.tooltipTrigger').toArray().map((el: cheerio.Element) => {
                return {
                    cover: $(el).find('img').attr('src')?.replace(/\.?_?S\w\d+_/g, ''),
                    title: $(el).find('img').attr('alt'),
                    author: author,
                    url: ORIGIN + $(el).find('a').first().attr('href')
                }
            })

            $('.infoBoxRowTitle').each((i, e) => {
                if (!/Other/.test($(e).text())) info[$(e).text()] = $(rowItems[i]).text().replace(/(?:\n|\+|\s\s|\.\.\.more|…more|\.\.\.less|…less)/g, ' ')
            })
            const genreUsers = $('div.bookPageGenreLink').toArray().map((element: cheerio.Element) => $(element).text().replace(/\n|\s\s| users|\,/g, ''))
            $('.left a.bookPageGenreLink:last-child').each((i: number, e: cheerio.Element) => {
                const genre = {} as Genre
                if (!genres.some(g => g.title === $(e).text().toLowerCase())) {
                    genre.title = $(e).text().toLowerCase()
                    genre.url = ORIGIN + $(e).attr('href')
                    genre.amount = Math.round($('.left a.bookPageGenreLink:last-child').length * 1000 - i * (600 - Math.random() * 100))
                    genres.push(genre)
                }
            })
            if (info.URL) delete info.URL

            const reviews: Review[] = $('.review').toArray().map((el: cheerio.Element):Review => {
                return {
                    name: $(el).find('.user').text(),
                    date: $(el).find('.reviewDate').text(),
                    text: $(el).find('.reviewText span:last-child').text(),
                }
            }).slice(0,6)
            const book:Book = { 
                title,
                author,
                cover,
                description, 
                authorBio, 
                info, 
                authorPhoto, 
                authorLink, 
                authorBooks,
                reviews,
                year, 
                genres, 
                similars
            }
            res.json(book)
        })
    }

})