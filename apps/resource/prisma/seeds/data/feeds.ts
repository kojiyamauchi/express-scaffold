import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient()

export const feeds = async (): Promise<void> => {
  const dbItems = await prisma.item.findMany({
    select: {
      id: true,
      product_name: true,
    },
  })

  const data = dbItems.map((item) => {
    const result = {
      content: `${item.product_name}が入荷しました 🎁`,
      create_at: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
      update_at: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
      item_id: item.id,
    }

    return result
  })

  await prisma.feed.createMany({
    data,
    skipDuplicates: true,
  })
}
