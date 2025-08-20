import { Item, Order, OrderItem, User } from '@prisma/client'

import { prisma } from '@/libs'

export const ormModels = {
  users: async (id: number | undefined): Promise<User[]> => {
    return prisma.user.findMany({
      include: {
        order: true,
      },
      where: {
        id: id,
      },
    })
  },
  items: async (id: number | undefined): Promise<Item[]> => {
    return prisma.item.findMany({
      include: {
        order_items: true,
      },
      where: {
        id: id,
      },
    })
  },
  orders: async (id: number | undefined): Promise<Order[]> => {
    return prisma.order.findMany({
      include: {
        user: true,
        order_items: true,
      },
      where: {
        id: id,
      },
    })
  },
  orderItems: async (id: number | undefined): Promise<OrderItem[]> => {
    return prisma.orderItem.findMany({
      include: {
        item: true,
        order: true,
      },
      where: {
        id: id,
      },
    })
  },
}
