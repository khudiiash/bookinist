import { reactive } from 'vue';
import {Author, Book, Genre, Similar, AuthorDetails,Download, Store} from '@/types'
import gsap from 'gsap'

const state = reactive({
   searchResult: [] as Array<Record<string, unknown>>,
   author: {} as Author,
   info: {} as Record<string, null>,
   book: {} as Book,
   genre: {} as Genre,
   similars: [] as Array<Similar>,
   downloads: null,
   isLoading: false as boolean,
   shouldSearchAbort: false as boolean,
   timelines: {} as any
})

const getters = reactive({

})
const actions = {
    animateBookScreen() {
      state.timelines.showBook = gsap.timeline()
         .to('.main', .5, {scrollTo: {y: 0}})
         .fromTo('.book-selected', {autoAlpha: 0}, {autoAlpha: 1, opacity: 1, scale: 1})
         .fromTo('.book-cover', .6, {opacity: 0, y: 35}, {scale: 1, opacity: 1, y: 0}, '<.1')
         .fromTo('.author-photo', .6, {scale: 0}, {scale: 1, opacity: 1, ease: 'back'}, '<.1')
         .fromTo(['.author-name', '.book-title', '.book-year', '.info-header', '.similars-header'], 1, {clipPath: 'inset(0 100% 0 0)'}, {clipPath: 'inset(0 0% 0 0)', stagger: 0}, '<.1')
         .fromTo('.author-bio, .book-description', .6, {opacity: 0, y: 15}, { scale: 1, opacity: 1, y: 0, stagger: .1}, '<.1')
    },
    hideBookScreen() {
      return state.timelines.hideBookScreen = gsap.timeline()
         .to('.book-selected .book-cover', .3, {opacity: 0, y: 15})
         .to('.author-photo', .3, {opacity: 0, scale: .8}, '<.1')
         .to(['.author-name', '.book-title', '.book-year', '.info-header', '.similars-header'], .3, {opacity: 'inset(0 100% 0 0)', stagger: .2}, '<.1')
         .to('.author-bio, .book-description', .3, {opacity: 0, scale: .8}, '<.1')
         .to('.book-selected', .3, {autoAlpha: 0}, '<.1')
    },
    showSearchScreen() {
      return state.timelines.showSearch = gsap.timeline()
          .to('.main', .5, {scrollTo: {y: 0}})
          .set('.search-result', {display: 'flex', autoAlpha: 1}, '<')
          .set('.search-column', {opacity: 1})
          .fromTo('.search-column', 1, {y: '100vh'}, {y: 0, ease: 'power2.out', stagger: .1})
    },
    hideSearchScreen() {
        return state.timelines.hideSearch = gsap.timeline()
          .set('.search-column', {opacity: 0})
          .set('.search-result', {display: 'none'})
    },
    setAuthor(author: Author) {
       state.author = author
    },
    setAuthorDetails(params:AuthorDetails) {
        state.author.books = params.books
        delete params.books
        state.author.details = params
    },
    setBook(book: Book) {
      state.book = book
    },
    setGenre(genre: Genre) {
      state.genre = genre
    },
    setInfo(info: Record<string,null>) {
      state.info = info
   },
    setSimilars(similars: Array<Similar>) {
      state.similars = similars
    },
    setDownloads(downloads: Download) {
      state.downloads = downloads
      if (downloads && !Object.keys(downloads).length) {
        gsap.to('.downloads-loader', {scale: 0})
        gsap.to('.downloads', {height: 0})
      }
    },
    setSearchResult(books: Array<Record<string, unknown>>) {
      state.searchResult = books
    },
    clearBook() {
       state.book = {} as Book
       state.similars = [] as Array<Similar>
       state.author = {} as Author
       state.genre = {} as Genre

    }
      
}
export default { state, getters, ...actions } as Store