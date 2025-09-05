import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient()

export const users = async (): Promise<void> => {
  const createUser = Array.from({ length: 52 }).map(() => {
    const result = {
      name: faker.person.fullName(),
      url: faker.internet.url(),
      phone: faker.helpers.replaceSymbols('0#0-####-####'),
      email: faker.internet.email(),
      create_at: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
      update_at: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
    }
    return result
  })

  await prisma.user.createMany({
    data: createUser,
    skipDuplicates: true,
  })
}
