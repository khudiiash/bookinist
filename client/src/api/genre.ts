import store from '@/store'
import axios from 'axios'

export const genre = (url: string) => {
        store.hideBookScreen()
        axios.post(`/genre`, {url})
        .then(res => {
            store.setSearchResult(res.data.books)
            store.showSearchScreen()
        })
        .catch(err => console.log(err))
    } 