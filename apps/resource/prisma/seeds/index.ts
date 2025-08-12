import { PrismaClient } from '@prisma/client'

import { users } from './data'

const prisma = new PrismaClient()

void (async (): Promise<void> => {
  await users()
})()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
