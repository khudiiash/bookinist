import {Router, Request, Response, json, response} from 'express'
import request from 'request'
import cheerio from 'cheerio'
import * as flibusta from 'flibusta-api'
import http from 'http'
import fs from 'fs'
import isRu from '../utils/isRu'
import cyrillicToTranslit from 'cyrillic-to-translit-js'
const ru = new cyrillicToTranslit();

function authorMatch(a:string,b:string):boolean {
    const A = a.toLowerCase().replace(/[^a-zA-Zа-яА-Я\s]|\n/g,'').split(' ').filter(w => w.length > 1)
    const B = b.toLowerCase().replace(/[^a-zA-Zа-яА-Я\s]|\n/g,'').split(' ').filter(w => w.length > 1)
    return A.some(w => B.some(bw => w === bw))
}

function deleteFiles(title: string, formats: string[], time: number = 60 * 60) { // Delete in 60 minutes
    setTimeout(() => {
        for (let format of formats) {
            fs.unlink(`../files/${title}.${format}`, () => console.log(`../files/${title}.${format} is deleted`))
        }
    }, time * 1000)
}
function clearTitle(title: string):string {
    return title.replace(/(?:\.\s.*$|\s\(.*\)$|\s\[.*\]$)/g, '').replace(/\’/g, "'").toLocaleLowerCase().trim()
}

export default Router().post('/', function (req: Request, res: Response) {
    const reqTitle = clearTitle(req.body.title)
    const reqAuthor = req.body.author
    const downloads:any = {}
    if (isRu(reqTitle) || isRu(reqAuthor)) {
        const ORIGIN = 'http://flibusta.is';
        flibusta.searchBooks(reqTitle)
            .then(r => {
                const book = r.find(book => clearTitle(book.title) === reqTitle)
                if (!book) {
                    res.json({downloads})
                    return
                }
                const id = book.id
                const transTitle = ru.transform(book.title, '_')
                const fb2 = fs.createWriteStream('../files/' + transTitle + '.fb2')
                const mobi = fs.createWriteStream('../files/' + transTitle + '.mobi')
                const epub = fs.createWriteStream('../files/' + transTitle + '.epub')

                request.get(`${ORIGIN}/b/${id}/fb2`, (e,r,b) => {
                    http.get(r.request.uri.href, response => {
                        response.pipe(fb2)
                        fb2.on('finish', () => res.json({downloads: {
                            fb2: `/${transTitle}.fb2`,
                            mobi: `/${transTitle}.mobi`,
                            epub: `/${transTitle}.epub`
                        }}))
                        deleteFiles(transTitle, ['fb2', 'mobi', 'epub'])
                    })
                })
               
                setTimeout(() => request.get(`${ORIGIN}/b/${id}/mobi`, (e,r,b) => {
                    http.get(r.request.uri.href, response => {
                        response.pipe(mobi)
                    })
                }), 100)
                setTimeout(() => request.get(`${ORIGIN}/b/${id}/epub`, (e,r,b) => {
                    http.get(r.request.uri.href, response => {
                        response.pipe(epub)
                    })
                }), 200)
            })
    } else {   
        const queryTitle = reqTitle.replace(/\s/g,'+').replace(/'/g,'%27')
        const query = `https://libgen.is/search.php?req=${queryTitle}&open=0&res=100&view=simple&phrase=1&column=title`
        request(query, (err: any, r: any, body: any ) => {
            const $ = cheerio.load(body)
            const downloads:any = {}
            const books:any[] = []
            $('tr[valign]').each((i: number, item: cheerio.Element) => {
                if (i === 0) return
                let [id, author, title, publisher, year, pages, language, size, extension] = $(item).find('td').toArray().map((val, i) => {
                    return i === 2 ? $(val).find('a[title]').clone().children().remove().end().text().trim() : $(val).text()
                })
                const normSize = !/Mb/.test(size) || /Mb/.test(size) && parseInt(size) < 10
                const url = $(item).find('td:nth-child(10) a').first().attr('href')
                title = title.replace(/(?:\.\s.*$|\s\(.*\)|\:\s.*$$)/g, '').replace(/\’/g, "'")
                if (authorMatch(author, reqAuthor) && title.toLowerCase() === reqTitle.toLowerCase() && url && !books.some(b => b.extension === extension) && /epub|fb2|mobi|pdf/.test(extension) && normSize) {
                    books.push({url, extension, title})
                } 
            })
            let downloaded = 0
            if (!books.length) {
                res.json({downloads})
                return
            }
            for (let i = 0; i < books.length; i++) {
                const{url, extension} = books[i]
                setTimeout(() =>
                request(url, (e:any,r:any,b:any) => {
                    const $ = cheerio.load(b)
                    const dl = $('#download a').first().attr('href')
                    const transTitle = ru.transform(reqTitle, "_")
                    const fileName = transTitle + '.' + extension
                    const file = fs.createWriteStream('../files/' + fileName)
                    deleteFiles(transTitle, [extension])
                    if (dl) {
                        http.get(dl, response => {
                            response.pipe(file)
                            file.on('finish', () => {
                                downloads[extension] = '/' + fileName
                                downloaded += 1
                                if (books.length === downloaded) {
                                    res.json({downloads})
                                }
                            })
                        })
                    }
              }), i * 100)
            }
        })
    }
})
