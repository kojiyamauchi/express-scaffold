import { PrismaClient } from '@prisma/client'

import { dotEnvConfig } from '@/utils'

dotEnvConfig()

const dockerDbServiceName = 'mysql'
const url = `${process.env.DB_HOST}://${process.env.DB_USER}:${process.env.DB_ROOT_PASS}@${dockerDbServiceName}:${process.env.DB_PORT}/${process.env.DB_NAME}`

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: url,
    },
  },
})
