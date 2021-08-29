import store from '@/store'
import axios from 'axios'
import gsap from 'gsap'
import api from '.'

interface SelectParam {
    url: string
    title: string
    cover: string
    author: string
}
export const select = (props:SelectParam):void => {
    const {url, title, cover, author} = props
    store.state.downloads = {}
    store.state.similars = []
    axios.post(`${process.env.VUE_APP_URL || ''}/select`, {url, title, cover, author})
    .then(res => {
        store.state.isLoading = false
        const {title, author, cover, description, authorPhoto, authorBio, authorBooks, info, year, genres, reviews, similars, downloadLinks} = res.data
        if (author) store.setAuthor({name: author, photo: authorPhoto, bio: authorBio, books: authorBooks})
        if (info) store.setInfo(info)
        store.setBook({title, cover, author, description, year, genres, reviews, downloadLinks: downloadLinks || {}})
        store.setSimilars(similars)
        store.hideSearchScreen()
        gsap.to('.main', {scrollTo: {y: 0}})
        
        const language = info['Edition Langauge'] || info['Langauge'] || /[а-я]/.test(title) ? 'Russian' : 'English'
        api.download({title, author, language: language})
        setTimeout(() => {
            gsap.set('.author-bio', {overflow: 'hidden'})
            const title = document.querySelector('.center .book-title') as HTMLElement
            if (title.scrollWidth > title.offsetWidth) {
                const distance = title.scrollWidth
                const {length} = title.textContent
                const speed = 200 - length
                const time = distance / speed
                gsap.to(title, time, {scrollTo: {x: 'max'}, delay: 3, yoyo: true, repeat: -1, repeatDelay: 2, ease: 'none'})
            }
            store.animateBookScreen()
        }, 100)
    })
}