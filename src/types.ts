export interface AuthorDetials {
    born?: string
    died?: string
    twitter?: string
    website?: string
    genre?: string
    influences?: string
    books?: SearchBook[]
}

export interface Genre {
    title: string
    url?: string
    amount?: number
    categories?: []
}
export interface Review {
    name: string
    date: string
    text: string
}
export interface Info {
    [key: string]: string
}
export interface DownloadLinks {
    [link: string]: string
}
export  interface Book {
    title: string
    author: string
    cover: string
    description: string
    info: Info
    authorBio: string
    authorPhoto: string
    authorLink: string
    authorBooks?: any[]
    reviews: Review[]
    year: string
    genres: Genre[]
    similars: any[]
    downloadLinks?: DownloadLinks
}

export interface SearchBook {
    title: string
    author: string
    url: string 
    cover: string
}

export interface SimilarBook {
    title: string
    author: string
    url?: string 
    cover?: string
    description?: string
}