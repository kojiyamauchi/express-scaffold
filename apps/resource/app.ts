import cookieParser from 'cookie-parser'
import express, { NextFunction, Request, Response } from 'express'
import session from 'express-session'
import createError from 'http-errors'
import methodOverride from 'method-override'
import logger from 'morgan'
import path from 'path'

import { routes } from '@/routes'

type ErrorType = {
  status: number
  message: string
}

const app = express()
app.disable('x-powered-by')

// Looking For Delivery Dir.
const deliveryDir = path.resolve(`${__dirname}/` + '../../delivery/')
console.info('Looking Delivery Dir From App.ts\n', deliveryDir)

// Root Setup.
app.use(express.static(deliveryDir))

// Use PUT and DELETE Method For Template Form.
app.use(methodOverride('_method'))

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
      maxAge: 1000 * 3600, // 1h.
    },
  }),
)

// Redirect to https.
app.use((req, res, next) => {
  if (req.protocol === 'http' && app.get('env') === 'production') res.redirect(`https://${req.headers.host}${req.url}`)
  next()
})

// Rooter.
/* View */
app.use('/', routes.primary)
app.use('/secondary', routes.secondary)
app.use('/third', routes.third)
app.use('/user-list', routes.userList)
app.use('/user/:id', routes.user)
app.use('/insert-user', routes.insertUser)
/* API */
app.use('/api/user', routes.insert)
app.use('/api/user/:id', [routes.update, routes.delete])
/* ORM API */
app.use('/api/orm/users', routes.ormUsers)
app.use('/api/orm/items', routes.ormItems)
app.use('/api/orm/orders', routes.ormOrders)
app.use('/api/orm/order-items', routes.ormOrderItems)
app.use('/api/orm/user', routes.ormUser)
app.use('/api/orm/item', routes.ormItem)
app.use('/api/orm/order', routes.ormOrder)
app.use('/api/orm/order-item', routes.ormOrderItem)

// Catch 404 and Forward to Error Handler
app.use((_req, _res, next) => next(createError(404)))

// Error Handler
app.use((err: ErrorType, req: Request, res: Response, _next: NextFunction) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('not-found', { heading: `Oops! 404 Page Not Found,<br>Redirect to Top 🚀` })
})

export default app
