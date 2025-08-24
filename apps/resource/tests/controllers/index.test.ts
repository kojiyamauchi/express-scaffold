import type { Item, Order, OrderItem, User } from '@prisma/client'
import type { Decimal } from '@prisma/client/runtime/library'
import { Request, Response } from 'express'
import type { ResultSetHeader } from 'mysql2'
import type { ZodError } from 'zod'

import { controllers } from '@/controllers'
import { ormModels, sqlModels } from '@/models'
import type { User as UserType, UserList } from '@/schemas'
import { userSchema } from '@/schemas'

jest.mock('@/models', () => ({
  ormModels: {
    users: jest.fn(),
    items: jest.fn(),
    orders: jest.fn(),
    orderItems: jest.fn(),
    user: jest.fn(),
    item: jest.fn(),
    order: jest.fn(),
    orderItem: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  },
  sqlModels: {
    deliveryDir: jest.fn().mockReturnValue('/mock/delivery'),
    primaryEnv: jest.fn().mockReturnValue('test'),
    secondaryEnv: jest.fn().mockReturnValue('test'),
    userList: jest.fn(),
    user: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}))

jest.mock('@/schemas', () => ({
  userSchema: {
    safeParse: jest.fn(),
  },
}))

const mockedOrmModels = ormModels as jest.Mocked<typeof ormModels>
const mockedSqlModels = sqlModels as jest.Mocked<typeof sqlModels>
const mockedUserSchema = userSchema as jest.Mocked<typeof userSchema>

const mockRequest = (overrides = {}): Partial<Request> => ({
  params: {},
  query: {},
  body: {},
  ...overrides,
})

const mockResponse = (): Partial<Response> => {
  const res = {} as Partial<Response>
  res.render = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  res.redirect = jest.fn().mockReturnValue(res)
  res.status = jest.fn().mockReturnValue(res)
  return res
}

describe('controllers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('View Controllers', () => {
    describe('primary', () => {
      it('renders index.ejs with correct heading', () => {
        const req = mockRequest()
        const res = mockResponse()

        controllers.primary(req as Request, res as Response)

        expect(res.render).toHaveBeenCalledWith('./index.ejs', { heading: 'This is Primary Page.' })
      })
    })

    describe('secondary', () => {
      it('renders secondary/index.ejs with correct heading', () => {
        const req = mockRequest()
        const res = mockResponse()

        controllers.secondary(req as Request, res as Response)

        expect(res.render).toHaveBeenCalledWith('./secondary/index.ejs', { heading: 'This is Secondary Page.' })
      })
    })

    describe('third', () => {
      it('renders third/index.ejs with correct heading', () => {
        const req = mockRequest()
        const res = mockResponse()

        controllers.third(req as Request, res as Response)

        expect(res.render).toHaveBeenCalledWith('./third/index.ejs', { heading: 'This is Third Page.' })
      })
    })

    describe('insertUser', () => {
      it('renders insert-user/index.ejs with correct heading', () => {
        const req = mockRequest()
        const res = mockResponse()

        controllers.insertUser(req as Request, res as Response)

        expect(res.render).toHaveBeenCalledWith('./insert-user/index.ejs', { heading: 'Insert User.' })
      })
    })

    describe('userList', () => {
      it('renders user-list with formatted users when userList returns data', async () => {
        const mockUsers: UserList = [
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
        mockedSqlModels.userList.mockResolvedValue(mockUsers)

        const req = mockRequest()
        const res = mockResponse()

        await controllers.userList(req as Request, res as Response)

        expect(mockedSqlModels.userList).toHaveBeenCalled()
        expect(res.render).toHaveBeenCalledWith('./user-list/index.ejs', {
          heading: 'User List.',
          userList: expect.arrayContaining([
            expect.objectContaining({
              id: 1,
              name: 'Test User',
              url: 'https://example.com',
              phone: '090-1234-5678',
              email: 'test@example.com',
              create_at: '2023-01-01 09:00:00',
              update_at: '2023-01-01 09:00:00',
            }),
          ]),
        })
      })

      it('renders server error when userList throws error', async () => {
        mockedSqlModels.userList.mockRejectedValue(new Error('Database error'))

        const req = mockRequest()
        const res = mockResponse()

        await controllers.userList(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.render).toHaveBeenCalledWith('server-error', {
          heading: '500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀',
        })
      })
    })

    describe('user', () => {
      it('renders user page with formatted user data', async () => {
        const mockUser: UserType = {
          id: 1,
          name: 'Test User',
          url: 'https://example.com',
          phone: '090-1234-5678',
          email: 'test@example.com',
          create_at: new Date('2023-01-01T00:00:00Z'),
          update_at: new Date('2023-01-01T00:00:00Z'),
        }
        mockedSqlModels.user.mockResolvedValue([mockUser as unknown as UserType & { constructor: { name: 'RowDataPacket' } }])

        const req = mockRequest({ params: { id: '1' } })
        const res = mockResponse()

        await controllers.user(req as Request, res as Response)

        expect(mockedSqlModels.user).toHaveBeenCalledWith(1)
        expect(res.render).toHaveBeenCalledWith('./user/index.ejs', {
          heading: 'User #1.',
          timestamp: {
            createAt: '2023-01-01 09:00:00',
            updateAt: '2023-01-01 09:00:00',
          },
          user: {
            id: 1,
            name: 'Test User',
            url: 'https://example.com',
            phone1: '090',
            phone2: '1234',
            phone3: '5678',
            email: 'test@example.com',
          },
        })
      })

      it('renders server error when user throws error', async () => {
        mockedSqlModels.user.mockRejectedValue(new Error('Database error'))

        const req = mockRequest({ params: { id: '1' } })
        const res = mockResponse()

        await controllers.user(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.render).toHaveBeenCalledWith('server-error', {
          heading: '500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀',
        })
      })
    })
  })

  describe('API Controllers', () => {
    describe('insert', () => {
      it('inserts user and redirects when validation passes', async () => {
        const validData = {
          name: 'Test User',
          url: 'https://example.com',
          phone1: '090',
          phone2: '1234',
          phone3: '5678',
          email: 'test@example.com',
        }
        mockedUserSchema.safeParse.mockReturnValue({
          success: true,
          data: validData,
        })

        const mockResult = {
          insertId: 1,
          affectedRows: 1,
          fieldCount: 0,
          info: '',
          serverStatus: 2,
          warningStatus: 0,
          changedRows: 0,
        } as ResultSetHeader
        mockedSqlModels.insert.mockResolvedValue(mockResult)

        const req = mockRequest({ body: validData })
        const res = mockResponse()

        await controllers.insert(req as Request, res as Response)

        expect(mockedUserSchema.safeParse).toHaveBeenCalledWith(validData)
        expect(mockedSqlModels.insert).toHaveBeenCalledWith(['Test User', 'https://example.com', '090-1234-5678', 'test@example.com'])
        expect(res.redirect).toHaveBeenCalledWith('/user/1')
      })

      it('renders validation error when validation fails', async () => {
        const invalidData = { name: '' }
        const mockZodError = {
          issues: [{ path: ['name'], message: '氏名は1文字以上で入力してください', code: 'custom' as const }],
          format: jest.fn(),
          flatten: jest.fn(),
          addIssue: jest.fn(),
          addIssues: jest.fn(),
          isEmpty: false,
        } as unknown as ZodError<{ name: string; url: string; phone1: string; phone2: string; phone3: string; email: string }>

        mockedUserSchema.safeParse.mockReturnValue({
          success: false,
          error: mockZodError,
        })

        const req = mockRequest({ body: invalidData })
        const res = mockResponse()

        await controllers.insert(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.render).toHaveBeenCalledWith('validate-error', {
          heading: 'フォーム: name <br> 氏名は1文字以上で入力してください',
        })
      })

      it('renders server error when insert fails', async () => {
        const validData = {
          name: 'Test User',
          url: 'https://example.com',
          phone1: '090',
          phone2: '1234',
          phone3: '5678',
          email: 'test@example.com',
        }
        mockedUserSchema.safeParse.mockReturnValue({
          success: true,
          data: validData,
        })
        mockedSqlModels.insert.mockRejectedValue(new Error('Database error'))

        const req = mockRequest({ body: validData })
        const res = mockResponse()

        await controllers.insert(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.render).toHaveBeenCalledWith('server-error', {
          heading: '500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀',
        })
      })
    })

    describe('update', () => {
      it('updates user and redirects when validation passes', async () => {
        const validData = {
          name: 'Updated User',
          url: 'https://example.com',
          phone1: '090',
          phone2: '1234',
          phone3: '5678',
          email: 'updated@example.com',
        }
        mockedUserSchema.safeParse.mockReturnValue({
          success: true,
          data: validData,
        })

        const mockResult = {
          insertId: 0,
          affectedRows: 1,
          fieldCount: 0,
          info: '',
          serverStatus: 2,
          warningStatus: 0,
          changedRows: 1,
        } as ResultSetHeader
        mockedSqlModels.update.mockResolvedValue(mockResult)

        const req = mockRequest({ params: { id: '1' }, body: validData })
        const res = mockResponse()

        await controllers.update(req as Request, res as Response)

        expect(mockedUserSchema.safeParse).toHaveBeenCalledWith(validData)
        expect(mockedSqlModels.update).toHaveBeenCalledWith(['Updated User', 'https://example.com', '090-1234-5678', 'updated@example.com', '1'])
        expect(res.redirect).toHaveBeenCalledWith('/user/1')
      })

      it('renders validation error when validation fails', async () => {
        const invalidData = { name: '' }
        const mockZodError = {
          issues: [{ path: ['name'], message: '氏名は1文字以上で入力してください', code: 'custom' as const }],
          format: jest.fn(),
          flatten: jest.fn(),
          addIssue: jest.fn(),
          addIssues: jest.fn(),
          isEmpty: false,
        } as unknown as ZodError<{ name: string; url: string; phone1: string; phone2: string; phone3: string; email: string }>

        mockedUserSchema.safeParse.mockReturnValue({
          success: false,
          error: mockZodError,
        })

        const req = mockRequest({ params: { id: '1' }, body: invalidData })
        const res = mockResponse()

        await controllers.update(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.render).toHaveBeenCalledWith('validate-error', {
          heading: 'フォーム: name <br> 氏名は1文字以上で入力してください',
        })
      })

      it('renders server error when update fails', async () => {
        const validData = {
          name: 'Updated User',
          url: 'https://example.com',
          phone1: '090',
          phone2: '1234',
          phone3: '5678',
          email: 'updated@example.com',
        }
        mockedUserSchema.safeParse.mockReturnValue({
          success: true,
          data: validData,
        })
        mockedSqlModels.update.mockRejectedValue(new Error('Database error'))

        const req = mockRequest({ params: { id: '1' }, body: validData })
        const res = mockResponse()

        await controllers.update(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.render).toHaveBeenCalledWith('server-error', {
          heading: '500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀',
        })
      })
    })

    describe('delete', () => {
      it('deletes user and redirects to user list', async () => {
        const mockResult = {
          insertId: 0,
          affectedRows: 1,
          fieldCount: 0,
          info: '',
          serverStatus: 2,
          warningStatus: 0,
          changedRows: 0,
        } as ResultSetHeader
        mockedSqlModels.delete.mockResolvedValue(mockResult)

        const req = mockRequest({ params: { id: '1' } })
        const res = mockResponse()

        await controllers.delete(req as Request, res as Response)

        expect(mockedSqlModels.delete).toHaveBeenCalledWith(1)
        expect(res.redirect).toHaveBeenCalledWith('/user-list')
      })

      it('renders server error when delete fails', async () => {
        mockedSqlModels.delete.mockRejectedValue(new Error('Database error'))

        const req = mockRequest({ params: { id: '1' } })
        const res = mockResponse()

        await controllers.delete(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.render).toHaveBeenCalledWith('server-error', {
          heading: '500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀',
        })
      })
    })
  })

  describe('ORM API Controllers', () => {
    describe('ormUsers', () => {
      it('returns JSON when users found', async () => {
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
        mockedOrmModels.users.mockResolvedValue(mockUsers)

        const req = mockRequest({ query: { id: '1' } })
        const res = mockResponse()

        await controllers.ormUsers(req as Request, res as Response)

        expect(mockedOrmModels.users).toHaveBeenCalledWith(1)
        expect(res.json).toHaveBeenCalledWith(mockUsers)
      })

      it('returns no results message when no users found', async () => {
        mockedOrmModels.users.mockResolvedValue([])

        const req = mockRequest()
        const res = mockResponse()

        await controllers.ormUsers(req as Request, res as Response)

        expect(mockedOrmModels.users).toHaveBeenCalledWith(undefined)
        expect(res.send).toHaveBeenCalledWith('No results found.')
      })

      it('renders server error when ormUsers throws error', async () => {
        mockedOrmModels.users.mockRejectedValue(new Error('Database error'))

        const req = mockRequest()
        const res = mockResponse()

        await controllers.ormUsers(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.render).toHaveBeenCalledWith('server-error', {
          heading: '500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀',
        })
      })
    })

    describe('ormItems', () => {
      it('returns JSON when items found', async () => {
        const mockItems: Item[] = [
          {
            id: 1,
            product_name: 'Test Product',
            price: { toNumber: () => 1000, toString: () => '1000' } as Decimal,
          },
        ]
        mockedOrmModels.items.mockResolvedValue(mockItems)

        const req = mockRequest({ query: { id: '1' } })
        const res = mockResponse()

        await controllers.ormItems(req as Request, res as Response)

        expect(mockedOrmModels.items).toHaveBeenCalledWith(1)
        expect(res.json).toHaveBeenCalledWith(mockItems)
      })

      it('returns no results message when no items found', async () => {
        mockedOrmModels.items.mockResolvedValue([])

        const req = mockRequest()
        const res = mockResponse()

        await controllers.ormItems(req as Request, res as Response)

        expect(mockedOrmModels.items).toHaveBeenCalledWith(undefined)
        expect(res.send).toHaveBeenCalledWith('No results found.')
      })

      it('renders server error when ormItems throws error', async () => {
        mockedOrmModels.items.mockRejectedValue(new Error('Database error'))

        const req = mockRequest()
        const res = mockResponse()

        await controllers.ormItems(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.render).toHaveBeenCalledWith('server-error', {
          heading: '500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀',
        })
      })
    })

    describe('ormOrders', () => {
      it('returns JSON when orders found', async () => {
        const mockOrders: Order[] = [
          {
            id: 1,
            userId: 1,
            order_date: new Date('2023-01-01T00:00:00Z'),
            total_price: { toNumber: () => 1000, toString: () => '1000' } as Decimal,
          },
        ]
        mockedOrmModels.orders.mockResolvedValue(mockOrders)

        const req = mockRequest({ query: { id: '1' } })
        const res = mockResponse()

        await controllers.ormOrders(req as Request, res as Response)

        expect(mockedOrmModels.orders).toHaveBeenCalledWith(1)
        expect(res.json).toHaveBeenCalledWith(mockOrders)
      })

      it('returns no results message when no orders found', async () => {
        mockedOrmModels.orders.mockResolvedValue([])

        const req = mockRequest()
        const res = mockResponse()

        await controllers.ormOrders(req as Request, res as Response)

        expect(mockedOrmModels.orders).toHaveBeenCalledWith(undefined)
        expect(res.send).toHaveBeenCalledWith('No results found.')
      })

      it('renders server error when ormOrders throws error', async () => {
        mockedOrmModels.orders.mockRejectedValue(new Error('Database error'))

        const req = mockRequest()
        const res = mockResponse()

        await controllers.ormOrders(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.render).toHaveBeenCalledWith('server-error', {
          heading: '500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀',
        })
      })
    })

    describe('ormOrderItems', () => {
      it('returns JSON when order items found', async () => {
        const mockOrderItems: OrderItem[] = [
          {
            id: 1,
            order_id: 1,
            item_id: 1,
            quantity: 2,
          },
        ]
        mockedOrmModels.orderItems.mockResolvedValue(mockOrderItems)

        const req = mockRequest({ query: { id: '1' } })
        const res = mockResponse()

        await controllers.ormOrderItems(req as Request, res as Response)

        expect(mockedOrmModels.orderItems).toHaveBeenCalledWith(1)
        expect(res.json).toHaveBeenCalledWith(mockOrderItems)
      })

      it('returns no results message when no order items found', async () => {
        mockedOrmModels.orderItems.mockResolvedValue([])

        const req = mockRequest()
        const res = mockResponse()

        await controllers.ormOrderItems(req as Request, res as Response)

        expect(mockedOrmModels.orderItems).toHaveBeenCalledWith(undefined)
        expect(res.send).toHaveBeenCalledWith('No results found.')
      })

      it('renders server error when ormOrderItems throws error', async () => {
        mockedOrmModels.orderItems.mockRejectedValue(new Error('Database error'))

        const req = mockRequest()
        const res = mockResponse()

        await controllers.ormOrderItems(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.render).toHaveBeenCalledWith('server-error', {
          heading: '500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀',
        })
      })
    })

    describe('ormUser', () => {
      it('returns JSON when user found', async () => {
        const mockUser: User = {
          id: 1,
          name: 'Test User',
          url: 'https://example.com',
          phone: '090-1234-5678',
          email: 'test@example.com',
          create_at: new Date('2023-01-01T00:00:00Z'),
          update_at: new Date('2023-01-01T00:00:00Z'),
        }
        mockedOrmModels.user.mockResolvedValue(mockUser)

        const req = mockRequest({ query: { id: '1' } })
        const res = mockResponse()

        await controllers.ormUser(req as Request, res as Response)

        expect(mockedOrmModels.user).toHaveBeenCalledWith(1)
        expect(res.json).toHaveBeenCalledWith(mockUser)
      })

      it('returns no results message when user not found', async () => {
        mockedOrmModels.user.mockResolvedValue(null)

        const req = mockRequest({ query: { id: '1' } })
        const res = mockResponse()

        await controllers.ormUser(req as Request, res as Response)

        expect(res.send).toHaveBeenCalledWith('No results found.')
      })

      it('returns error message when id parameter is missing', async () => {
        const req = mockRequest({ query: {} })
        const res = mockResponse()

        await controllers.ormUser(req as Request, res as Response)

        expect(res.send).toHaveBeenCalledWith('Enter query parameter id.')
      })

      it('renders server error when ormUser throws error', async () => {
        mockedOrmModels.user.mockRejectedValue(new Error('Database error'))

        const req = mockRequest({ query: { id: '1' } })
        const res = mockResponse()

        await controllers.ormUser(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.render).toHaveBeenCalledWith('server-error', {
          heading: '500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀',
        })
      })
    })

    describe('ormItem', () => {
      it('returns JSON when item found', async () => {
        const mockItem: Item = {
          id: 1,
          product_name: 'Test Product',
          price: { toNumber: () => 1000, toString: () => '1000' } as Decimal,
        }
        mockedOrmModels.item.mockResolvedValue(mockItem)

        const req = mockRequest({ query: { id: '1' } })
        const res = mockResponse()

        await controllers.ormItem(req as Request, res as Response)

        expect(mockedOrmModels.item).toHaveBeenCalledWith(1)
        expect(res.json).toHaveBeenCalledWith(mockItem)
      })

      it('returns no results message when item not found', async () => {
        mockedOrmModels.item.mockResolvedValue(null)

        const req = mockRequest({ query: { id: '1' } })
        const res = mockResponse()

        await controllers.ormItem(req as Request, res as Response)

        expect(res.send).toHaveBeenCalledWith('No results found.')
      })

      it('returns error message when id parameter is missing', async () => {
        const req = mockRequest({ query: {} })
        const res = mockResponse()

        await controllers.ormItem(req as Request, res as Response)

        expect(res.send).toHaveBeenCalledWith('Enter query parameter id.')
      })

      it('renders server error when ormItem throws error', async () => {
        mockedOrmModels.item.mockRejectedValue(new Error('Database error'))

        const req = mockRequest({ query: { id: '1' } })
        const res = mockResponse()

        await controllers.ormItem(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.render).toHaveBeenCalledWith('server-error', {
          heading: '500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀',
        })
      })
    })

    describe('ormOrder', () => {
      it('returns JSON when order found', async () => {
        const mockOrder: Order = {
          id: 1,
          userId: 1,
          order_date: new Date('2023-01-01T00:00:00Z'),
          total_price: { toNumber: () => 1000, toString: () => '1000' } as Decimal,
        }
        mockedOrmModels.order.mockResolvedValue(mockOrder)

        const req = mockRequest({ query: { id: '1' } })
        const res = mockResponse()

        await controllers.ormOrder(req as Request, res as Response)

        expect(mockedOrmModels.order).toHaveBeenCalledWith(1)
        expect(res.json).toHaveBeenCalledWith(mockOrder)
      })

      it('returns no results message when order not found', async () => {
        mockedOrmModels.order.mockResolvedValue(null)

        const req = mockRequest({ query: { id: '1' } })
        const res = mockResponse()

        await controllers.ormOrder(req as Request, res as Response)

        expect(res.send).toHaveBeenCalledWith('No results found.')
      })

      it('returns error message when id parameter is missing', async () => {
        const req = mockRequest({ query: {} })
        const res = mockResponse()

        await controllers.ormOrder(req as Request, res as Response)

        expect(res.send).toHaveBeenCalledWith('Enter query parameter id.')
      })

      it('renders server error when ormOrder throws error', async () => {
        mockedOrmModels.order.mockRejectedValue(new Error('Database error'))

        const req = mockRequest({ query: { id: '1' } })
        const res = mockResponse()

        await controllers.ormOrder(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.render).toHaveBeenCalledWith('server-error', {
          heading: '500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀',
        })
      })
    })

    describe('ormOrderItem', () => {
      it('returns JSON when order item found', async () => {
        const mockOrderItem: OrderItem = {
          id: 1,
          order_id: 1,
          item_id: 1,
          quantity: 2,
        }
        mockedOrmModels.orderItem.mockResolvedValue(mockOrderItem)

        const req = mockRequest({ query: { id: '1' } })
        const res = mockResponse()

        await controllers.ormOrderItem(req as Request, res as Response)

        expect(mockedOrmModels.orderItem).toHaveBeenCalledWith(1)
        expect(res.json).toHaveBeenCalledWith(mockOrderItem)
      })

      it('returns no results message when order item not found', async () => {
        mockedOrmModels.orderItem.mockResolvedValue(null)

        const req = mockRequest({ query: { id: '1' } })
        const res = mockResponse()

        await controllers.ormOrderItem(req as Request, res as Response)

        expect(res.send).toHaveBeenCalledWith('No results found.')
      })

      it('returns error message when id parameter is missing', async () => {
        const req = mockRequest({ query: {} })
        const res = mockResponse()

        await controllers.ormOrderItem(req as Request, res as Response)

        expect(res.send).toHaveBeenCalledWith('Enter query parameter id.')
      })

      it('renders server error when ormOrderItem throws error', async () => {
        mockedOrmModels.orderItem.mockRejectedValue(new Error('Database error'))

        const req = mockRequest({ query: { id: '1' } })
        const res = mockResponse()

        await controllers.ormOrderItem(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.render).toHaveBeenCalledWith('server-error', {
          heading: '500 Internal Server Error,<br>Please Try Again Later.<br>Redirect to Top 🚀',
        })
      })
    })

    describe('ormCreateUser', () => {
      it('creates user and returns JSON when validation passes', async () => {
        const validData = {
          name: 'Test User',
          url: 'https://example.com',
          phone1: '090',
          phone2: '1234',
          phone3: '5678',
          email: 'test@example.com',
        }
        mockedUserSchema.safeParse.mockReturnValue({
          success: true,
          data: validData,
        })

        const mockCreatedUser: User = {
          id: 1,
          name: 'Test User',
          url: 'https://example.com',
          phone: '090-1234-5678',
          email: 'test@example.com',
          create_at: new Date('2023-01-01T00:00:00Z'),
          update_at: new Date('2023-01-01T00:00:00Z'),
        }
        mockedOrmModels.createUser.mockResolvedValue(mockCreatedUser)

        const req = mockRequest({ body: validData })
        const res = mockResponse()

        await controllers.ormCreateUser(req as Request, res as Response)

        expect(mockedUserSchema.safeParse).toHaveBeenCalledWith(validData)
        expect(mockedOrmModels.createUser).toHaveBeenCalledWith({
          name: 'Test User',
          url: 'https://example.com',
          phone: '090-1234-5678',
          email: 'test@example.com',
        })
        expect(res.json).toHaveBeenCalledWith(mockCreatedUser)
      })

      it('returns validation error when validation fails', async () => {
        const invalidData = { name: '' }
        const mockZodError = {
          issues: [{ path: ['name'], message: '氏名は1文字以上で入力してください', code: 'custom' as const }],
          format: jest.fn(),
          flatten: jest.fn(),
          addIssue: jest.fn(),
          addIssues: jest.fn(),
          isEmpty: false,
        } as unknown as ZodError<{ name: string; url: string; phone1: string; phone2: string; phone3: string; email: string }>

        mockedUserSchema.safeParse.mockReturnValue({
          success: false,
          error: mockZodError,
        })

        const req = mockRequest({ body: invalidData })
        const res = mockResponse()

        await controllers.ormCreateUser(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith('Server validate error: name - 氏名は1文字以上で入力してください')
      })

      it('returns server error when createUser fails', async () => {
        const validData = {
          name: 'Test User',
          url: 'https://example.com',
          phone1: '090',
          phone2: '1234',
          phone3: '5678',
          email: 'test@example.com',
        }
        mockedUserSchema.safeParse.mockReturnValue({
          success: true,
          data: validData,
        })
        mockedOrmModels.createUser.mockRejectedValue(new Error('Database error'))

        const req = mockRequest({ body: validData })
        const res = mockResponse()

        await controllers.ormCreateUser(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith('500 Internal Server Error.')
      })
    })

    describe('ormUpdateUser', () => {
      it('updates user and returns JSON when validation passes', async () => {
        const validData = {
          id: 1,
          name: 'Updated User',
          url: 'https://updated-example.com',
          phone1: '080',
          phone2: '9876',
          phone3: '5432',
          email: 'updated@example.com',
        }
        mockedUserSchema.safeParse.mockReturnValue({
          success: true,
          data: validData,
        })

        const mockUpdatedUser: User = {
          id: 1,
          name: 'Updated User',
          url: 'https://updated-example.com',
          phone: '080-9876-5432',
          email: 'updated@example.com',
          create_at: new Date('2023-01-01T00:00:00Z'),
          update_at: new Date('2023-01-02T00:00:00Z'),
        }
        mockedOrmModels.updateUser.mockResolvedValue(mockUpdatedUser)

        const req = mockRequest({ body: validData })
        const res = mockResponse()

        await controllers.ormUpdateUser(req as Request, res as Response)

        expect(mockedUserSchema.safeParse).toHaveBeenCalledWith(validData)
        expect(mockedOrmModels.updateUser).toHaveBeenCalledWith({
          id: 1,
          name: 'Updated User',
          url: 'https://updated-example.com',
          phone: '080-9876-5432',
          email: 'updated@example.com',
        })
        expect(res.json).toHaveBeenCalledWith(mockUpdatedUser)
      })

      it('returns validation error when validation fails', async () => {
        const invalidData = { id: 1, name: '' }
        const mockZodError = {
          issues: [{ path: ['name'], message: '氏名は1文字以上で入力してください', code: 'custom' as const }],
          format: jest.fn(),
          flatten: jest.fn(),
          addIssue: jest.fn(),
          addIssues: jest.fn(),
          isEmpty: false,
        } as unknown as ZodError<{ name: string; url: string; phone1: string; phone2: string; phone3: string; email: string }>

        mockedUserSchema.safeParse.mockReturnValue({
          success: false,
          error: mockZodError,
        })

        const req = mockRequest({ body: invalidData })
        const res = mockResponse()

        await controllers.ormUpdateUser(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith('Server validate error: name - 氏名は1文字以上で入力してください')
      })

      it('returns server error when updateUser fails', async () => {
        const validData = {
          id: 1,
          name: 'Updated User',
          url: 'https://updated-example.com',
          phone1: '080',
          phone2: '9876',
          phone3: '5432',
          email: 'updated@example.com',
        }
        mockedUserSchema.safeParse.mockReturnValue({
          success: true,
          data: validData,
        })
        mockedOrmModels.updateUser.mockRejectedValue(new Error('Database error'))

        const req = mockRequest({ body: validData })
        const res = mockResponse()

        await controllers.ormUpdateUser(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith('500 Internal Server Error.')
      })
    })

    describe('ormDeleteUser', () => {
      it('deletes user and returns JSON when id is valid number', async () => {
        const mockDeletedUser: User = {
          id: 1,
          name: 'Test User',
          url: 'https://example.com',
          phone: '090-1234-5678',
          email: 'test@example.com',
          create_at: new Date('2023-01-01T00:00:00Z'),
          update_at: new Date('2023-01-01T00:00:00Z'),
        }
        mockedOrmModels.deleteUser.mockResolvedValue(mockDeletedUser)

        const req = mockRequest({ body: { id: 1 } })
        const res = mockResponse()

        await controllers.ormDeleteUser(req as Request, res as Response)

        expect(mockedOrmModels.deleteUser).toHaveBeenCalledWith(1)
        expect(res.json).toHaveBeenCalledWith(mockDeletedUser)
      })

      it('returns validation error when id is not number', async () => {
        const req = mockRequest({ body: { id: 'not-a-number' } })
        const res = mockResponse()

        await controllers.ormDeleteUser(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith('Server validate error: Id is not number type')
      })

      it('returns server error when deleteUser fails', async () => {
        mockedOrmModels.deleteUser.mockRejectedValue(new Error('Database error'))

        const req = mockRequest({ body: { id: 1 } })
        const res = mockResponse()

        await controllers.ormDeleteUser(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith('500 Internal Server Error.')
      })
    })
  })
})
