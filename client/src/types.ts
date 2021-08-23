export interface AuthorDetails {
   name?: string,
   born?: string,
   died?: string,
   influences?: string,
   genre?: string,
   website?: string,
   books?: Array<Record<string,number>>

}
export interface Author {
   name: string,
   photo: string,
   bio: string,
   details?: AuthorDetails
   books?: Array<Record<string,number>>

}
export interface Category {
    name: string
    link: string
    books: []
}
export interface Genre {
    title?: string
    about?: string
    categories?: Category[]
    books?: []
}
export interface Similar {
   title: string, 
   author: string, 
   cover: string, 
   description: string, 
   url: string
}
export interface Review {
   name: string
   date: string
   text: string
}
export interface Book {
   cover?: string,
   title?: string,
   author?: string,
   year?: string,
   description?: string,
   genres?: Array<Record<string,number>>,
   reviews?: Review[],
   downloadLinks?: Record<string,unknown>,
}

export interface Store {
   [key:string]:any

}
export interface Download {
   [format: string]:string
}

export interface State {
   searchResult: []
   author: {}
   info: {}
   book: {} 
   genre: {} 
   similars: []
   isLoading: boolean
   shouldSearchAbort: boolean,
   bookScreenTimaline: any
}