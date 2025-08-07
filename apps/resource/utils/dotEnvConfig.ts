import dotenv from 'dotenv'
import path from 'path'

const rootEnv = path.resolve(`${__dirname}/` + '../../../.env')

export const dotEnvConfig = (): void => {
  dotenv.config({ path: rootEnv })
}
