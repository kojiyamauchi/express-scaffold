import { Item, Order, OrderItem, User } from '@prisma/client'

import { prisma } from '@/libs'

export const ormModels = {
  users: async (id: number | undefined): Promise<User[]> => {
    if (typeof id === 'number' && isNaN(id)) {
      return []
    }

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
    if (typeof id === 'number' && isNaN(id)) {
      return []
    }

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
    if (typeof id === 'number' && isNaN(id)) {
      return []
    }

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
    if (typeof id === 'number' && isNaN(id)) {
      return []
    }

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
  user: async (id: number): Promise<User | null> => {
    if (isNaN(id)) {
      return null
    }

    return prisma.user.findUnique({
      include: {
        order: true,
      },
      where: {
        id: id,
      },
    })
  },
  item: async (id: number): Promise<Item | null> => {
    if (isNaN(id)) {
      return null
    }

    return prisma.item.findUnique({
      include: {
        order_items: true,
      },
      where: {
        id: id,
      },
    })
  },
  order: async (id: number): Promise<Order | null> => {
    if (isNaN(id)) {
      return null
    }

    return prisma.order.findUnique({
      include: {
        user: true,
        order_items: true,
      },
      where: {
        id: id,
      },
    })
  },
  orderItem: async (id: number): Promise<OrderItem | null> => {
    if (isNaN(id)) {
      return null
    }

    return prisma.orderItem.findUnique({
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
