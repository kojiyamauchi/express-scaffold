import dotenv from 'dotenv'
import path from 'path'

const root = path.resolve(`${__dirname}/` + '../../../delivery/')
dotenv.config()

export const models = {
  rootPath: (): string | undefined => {
    return `Looking Delivery Dir From Models.\n${root}`
  },
  primary: (): string | undefined => {
    return process.env.PRIMARY_MODEL
  },
  secondary: (): string | undefined => {
    return process.env.SECONDARY_MODEL
  }
}
