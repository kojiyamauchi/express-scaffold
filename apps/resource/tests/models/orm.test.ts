import type { Feed, Item, Order, OrderItem, User } from '@prisma/client'
import type { Decimal } from '@prisma/client/runtime/library'

import { prisma } from '@/libs'
import { ormModels } from '@/models'

jest.mock('@/libs', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    item: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    order: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    orderItem: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    feed: {
      findMany: jest.fn(),
    },
  },
}))

const mockedPrisma = {
  user: {
    findMany: prisma.user.findMany as jest.MockedFunction<typeof prisma.user.findMany>,
    findUnique: prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>,
    create: prisma.user.create as jest.MockedFunction<typeof prisma.user.create>,
    update: prisma.user.update as jest.MockedFunction<typeof prisma.user.update>,
    delete: prisma.user.delete as jest.MockedFunction<typeof prisma.user.delete>,
  },
  item: {
    findMany: prisma.item.findMany as jest.MockedFunction<typeof prisma.item.findMany>,
    findUnique: prisma.item.findUnique as jest.MockedFunction<typeof prisma.item.findUnique>,
  },
  order: {
    findMany: prisma.order.findMany as jest.MockedFunction<typeof prisma.order.findMany>,
    findUnique: prisma.order.findUnique as jest.MockedFunction<typeof prisma.order.findUnique>,
    create: prisma.order.create as jest.MockedFunction<typeof prisma.order.create>,
  },
  orderItem: {
    findMany: prisma.orderItem.findMany as jest.MockedFunction<typeof prisma.orderItem.findMany>,
    findUnique: prisma.orderItem.findUnique as jest.MockedFunction<typeof prisma.orderItem.findUnique>,
  },
  feed: {
    findMany: prisma.feed.findMany as jest.MockedFunction<typeof prisma.feed.findMany>,
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

  describe('createUser', (): void => {
    it('creates a new user with correct parameters', async (): Promise<void> => {
      const mockInputUser = {
        name: 'Test User',
        url: 'https://example.com',
        phone: '090-1234-5678',
        email: 'test@example.com',
      }

      const mockCreatedUser: User = {
        id: 1,
        name: 'Test User',
        url: 'https://example.com',
        phone: '090-1234-5678',
        email: 'test@example.com',
        create_at: new Date('2023-01-01T00:00:00Z'),
        update_at: new Date('2023-01-01T00:00:00Z'),
      }
      mockedPrisma.user.create.mockResolvedValue(mockCreatedUser)

      const result = await ormModels.createUser(mockInputUser)

      expect(mockedPrisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'Test User',
          url: 'https://example.com',
          phone: '090-1234-5678',
          email: 'test@example.com',
          create_at: expect.any(String),
          update_at: expect.any(String),
        },
      })
      expect(result).toEqual(mockCreatedUser)
    })

    it('formats timestamps correctly', async (): Promise<void> => {
      const mockInputUser = {
        name: 'Test User',
        url: 'https://example.com',
        phone: '090-1234-5678',
        email: 'test@example.com',
      }

      const mockCreatedUser: User = {
        id: 1,
        ...mockInputUser,
        create_at: new Date('2023-01-01T00:00:00Z'),
        update_at: new Date('2023-01-01T00:00:00Z'),
      }
      mockedPrisma.user.create.mockResolvedValue(mockCreatedUser)

      await ormModels.createUser(mockInputUser)

      const createCall = mockedPrisma.user.create.mock.calls[0][0]
      expect(createCall.data.create_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[Z+]/)
      expect(createCall.data.update_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[Z+]/)
    })
  })

  describe('updateUser', (): void => {
    it('updates user with correct parameters', async (): Promise<void> => {
      const mockInputUser = {
        id: 1,
        name: 'Updated User',
        url: 'https://updated-example.com',
        phone: '080-9876-5432',
        email: 'updated@example.com',
      }

      const mockUpdatedUser: User = {
        id: 1,
        name: 'Updated User',
        url: 'https://updated-example.com',
        phone: '080-9876-5432',
        email: 'updated@example.com',
        create_at: new Date('2023-01-01T00:00:00Z'),
        update_at: new Date('2023-01-02T00:00:00Z'),
      }
      mockedPrisma.user.update.mockResolvedValue(mockUpdatedUser)

      const result = await ormModels.updateUser(mockInputUser)

      expect(mockedPrisma.user.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: {
          name: 'Updated User',
          url: 'https://updated-example.com',
          phone: '080-9876-5432',
          email: 'updated@example.com',
          create_at: expect.any(String),
          update_at: expect.any(String),
        },
      })
      expect(result).toEqual(mockUpdatedUser)
    })

    it('formats timestamps correctly', async (): Promise<void> => {
      const mockInputUser = {
        id: 1,
        name: 'Updated User',
        url: 'https://updated-example.com',
        phone: '080-9876-5432',
        email: 'updated@example.com',
      }

      const mockUpdatedUser: User = {
        ...mockInputUser,
        create_at: new Date('2023-01-01T00:00:00Z'),
        update_at: new Date('2023-01-02T00:00:00Z'),
      }
      mockedPrisma.user.update.mockResolvedValue(mockUpdatedUser)

      await ormModels.updateUser(mockInputUser)

      const updateCall = mockedPrisma.user.update.mock.calls[0][0]
      expect(updateCall.data.create_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[Z+]/)
      expect(updateCall.data.update_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[Z+]/)
    })
  })

  describe('deleteUser', (): void => {
    it('deletes user with correct id', async (): Promise<void> => {
      const mockDeletedUser: User = {
        id: 1,
        name: 'Test User',
        url: 'https://example.com',
        phone: '090-1234-5678',
        email: 'test@example.com',
        create_at: new Date('2023-01-01T00:00:00Z'),
        update_at: new Date('2023-01-01T00:00:00Z'),
      }
      mockedPrisma.user.delete.mockResolvedValue(mockDeletedUser)

      const result = await ormModels.deleteUser(1)

      expect(mockedPrisma.user.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      })
      expect(result).toEqual(mockDeletedUser)
    })
  })

  describe('createOrder', (): void => {
    it('creates a new order with correct parameters', async (): Promise<void> => {
      const mockInputOrder = {
        userId: 1,
        totalPrice: 5000,
        orderItems: [
          {
            item: {
              connect: { id: 1 },
            },
            quantity: 2,
          },
          {
            item: {
              connect: { id: 2 },
            },
            quantity: 1,
          },
        ],
      }

      const mockCreatedOrder: Order = {
        id: 1,
        userId: 1,
        order_date: new Date('2023-01-01T00:00:00Z'),
        total_price: { toNumber: (): number => 5000, toString: (): string => '5000' } as Decimal,
      }
      mockedPrisma.order.create.mockResolvedValue(mockCreatedOrder)

      const result = await ormModels.createOrder(mockInputOrder)

      expect(mockedPrisma.order.create).toHaveBeenCalledWith({
        data: {
          user: {
            connect: { id: 1 },
          },
          order_date: expect.any(String),
          total_price: expect.any(Object),
          order_items: {
            create: [
              {
                item: {
                  connect: { id: 1 },
                },
                quantity: 2,
              },
              {
                item: {
                  connect: { id: 2 },
                },
                quantity: 1,
              },
            ],
          },
        },
        include: {
          order_items: {
            include: { item: true },
          },
        },
      })
      expect(result).toEqual(mockCreatedOrder)
    })

    it('formats order date correctly', async (): Promise<void> => {
      const mockInputOrder = {
        userId: 1,
        totalPrice: 3000,
        orderItems: [
          {
            item: {
              connect: { id: 1 },
            },
            quantity: 1,
          },
        ],
      }

      const mockCreatedOrder: Order = {
        id: 1,
        userId: 1,
        order_date: new Date('2023-01-01T00:00:00Z'),
        total_price: { toNumber: (): number => 3000, toString: (): string => '3000' } as Decimal,
      }
      mockedPrisma.order.create.mockResolvedValue(mockCreatedOrder)

      await ormModels.createOrder(mockInputOrder)

      const createCall = mockedPrisma.order.create.mock.calls[0][0]
      expect(createCall.data.order_date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[Z+]/)
    })

    it('converts totalPrice to Prisma.Decimal correctly', async (): Promise<void> => {
      const mockInputOrder = {
        userId: 1,
        totalPrice: 7500,
        orderItems: [
          {
            item: {
              connect: { id: 3 },
            },
            quantity: 3,
          },
        ],
      }

      const mockCreatedOrder: Order = {
        id: 1,
        userId: 1,
        order_date: new Date('2023-01-01T00:00:00Z'),
        total_price: { toNumber: (): number => 7500, toString: (): string => '7500' } as Decimal,
      }
      mockedPrisma.order.create.mockResolvedValue(mockCreatedOrder)

      await ormModels.createOrder(mockInputOrder)

      const createCall = mockedPrisma.order.create.mock.calls[0][0]
      expect(createCall.data.total_price).toBeDefined()
      expect(typeof createCall.data.total_price).toBe('object')
    })

    it('handles multiple order items correctly', async (): Promise<void> => {
      const mockInputOrder = {
        userId: 2,
        totalPrice: 10000,
        orderItems: [
          {
            item: {
              connect: { id: 1 },
            },
            quantity: 2,
          },
          {
            item: {
              connect: { id: 2 },
            },
            quantity: 3,
          },
          {
            item: {
              connect: { id: 3 },
            },
            quantity: 1,
          },
        ],
      }

      const mockCreatedOrder: Order = {
        id: 2,
        userId: 2,
        order_date: new Date('2023-01-01T00:00:00Z'),
        total_price: { toNumber: (): number => 10000, toString: (): string => '10000' } as Decimal,
      }
      mockedPrisma.order.create.mockResolvedValue(mockCreatedOrder)

      const result = await ormModels.createOrder(mockInputOrder)

      const createCall = mockedPrisma.order.create.mock.calls[0][0]
      const orderItems = createCall.data.order_items?.create as Array<{
        item: { connect: { id: number } }
        quantity: number
      }>
      expect(orderItems).toHaveLength(3)
      expect(orderItems[0]).toEqual({
        item: { connect: { id: 1 } },
        quantity: 2,
      })
      expect(orderItems[1]).toEqual({
        item: { connect: { id: 2 } },
        quantity: 3,
      })
      expect(orderItems[2]).toEqual({
        item: { connect: { id: 3 } },
        quantity: 1,
      })
      expect(result).toEqual(mockCreatedOrder)
    })

    it('includes correct relation data in response', async (): Promise<void> => {
      const mockInputOrder = {
        userId: 1,
        totalPrice: 2500,
        orderItems: [
          {
            item: {
              connect: { id: 1 },
            },
            quantity: 1,
          },
        ],
      }

      const mockCreatedOrder: Order = {
        id: 1,
        userId: 1,
        order_date: new Date('2023-01-01T00:00:00Z'),
        total_price: { toNumber: (): number => 2500, toString: (): string => '2500' } as Decimal,
      }
      mockedPrisma.order.create.mockResolvedValue(mockCreatedOrder)

      await ormModels.createOrder(mockInputOrder)

      const createCall = mockedPrisma.order.create.mock.calls[0][0]
      expect(createCall.include).toEqual({
        order_items: {
          include: { item: true },
        },
      })
    })
  })

  describe('feeds', (): void => {
    it('returns empty array when id is NaN', async (): Promise<void> => {
      const result = await ormModels.feeds(Number.NaN)

      expect(result).toEqual([])
      expect(mockedPrisma.feed.findMany).not.toHaveBeenCalled()
    })

    it('calls prisma.feed.findMany with correct parameters when id is provided', async (): Promise<void> => {
      const mockFeeds: Feed[] = [
        {
          id: 1,
          content: 'Test Feed Content',
          create_at: new Date('2023-01-01T00:00:00Z'),
          update_at: new Date('2023-01-01T00:00:00Z'),
          item_id: 1,
        },
      ]
      mockedPrisma.feed.findMany.mockResolvedValue(mockFeeds)

      const result = await ormModels.feeds(1)

      expect(mockedPrisma.feed.findMany).toHaveBeenCalledWith({
        include: {
          item: true,
        },
        where: {
          id: 1,
        },
      })
      expect(result).toEqual(mockFeeds)
    })

    it('calls prisma.feed.findMany with correct parameters when id is undefined', async (): Promise<void> => {
      const mockFeeds: Feed[] = []
      mockedPrisma.feed.findMany.mockResolvedValue(mockFeeds)

      const result = await ormModels.feeds(undefined)

      expect(mockedPrisma.feed.findMany).toHaveBeenCalledWith({
        include: {
          item: true,
        },
        where: {
          id: undefined,
        },
      })
      expect(result).toEqual(mockFeeds)
    })

    it('returns feeds with item relation when feeds exist', async (): Promise<void> => {
      const mockFeeds: Feed[] = [
        {
          id: 1,
          content: 'First Feed Content',
          create_at: new Date('2023-01-01T00:00:00Z'),
          update_at: new Date('2023-01-01T00:00:00Z'),
          item_id: 1,
        },
        {
          id: 2,
          content: 'Second Feed Content',
          create_at: new Date('2023-01-02T00:00:00Z'),
          update_at: new Date('2023-01-02T00:00:00Z'),
          item_id: null,
        },
      ]
      mockedPrisma.feed.findMany.mockResolvedValue(mockFeeds)

      const result = await ormModels.feeds(undefined)

      expect(mockedPrisma.feed.findMany).toHaveBeenCalledWith({
        include: {
          item: true,
        },
        where: {
          id: undefined,
        },
      })
      expect(result).toEqual(mockFeeds)
      expect(result).toHaveLength(2)
    })

    it('returns single feed when specific id is provided', async (): Promise<void> => {
      const mockFeed: Feed[] = [
        {
          id: 5,
          content: 'Specific Feed Content',
          create_at: new Date('2023-01-05T00:00:00Z'),
          update_at: new Date('2023-01-05T00:00:00Z'),
          item_id: 3,
        },
      ]
      mockedPrisma.feed.findMany.mockResolvedValue(mockFeed)

      const result = await ormModels.feeds(5)

      expect(mockedPrisma.feed.findMany).toHaveBeenCalledWith({
        include: {
          item: true,
        },
        where: {
          id: 5,
        },
      })
      expect(result).toEqual(mockFeed)
      expect(result).toHaveLength(1)
    })

    it('includes item relation in the query', async (): Promise<void> => {
      mockedPrisma.feed.findMany.mockResolvedValue([])

      await ormModels.feeds(1)

      const callArgs = mockedPrisma.feed.findMany.mock.calls[0]?.[0]
      expect(callArgs?.include).toEqual({
        item: true,
      })
    })
  })
})
