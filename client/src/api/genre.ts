import store from '@/store'
import axios from 'axios'
import gsap from 'gsap/all'

export const genre = (url: string) => {
        axios.post(`${process.env.VUE_APP_URL || ''}`, {url})
        .then(res => {
            gsap.set('.search-result', {display: 'flex', autoAlpha: 1})
            store.setSearchResult(res.data.books)
            store.showSearchScreen()

        })
        .catch(err => console.log(err))
    } 