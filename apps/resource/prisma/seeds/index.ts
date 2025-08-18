import { PrismaClient } from '@prisma/client'

import { items, orders, users } from './data'

const prisma = new PrismaClient()

void (async (): Promise<void> => {
  await users()
  await items()
  await orders()
})()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
