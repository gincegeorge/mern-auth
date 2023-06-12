import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/userRouter.js'
import morgan from 'morgan'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import connectDb from './config/db.js'

dotenv.config()
connectDb()



const port = process.env.PORT || 6000

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(morgan('tiny'))

app.use('/api/users/', userRoutes)

app.get('/', (req, res) => res.send("working"))


app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`${process.env.ENVIRONMENT} server started on port ${port}`)) 