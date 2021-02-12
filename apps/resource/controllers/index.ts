import { Request, Response } from 'express'
import path from 'path'
import { models } from '../models'
const root = path.resolve(`${__dirname}/` + '../../../delivery/')
console.log('Looking Delivery Dir From Controllers.\n', root)
console.log(models.rootPath())
console.log('Fetching Primary Models.\n', models.primary())
console.log('Fetching Secondary Models.\n', models.secondary())

export const controllers = {
  primary: (_req: Request, res: Response): void => res.render('./index.ejs', { heading: 'This is Primary Page.' }),
  secondary: (_req: Request, res: Response): void => res.render('./secondary/index.ejs', { heading: 'This is Secondary Page.' }),
  third: (_req: Request, res: Response): void => res.render('./third/index.ejs', { heading: 'This is Third Page.' }),
  fourth: (_req: Request, res: Response): void => res.render('./fourth/index.ejs', { heading: 'This is Fourth Page.' })
}