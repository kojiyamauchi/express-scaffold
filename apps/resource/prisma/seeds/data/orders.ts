import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const orders = async (): Promise<void> => {
  await Promise.all(
    Array.from({ length: 100 }).map(async () => {
      const items = Array.from({
        length: faker.number.int({ min: 1, max: 5 }),
      }).map(() => ({
        itemId: faker.number.int({ min: 1, max: 94 }),
        quantity: faker.number.int({ min: 1, max: 5 }),
      }))

      const dbItems = await prisma.item.findMany({
        where: { id: { in: items.map((item) => item.itemId) } },
      })

      const total_price = items.reduce((acc, item) => {
        const matched = dbItems.find((dbItem) => dbItem.id === item.itemId)
        return acc + (matched ? Number(matched.price) * item.quantity : 0)
      }, 0)

      return prisma.order.create({
        data: {
          userId: faker.number.int({ min: 1, max: 52 }),
          order_date: faker.date.recent({ days: 30 }),
          total_price,
          order_items: {
            create: items.map((item) => ({
              item: {
                connect: { id: item.itemId },
              },
              quantity: item.quantity,
            })),
          },
        },
      })
    }),
  )
}
