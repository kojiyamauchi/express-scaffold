import { PrismaClient } from '@prisma/client'

import { user } from './user'

const prisma = new PrismaClient()

void (async (): Promise<void> => {
  await user()
})()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
