import store from '@/store'
import axios from 'axios'
import gsap from 'gsap/all'

export const genre = (url: string) => {
        store.hideBookScreen()
        store.state.isLoading = true
        gsap.set('.search-column', {opacity: 0})
        axios.post(`/genre`, {url})
        .then(res => {
            store.setSearchResult(res.data.books)
            store.showSearchScreen()
            store.state.isLoading = false
        })
        .catch(err => console.log(err))
    } 