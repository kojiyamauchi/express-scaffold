import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { Request, Response } from 'express'
import path from 'path'

import { ormModels, sqlModels } from '@/models'
import { userSchema } from '@/schemas'

dayjs.extend(utc)
dayjs.extend(timezone)

const deliveryDir = path.resolve(`${__dirname}/` + '../../../delivery/')
console.info('Looking For Delivery Dir From Controllers.\n', deliveryDir)
console.info(sqlModels.deliveryDir())
console.info('Looking For Primary Env.\n', sqlModels.primaryEnv())
console.info('Looking For Secondary Env.\n', sqlModels.secondaryEnv())

export const controllers = {
  // View.
  primary: (_req: Request, res: Response): void => res.render('./index.ejs', { heading: 'This is Primary Page.' }),
  secondary: (_req: Request, res: Response): void => res.render('./secondary/index.ejs', { heading: 'This is Secondary Page.' }),
  third: (_req: Request, res: Response): void => res.render('./third/index.ejs', { heading: 'This is Third Page.' }),
  userList: async (_req: Request, res: Response): Promise<void> => {
    try {
      const userList = await sqlModels.userList()

      if (Array.isArray(userList)) {
        const formatUserList = userList.map((user) => {
          return {
            id: user.id,
            name: user.name,
            url: user.url,
            phone: user.phone,
            email: user.email,
            create_at: dayjs.utc(user.create_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss'),
            update_at: dayjs.utc(user.update_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss'),
          }
        })

        res.render('./user-list/index.ejs', { heading: 'User List.', userList: formatUserList })
      }
    } catch {
      res.status(500)
      res.render('server-error', { heading: `500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀` })
    }
  },
  user: async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.id)
    try {
      const results = await sqlModels.user(userId)
      if (Array.isArray(results)) {
        const [user] = results
        const formatTimestamp = {
          createAt: dayjs.utc(user.create_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss'),
          updateAt: dayjs.utc(user.update_at).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss'),
        }
        const [phone1, phone2, phone3] = user.phone.split('-')
        const formatUser = {
          id: user.id,
          name: user.name,
          url: user.url,
          phone1: phone1,
          phone2: phone2,
          phone3: phone3,
          email: user.email,
        }
        res.render('./user/index.ejs', { heading: `User #${user.id}.`, timestamp: formatTimestamp, user: formatUser })
      }
    } catch {
      res.status(500)
      res.render('server-error', { heading: `500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀` })
    }
  },
  insertUser: (_req: Request, res: Response): void => res.render('./insert-user/index.ejs', { heading: 'Insert User.' }),

  // API.
  insert: async (req: Request, res: Response): Promise<void> => {
    const result = userSchema.safeParse(req.body)
    if (!result.success) {
      const errors = result.error.issues.map((error) => {
        const result = { path: error.path.join('.'), message: error.message }
        return result
      })
      const paths = errors.map((error) => error.path).join(', ')
      const messages = errors.map((error) => error.message).join('<br>')
      const formatError = `フォーム: ${paths} <br> ${messages}`
      res.status(400)
      res.render('validate-error', { heading: formatError })
      return
    }

    const formatInsert = {
      name: result.data.name,
      url: result.data.url,
      phone: `${result.data.phone1}-${result.data.phone2}-${result.data.phone3}`,
      email: result.data.email,
    }

    try {
      const result = await sqlModels.insert([formatInsert.name, formatInsert.url, formatInsert.phone, formatInsert.email])
      if ('insertId' in result) {
        res.redirect(`/user/${result.insertId}`)
      }
    } catch {
      res.status(500)
      res.render('server-error', { heading: `500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀` })
    }
  },
  update: async (req: Request, res: Response): Promise<void> => {
    const result = userSchema.safeParse(req.body)
    if (!result.success) {
      const errors = result.error.issues.map((error) => {
        const result = { path: error.path.join('.'), message: error.message }
        return result
      })
      const paths = errors.map((error) => error.path).join(', ')
      const messages = errors.map((error) => error.message).join('<br>')
      const formatError = `フォーム: ${paths} <br> ${messages}`
      res.status(400)
      res.render('validate-error', { heading: formatError })
      return
    }

    const formatUpdate = {
      id: req.params.id,
      name: result.data.name,
      url: result.data.url,
      phone: `${result.data.phone1}-${result.data.phone2}-${result.data.phone3}`,
      email: result.data.email,
    }

    try {
      await sqlModels.update([formatUpdate.name, formatUpdate.url, formatUpdate.phone, formatUpdate.email, formatUpdate.id])
      res.redirect(`/user/${formatUpdate.id}`)
    } catch {
      res.status(500)
      res.render('server-error', { heading: `500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀` })
    }
  },
  delete: async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.id)
    try {
      await sqlModels.delete(userId)
      res.redirect('/user-list')
    } catch {
      res.status(500)
      res.render('server-error', { heading: `500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀` })
    }
  },

  // ORM API.
  ormUsers: async (req: Request, res: Response): Promise<void> => {
    const userId = ((): number | undefined => {
      if (typeof req.query.id === 'string') {
        return Number(req.query.id)
      }
      return undefined
    })()

    try {
      const result = await ormModels.users(userId)
      if (result.length > 0) {
        res.json(result)
      } else {
        res.send('No results found.')
      }
    } catch {
      res.status(500)
      res.render('server-error', { heading: `500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀` })
    }
  },
  ormItems: async (req: Request, res: Response): Promise<void> => {
    const itemId = ((): number | undefined => {
      if (typeof req.query.id === 'string') {
        return Number(req.query.id)
      }
      return undefined
    })()

    try {
      const result = await ormModels.items(itemId)
      if (result.length > 0) {
        res.json(result)
      } else {
        res.send('No results found.')
      }
    } catch {
      res.status(500)
      res.render('server-error', { heading: `500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀` })
    }
  },
  ormOrders: async (req: Request, res: Response): Promise<void> => {
    const orderId = ((): number | undefined => {
      if (typeof req.query.id === 'string') {
        return Number(req.query.id)
      }
      return undefined
    })()

    try {
      const result = await ormModels.orders(orderId)
      if (result.length > 0) {
        res.json(result)
      } else {
        res.send('No results found.')
      }
    } catch {
      res.status(500)
      res.render('server-error', { heading: `500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀` })
    }
  },
  ormOrderItems: async (req: Request, res: Response): Promise<void> => {
    const orderItemId = ((): number | undefined => {
      if (typeof req.query.id === 'string') {
        return Number(req.query.id)
      }
      return undefined
    })()

    try {
      const result = await ormModels.orderItems(orderItemId)
      if (result.length > 0) {
        res.json(result)
      } else {
        res.send('No results found.')
      }
    } catch {
      res.status(500)
      res.render('server-error', { heading: `500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀` })
    }
  },
}
