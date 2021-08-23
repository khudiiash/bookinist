import store from '@/store'
import axios from 'axios'
import gsap from 'gsap'

export const search = (query: string) => {
        axios.post(`${process.env.VUE_APP_URL || ''}/search`, {query})
        .then(res => {
            if (store.state.shouldSearchAbort) return
            store.state.isLoading = false
            if (res?.data?.books && res?.data?.books?.length) {
                const {books} = res.data
                if (store.state.searchResult !== books) store.setSearchResult(books)
                store.showSearchScreen()
            }
        })
        .catch(err => console.log(err))    
}
