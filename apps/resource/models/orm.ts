import { Item, Order, OrderItem, User } from '@prisma/client'

import { prisma } from '@/libs'

export const ormModels = {
  users: async (): Promise<User[]> => {
    return prisma.user.findMany({
      include: {
        order: true,
      },
    })
  },
  items: async (): Promise<Item[]> => {
    return prisma.item.findMany({
      include: {
        order_items: true,
      },
    })
  },
  orders: async (): Promise<Order[]> => {
    return prisma.order.findMany({
      include: {
        user: true,
        order_items: true,
      },
    })
  },
  orderItems: async (): Promise<OrderItem[]> => {
    return prisma.orderItem.findMany({
      include: {
        item: true,
        order: true,
      },
    })
  },
}
