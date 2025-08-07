import { Request, Response } from 'express'
import path from 'path'

import { models } from '@/models'

const deliveryDir = path.resolve(`${__dirname}/` + '../../../delivery/')
console.info('Looking For Delivery Dir From Controllers.\n', deliveryDir)
console.info(models.deliveryDir())
console.info('Looking For Primary Env.\n', models.primaryEnv())
console.info('Looking For Secondary Env.\n', models.secondaryEnv())

export const controllers = {
  // View.
  primary: (_req: Request, res: Response): void => res.render('./index.ejs', { heading: 'This is Primary Page.' }),
  secondary: (_req: Request, res: Response): void => res.render('./secondary/index.ejs', { heading: 'This is Secondary Page.' }),
  third: (_req: Request, res: Response): void => res.render('./third/index.ejs', { heading: 'This is Third Page.' }),
  userList: async (_req: Request, res: Response): Promise<void> => {
    try {
      const userList = await models.userList()
      if (Array.isArray(userList)) {
        res.render('./user-list/index.ejs', { heading: 'User List.', userList: userList })
      }
    } catch {
      res.status(500)
      res.render('server-error', { heading: `500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀` })
    }
  },
  user: async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.id)
    try {
      const results = await models.user(userId)
      if (Array.isArray(results)) {
        const [user] = results
        const formatTimestamp = {
          createAt: user.create_at,
          updateAt: user.update_at,
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
    const formatInsert = {
      name: req.body.name,
      url: req.body.url,
      phone: `${req.body.phone1}-${req.body.phone2}-${req.body.phone3}`,
      email: req.body.email,
    }
    try {
      const result = await models.insert([formatInsert.name, formatInsert.url, formatInsert.phone, formatInsert.email])
      if ('insertId' in result) {
        res.redirect(`/user/${result.insertId}`)
      }
    } catch {
      res.status(500)
      res.render('server-error', { heading: `500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀` })
    }
  },
  update: async (req: Request, res: Response): Promise<void> => {
    const formatUpdate = {
      id: req.params.id,
      name: req.body.name,
      url: req.body.url,
      phone: `${req.body.phone1}-${req.body.phone2}-${req.body.phone3}`,
      email: req.body.email,
    }
    try {
      await models.update([formatUpdate.name, formatUpdate.url, formatUpdate.phone, formatUpdate.email, formatUpdate.id])
      res.redirect(`/user/${formatUpdate.id}`)
    } catch {
      res.status(500)
      res.render('server-error', { heading: `500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀` })
    }
  },
  delete: async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.id)
    try {
      await models.delete(userId)
      res.redirect('/user-list')
    } catch {
      res.status(500)
      res.render('server-error', { heading: `500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀` })
    }
  },
}
