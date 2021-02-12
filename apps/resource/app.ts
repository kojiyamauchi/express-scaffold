import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import logger from 'morgan'
import createError from 'http-errors'
import { routes } from './routes'

type ErrorType = {
  status: number
  message: string
}

const app = express()

// Looking Root.
const root = path.resolve(`${__dirname}/` + '../../delivery/')
console.log('Looking Delivery Dir From App.ts\n', root)

// Root Setup.
app.use(express.static(root))

// View Engine Setup.
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// General.
app.use((_req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=15552000')
  next()
})
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(logger('dev'))
app.set('trust proxy', 1)
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 3600 // 1h.
    }
  })
)

// Redirect to https.
app.use((req, res, next) => {
  if (req.protocol === 'http' && app.get('env') === 'production') res.redirect(`https://${req.headers.host}${req.url}`)
  next()
})

// Rooter.
app.use('/', routes.primary)
app.use('/secondary', routes.secondary)
app.use('/third', routes.third)
app.use('/fourth', routes.fourth)

// Catch 404 and Forward to Error Handler
app.use((_req, _res, next) => next(createError(404)))

// Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: ErrorType, req: Request, res: Response, _next: NextFunction) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('not-found', { heading: `Oops! 404 Page Not Found,<br>Redirect to Top 🚀` })
})

export default app
