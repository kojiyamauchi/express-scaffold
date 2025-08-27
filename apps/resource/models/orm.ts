import { Feed, Item, Order, OrderItem, Prisma, User } from '@prisma/client'
import dayjs from 'dayjs'

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
  createUser: async (user: Omit<User, 'id' | 'create_at' | 'update_at'>): Promise<User> => {
    return prisma.user.create({
      data: {
        name: user.name,
        url: user.url,
        phone: user.phone,
        email: user.email,
        create_at: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
        update_at: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
      },
    })
  },
  updateUser: async (user: Omit<User, 'create_at' | 'update_at'>): Promise<User> => {
    return prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        url: user.url,
        phone: user.phone,
        email: user.email,
        create_at: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
        update_at: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
      },
    })
  },
  deleteUser: async (userId: number): Promise<User> => {
    return prisma.user.delete({
      where: {
        id: userId,
      },
    })
  },
  createOrder: async ({
    userId,
    totalPrice,
    orderItems,
  }: {
    userId: number
    totalPrice: number
    orderItems: {
      item: {
        connect: { id: number }
      }
      quantity: number
    }[]
  }): Promise<Order> => {
    return prisma.order.create({
      data: {
        user: {
          connect: { id: userId },
        },
        order_date: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
        total_price: new Prisma.Decimal(totalPrice),

        order_items: {
          create: orderItems,
        },
      },
      include: {
        order_items: {
          include: { item: true },
        },
      },
    })
  },
  feeds: async (id: number | undefined): Promise<Feed[]> => {
    if (typeof id === 'number' && isNaN(id)) {
      return []
    }

    return prisma.feed.findMany({
      include: {
        item: true,
      },
      where: {
        id: id,
      },
    })
  },
}
