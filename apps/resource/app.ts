import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import createError from 'http-errors'
import { primary, secondary, third, fourth } from './routes'

const app = express()
const root = path.resolve(`${__dirname}/` + '../../delivery/')
console.log('Looking Delivery Dir From App.ts\n', root)

type ErrorType = {
  status: number
  message: string
}

// Root Setup.
app.use(express.static(root))
// View Engine Setup.
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
// General.
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(logger('dev'))
// Rooter.
app.use('/', primary)
app.use('/secondary', secondary)
app.use('/third', third)
app.use('/fourth', fourth)
// Catch 404 and Forward to Error Handler
app.use((_req, _res, next) => next(createError(404)))
// Error Handler
app.use((err: ErrorType, req: Request, res: Response, next: NextFunction) => {
  console.log(next) // next's no-unused-vars.
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

export default app
