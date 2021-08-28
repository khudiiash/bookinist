import store from '@/store'
import axios from 'axios'
import gsap from 'gsap'

export const search = (query: string) => {
        axios.post(`${process.env.VUE_APP_URL || ''}/search`, {query})
        .then(res => {
            if (store.state.shouldSearchAbort) return
            store.state.isLoading = false
            const isMobile = window.innerWidth < window.innerHeight
            if (res?.data?.books && res?.data?.books?.length) {
                const {books} = res.data
                console.log(books.length)
                if (store.state.searchResult !== books) store.setSearchResult(books)
                store.showSearchScreen()
                if (isMobile) {
                    gsap.to('.main-header', 1, {marginTop: '40px', ease: 'power2.inOut'})
                }
            }
        })
        .catch(err => console.log(err))    
}
