import store from '@/store'
import axios from 'axios'
import gsap from 'gsap'


export const download = (props: any):void => {
    gsap.fromTo('.downloads-loader', {scale: 0}, {scale: 1})
    axios.post(`${process.env.VUE_APP_URL || ''}/download`, {title: props.title, author: props.author, language: props.language})
        .then(res => {
            if (!Object.keys(res.data.downloads)) {
                gsap.timeline()
                    .to('.downloads-loader', {scale: 0})
                    .to('.downloads', {height: 0})
            }
            else  {
                store.setDownloads(res.data.downloads)
                setTimeout(() => {
                    gsap.timeline()
                        .to('.downloads-loader', {scale: 0})
                        .to('.downloads-link', {scale: 1})
                }, 100)
                
            }
                    
        })
}
