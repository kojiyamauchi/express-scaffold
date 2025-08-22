import type { Item, Order, OrderItem, User } from '@prisma/client'
import type { Decimal } from '@prisma/client/runtime/library'

import { prisma } from '@/libs'
import { ormModels } from '@/models'

jest.mock('@/libs', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    item: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    order: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    orderItem: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}))

const mockedPrisma = {
  user: {
    findMany: prisma.user.findMany as jest.MockedFunction<typeof prisma.user.findMany>,
    findUnique: prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>,
  },
  item: {
    findMany: prisma.item.findMany as jest.MockedFunction<typeof prisma.item.findMany>,
    findUnique: prisma.item.findUnique as jest.MockedFunction<typeof prisma.item.findUnique>,
  },
  order: {
    findMany: prisma.order.findMany as jest.MockedFunction<typeof prisma.order.findMany>,
    findUnique: prisma.order.findUnique as jest.MockedFunction<typeof prisma.order.findUnique>,
  },
  orderItem: {
    findMany: prisma.orderItem.findMany as jest.MockedFunction<typeof prisma.orderItem.findMany>,
    findUnique: prisma.orderItem.findUnique as jest.MockedFunction<typeof prisma.orderItem.findUnique>,
  },
}

describe('ormModels', (): void => {
  beforeEach((): void => {
    jest.clearAllMocks()
  })

  describe('users', (): void => {
    it('returns empty array when id is NaN', async (): Promise<void> => {
      const result = await ormModels.users(Number.NaN)

      expect(result).toEqual([])
      expect(mockedPrisma.user.findMany).not.toHaveBeenCalled()
    })

    it('calls prisma.user.findMany with correct parameters when id is provided', async (): Promise<void> => {
      const mockUsers: User[] = [
        {
          id: 1,
          name: 'Test User',
          url: 'https://example.com',
          phone: '090-1234-5678',
          email: 'test@example.com',
          create_at: new Date('2023-01-01T00:00:00Z'),
          update_at: new Date('2023-01-01T00:00:00Z'),
        },
      ]
      mockedPrisma.user.findMany.mockResolvedValue(mockUsers)

      const result = await ormModels.users(1)

      expect(mockedPrisma.user.findMany).toHaveBeenCalledWith({
        include: {
          order: true,
        },
        where: {
          id: 1,
        },
      })
      expect(result).toEqual(mockUsers)
    })

    it('calls prisma.user.findMany with correct parameters when id is undefined', async (): Promise<void> => {
      const mockUsers: User[] = []
      mockedPrisma.user.findMany.mockResolvedValue(mockUsers)

      const result = await ormModels.users(undefined)

      expect(mockedPrisma.user.findMany).toHaveBeenCalledWith({
        include: {
          order: true,
        },
        where: {
          id: undefined,
        },
      })
      expect(result).toEqual(mockUsers)
    })
  })

  describe('items', (): void => {
    it('returns empty array when id is NaN', async (): Promise<void> => {
      const result = await ormModels.items(Number.NaN)

      expect(result).toEqual([])
      expect(mockedPrisma.item.findMany).not.toHaveBeenCalled()
    })

    it('calls prisma.item.findMany with correct parameters when id is provided', async (): Promise<void> => {
      const mockItems: Item[] = [
        {
          id: 1,
          product_name: 'Test Product',
          price: { toNumber: (): number => 1000, toString: (): string => '1000' } as Decimal,
        },
      ]
      mockedPrisma.item.findMany.mockResolvedValue(mockItems)

      const result = await ormModels.items(1)

      expect(mockedPrisma.item.findMany).toHaveBeenCalledWith({
        include: {
          order_items: true,
        },
        where: {
          id: 1,
        },
      })
      expect(result).toEqual(mockItems)
    })

    it('calls prisma.item.findMany with correct parameters when id is undefined', async (): Promise<void> => {
      const mockItems: Item[] = []
      mockedPrisma.item.findMany.mockResolvedValue(mockItems)

      const result = await ormModels.items(undefined)

      expect(mockedPrisma.item.findMany).toHaveBeenCalledWith({
        include: {
          order_items: true,
        },
        where: {
          id: undefined,
        },
      })
      expect(result).toEqual(mockItems)
    })
  })

  describe('orders', (): void => {
    it('returns empty array when id is NaN', async (): Promise<void> => {
      const result = await ormModels.orders(Number.NaN)

      expect(result).toEqual([])
      expect(mockedPrisma.order.findMany).not.toHaveBeenCalled()
    })

    it('calls prisma.order.findMany with correct parameters when id is provided', async (): Promise<void> => {
      const mockOrders: Order[] = [
        {
          id: 1,
          userId: 1,
          order_date: new Date('2023-01-01T00:00:00Z'),
          total_price: { toNumber: (): number => 1000, toString: (): string => '1000' } as Decimal,
        },
      ]
      mockedPrisma.order.findMany.mockResolvedValue(mockOrders)

      const result = await ormModels.orders(1)

      expect(mockedPrisma.order.findMany).toHaveBeenCalledWith({
        include: {
          user: true,
          order_items: true,
        },
        where: {
          id: 1,
        },
      })
      expect(result).toEqual(mockOrders)
    })

    it('calls prisma.order.findMany with correct parameters when id is undefined', async (): Promise<void> => {
      const mockOrders: Order[] = []
      mockedPrisma.order.findMany.mockResolvedValue(mockOrders)

      const result = await ormModels.orders(undefined)

      expect(mockedPrisma.order.findMany).toHaveBeenCalledWith({
        include: {
          user: true,
          order_items: true,
        },
        where: {
          id: undefined,
        },
      })
      expect(result).toEqual(mockOrders)
    })
  })

  describe('orderItems', (): void => {
    it('returns empty array when id is NaN', async (): Promise<void> => {
      const result = await ormModels.orderItems(Number.NaN)

      expect(result).toEqual([])
      expect(mockedPrisma.orderItem.findMany).not.toHaveBeenCalled()
    })

    it('calls prisma.orderItem.findMany with correct parameters when id is provided', async (): Promise<void> => {
      const mockOrderItems: OrderItem[] = [
        {
          id: 1,
          order_id: 1,
          item_id: 1,
          quantity: 2,
        },
      ]
      mockedPrisma.orderItem.findMany.mockResolvedValue(mockOrderItems)

      const result = await ormModels.orderItems(1)

      expect(mockedPrisma.orderItem.findMany).toHaveBeenCalledWith({
        include: {
          item: true,
          order: true,
        },
        where: {
          id: 1,
        },
      })
      expect(result).toEqual(mockOrderItems)
    })

    it('calls prisma.orderItem.findMany with correct parameters when id is undefined', async (): Promise<void> => {
      const mockOrderItems: OrderItem[] = []
      mockedPrisma.orderItem.findMany.mockResolvedValue(mockOrderItems)

      const result = await ormModels.orderItems(undefined)

      expect(mockedPrisma.orderItem.findMany).toHaveBeenCalledWith({
        include: {
          item: true,
          order: true,
        },
        where: {
          id: undefined,
        },
      })
      expect(result).toEqual(mockOrderItems)
    })
  })

  describe('user', (): void => {
    it('returns null when id is NaN', async (): Promise<void> => {
      const result = await ormModels.user(Number.NaN)

      expect(result).toBeNull()
      expect(mockedPrisma.user.findUnique).not.toHaveBeenCalled()
    })

    it('calls prisma.user.findUnique with correct parameters', async (): Promise<void> => {
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        url: 'https://example.com',
        phone: '090-1234-5678',
        email: 'test@example.com',
        create_at: new Date('2023-01-01T00:00:00Z'),
        update_at: new Date('2023-01-01T00:00:00Z'),
      }
      mockedPrisma.user.findUnique.mockResolvedValue(mockUser)

      const result = await ormModels.user(1)

      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        include: {
          order: true,
        },
        where: {
          id: 1,
        },
      })
      expect(result).toEqual(mockUser)
    })

    it('returns null when user not found', async (): Promise<void> => {
      mockedPrisma.user.findUnique.mockResolvedValue(null)

      const result = await ormModels.user(1)

      expect(result).toBeNull()
    })
  })

  describe('item', (): void => {
    it('returns null when id is NaN', async (): Promise<void> => {
      const result = await ormModels.item(Number.NaN)

      expect(result).toBeNull()
      expect(mockedPrisma.item.findUnique).not.toHaveBeenCalled()
    })

    it('calls prisma.item.findUnique with correct parameters', async (): Promise<void> => {
      const mockItem: Item = {
        id: 1,
        product_name: 'Test Product',
        price: { toNumber: (): number => 1000, toString: (): string => '1000' } as Decimal,
      }
      mockedPrisma.item.findUnique.mockResolvedValue(mockItem)

      const result = await ormModels.item(1)

      expect(mockedPrisma.item.findUnique).toHaveBeenCalledWith({
        include: {
          order_items: true,
        },
        where: {
          id: 1,
        },
      })
      expect(result).toEqual(mockItem)
    })

    it('returns null when item not found', async (): Promise<void> => {
      mockedPrisma.item.findUnique.mockResolvedValue(null)

      const result = await ormModels.item(1)

      expect(result).toBeNull()
    })
  })

  describe('order', (): void => {
    it('returns null when id is NaN', async (): Promise<void> => {
      const result = await ormModels.order(Number.NaN)

      expect(result).toBeNull()
      expect(mockedPrisma.order.findUnique).not.toHaveBeenCalled()
    })

    it('calls prisma.order.findUnique with correct parameters', async (): Promise<void> => {
      const mockOrder: Order = {
        id: 1,
        userId: 1,
        order_date: new Date('2023-01-01T00:00:00Z'),
        total_price: { toNumber: (): number => 1000, toString: (): string => '1000' } as Decimal,
      }
      mockedPrisma.order.findUnique.mockResolvedValue(mockOrder)

      const result = await ormModels.order(1)

      expect(mockedPrisma.order.findUnique).toHaveBeenCalledWith({
        include: {
          user: true,
          order_items: true,
        },
        where: {
          id: 1,
        },
      })
      expect(result).toEqual(mockOrder)
    })

    it('returns null when order not found', async (): Promise<void> => {
      mockedPrisma.order.findUnique.mockResolvedValue(null)

      const result = await ormModels.order(1)

      expect(result).toBeNull()
    })
  })

  describe('orderItem', (): void => {
    it('returns null when id is NaN', async (): Promise<void> => {
      const result = await ormModels.orderItem(Number.NaN)

      expect(result).toBeNull()
      expect(mockedPrisma.orderItem.findUnique).not.toHaveBeenCalled()
    })

    it('calls prisma.orderItem.findUnique with correct parameters', async (): Promise<void> => {
      const mockOrderItem: OrderItem = {
        id: 1,
        order_id: 1,
        item_id: 1,
        quantity: 2,
      }
      mockedPrisma.orderItem.findUnique.mockResolvedValue(mockOrderItem)

      const result = await ormModels.orderItem(1)

      expect(mockedPrisma.orderItem.findUnique).toHaveBeenCalledWith({
        include: {
          item: true,
          order: true,
        },
        where: {
          id: 1,
        },
      })
      expect(result).toEqual(mockOrderItem)
    })

    it('returns null when order item not found', async (): Promise<void> => {
      mockedPrisma.orderItem.findUnique.mockResolvedValue(null)

      const result = await ormModels.orderItem(1)

      expect(result).toBeNull()
    })
  })
})
