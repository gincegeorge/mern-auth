import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/userRouter.js'
import morgan from 'morgan'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import path from 'path'

dotenv.config()
connectDb()

const port = process.env.PORT || 6000

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('tiny'))

app.use('/api/users/', userRoutes)


if (process.env.ENVIRONMENT === 'production') {
    console.log('production');
    const __dirname = path.resolve()
    console.log(__dirname);
    app.use(express.static(path.join(__dirname, 'frontend/dist')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    })
} else {
    console.log('developement');
    app.get('/', (req, res) => res.send("working"))
}

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`${process.env.ENVIRONMENT} server started on port ${port}`)) 