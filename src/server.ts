import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import {select, search, genre, download} from './routes'

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({extended: true}))
const files = path.join(__dirname, 'files')
if (!fs.existsSync(files)) {
    fs.mkdirSync(files);
}
app.use(express.static(files))

app.use('/select', select)
app.use('/search', search)
app.use('/genre', genre)
app.use('/download', download)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static( 'client/dist' ))
  app.get('*', (req,res) => {
      res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'))
  })
}
app.listen(process.env.PORT || PORT, () => {
  console.log(`⚡️[server]: Server is running at ${PORT} port`)
})


