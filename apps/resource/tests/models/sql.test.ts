import type { MysqlError } from 'mysql'
import type { QueryError, ResultSetHeader } from 'mysql2'

import { db } from '@/libs'
import { sqlModels } from '@/models'
import type { User, UserList } from '@/schemas'

jest.mock('@/libs', () => ({
  db: {
    query: jest.fn(),
  },
}))

const mockedDb = db as jest.Mocked<typeof db>

describe('sqlModels', (): void => {
  const originalEnv = process.env

  beforeEach((): void => {
    jest.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterAll((): void => {
    process.env = originalEnv
  })

  describe('deliveryDir', (): void => {
    it('returns correct delivery directory path', (): void => {
      const result = sqlModels.deliveryDir()

      expect(result).toBe(`Looking For Delivery Dir From Models.\n/Users/kojiyamauchi/Desktop/application-templates/express-scaffold/delivery`)
    })
  })

  describe('primaryEnv', (): void => {
    it('returns PRIMARY_ENV environment variable', (): void => {
      process.env.PRIMARY_ENV = 'production'

      const result = sqlModels.primaryEnv()

      expect(result).toBe('production')
    })

    it('returns undefined when PRIMARY_ENV is not set', (): void => {
      delete process.env.PRIMARY_ENV

      const result = sqlModels.primaryEnv()

      expect(result).toBeUndefined()
    })
  })

  describe('secondaryEnv', (): void => {
    it('returns SECONDARY_ENV environment variable', (): void => {
      process.env.SECONDARY_ENV = 'staging'

      const result = sqlModels.secondaryEnv()

      expect(result).toBe('staging')
    })

    it('returns undefined when SECONDARY_ENV is not set', (): void => {
      delete process.env.SECONDARY_ENV

      const result = sqlModels.secondaryEnv()

      expect(result).toBeUndefined()
    })
  })

  describe('userList', (): void => {
    it('resolves with user list when query succeeds', async (): Promise<void> => {
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

      mockedDb.query.mockImplementation(((_sql: string, callback: (error: MysqlError | null, results?: UserList) => void) => {
        callback(null, mockUsers)
      }) as unknown as typeof mockedDb.query)

      const result = await sqlModels.userList()

      expect(mockedDb.query).toHaveBeenCalledWith('SELECT * FROM User;', expect.any(Function))
      expect(result).toEqual(mockUsers)
    })

    it('rejects with error when query fails', async (): Promise<void> => {
      const mockError = {
        code: 'ER_NO_SUCH_TABLE',
        errno: 1146,
        sqlMessage: "Table 'test.User' doesn't exist",
        sqlState: '42S02',
        sql: 'SELECT * FROM User;',
        name: 'Error',
        message: "Table 'test.User' doesn't exist",
      } as MysqlError

      mockedDb.query.mockImplementation(((_sql: string, callback: (error: MysqlError | null, results?: UserList) => void) => {
        callback(mockError)
      }) as unknown as typeof mockedDb.query)

      await expect(sqlModels.userList()).rejects.toEqual(mockError)
    })
  })

  describe('user', (): void => {
    it('resolves with user data when query succeeds', async (): Promise<void> => {
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        url: 'https://example.com',
        phone: '090-1234-5678',
        email: 'test@example.com',
        create_at: new Date('2023-01-01T00:00:00Z'),
        update_at: new Date('2023-01-01T00:00:00Z'),
      }

      mockedDb.query.mockImplementation(((_sql: string, _userId: number, callback: (error: QueryError | null, result?: User[]) => void) => {
        callback(null, [mockUser])
      }) as unknown as typeof mockedDb.query)

      const result = await sqlModels.user(1)

      expect(mockedDb.query).toHaveBeenCalledWith('SELECT * FROM User WHERE id = ?;', 1, expect.any(Function))
      expect(result).toEqual([mockUser])
    })

    it('rejects with error when query fails', async (): Promise<void> => {
      const mockError = {
        code: 'ER_NO_SUCH_TABLE',
        errno: 1146,
        message: "Table 'test.User' doesn't exist",
        name: 'Error',
      } as QueryError

      mockedDb.query.mockImplementation(((_sql: string, _userId: number, callback: (error: QueryError | null, result?: User[]) => void) => {
        callback(mockError)
      }) as unknown as typeof mockedDb.query)

      await expect(sqlModels.user(1)).rejects.toEqual(mockError)
    })
  })

  describe('insert', (): void => {
    it('resolves with ResultSetHeader when insert succeeds', async (): Promise<void> => {
      const mockResult = {
        insertId: 1,
        affectedRows: 1,
        fieldCount: 0,
        info: '',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0,
      } as ResultSetHeader

      const reqBody = ['Test User', 'https://example.com', '090-1234-5678', 'test@example.com']

      mockedDb.query.mockImplementation(((_sql: string, _reqBody: string[], callback: (error: QueryError | null, result?: ResultSetHeader) => void) => {
        callback(null, mockResult)
      }) as unknown as typeof mockedDb.query)

      const result = await sqlModels.insert(reqBody)

      expect(mockedDb.query).toHaveBeenCalledWith(
        'INSERT INTO User(name, url, phone, email, create_at, update_at) VALUES(?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        reqBody,
        expect.any(Function),
      )
      expect(result).toEqual(mockResult)
    })

    it('rejects with error when insert fails', async (): Promise<void> => {
      const mockError = {
        code: 'ER_DUP_ENTRY',
        errno: 1062,
        message: "Duplicate entry 'test@example.com' for key 'email'",
        name: 'Error',
      } as QueryError

      const reqBody = ['Test User', 'https://example.com', '090-1234-5678', 'test@example.com']

      mockedDb.query.mockImplementation(((_sql: string, _reqBody: string[], callback: (error: QueryError | null, result?: ResultSetHeader) => void) => {
        callback(mockError)
      }) as unknown as typeof mockedDb.query)

      await expect(sqlModels.insert(reqBody)).rejects.toEqual(mockError)
    })
  })

  describe('update', (): void => {
    it('resolves with ResultSetHeader when update succeeds', async (): Promise<void> => {
      const mockResult = {
        insertId: 0,
        affectedRows: 1,
        fieldCount: 0,
        info: '',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 1,
      } as ResultSetHeader

      const reqBody = ['Updated User', 'https://updated.com', '090-9999-9999', 'updated@example.com', '1']

      mockedDb.query.mockImplementation(((_sql: string, _reqBody: string[], callback: (error: QueryError | null, result?: ResultSetHeader) => void) => {
        callback(null, mockResult)
      }) as unknown as typeof mockedDb.query)

      const result = await sqlModels.update(reqBody)

      expect(mockedDb.query).toHaveBeenCalledWith(
        'UPDATE User SET name = ?, url = ?, phone = ?, email = ?, update_at = CURRENT_TIMESTAMP WHERE id = ?;',
        reqBody,
        expect.any(Function),
      )
      expect(result).toEqual(mockResult)
    })

    it('rejects with error when update fails', async (): Promise<void> => {
      const mockError = {
        code: 'ER_NO_SUCH_TABLE',
        errno: 1146,
        message: "Table 'test.User' doesn't exist",
        name: 'Error',
      } as QueryError

      const reqBody = ['Updated User', 'https://updated.com', '090-9999-9999', 'updated@example.com', '1']

      mockedDb.query.mockImplementation(((_sql: string, _reqBody: string[], callback: (error: QueryError | null, result?: ResultSetHeader) => void) => {
        callback(mockError)
      }) as unknown as typeof mockedDb.query)

      await expect(sqlModels.update(reqBody)).rejects.toEqual(mockError)
    })
  })

  describe('delete', (): void => {
    it('resolves with ResultSetHeader when delete succeeds', async (): Promise<void> => {
      const mockResult = {
        insertId: 0,
        affectedRows: 1,
        fieldCount: 0,
        info: '',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0,
      } as ResultSetHeader

      mockedDb.query.mockImplementation(((_sql: string, _userId: number, callback: (error: QueryError | null, result?: ResultSetHeader) => void) => {
        callback(null, mockResult)
      }) as unknown as typeof mockedDb.query)

      const result = await sqlModels.delete(1)

      expect(mockedDb.query).toHaveBeenCalledWith('DELETE FROM User WHERE id = ?;', 1, expect.any(Function))
      expect(result).toEqual(mockResult)
    })

    it('rejects with error when delete fails', async (): Promise<void> => {
      const mockError = {
        code: 'ER_ROW_IS_REFERENCED_2',
        errno: 1451,
        message: 'Cannot delete or update a parent row: a foreign key constraint fails',
        name: 'Error',
      } as QueryError

      mockedDb.query.mockImplementation(((_sql: string, _userId: number, callback: (error: QueryError | null, result?: ResultSetHeader) => void) => {
        callback(mockError)
      }) as unknown as typeof mockedDb.query)

      await expect(sqlModels.delete(1)).rejects.toEqual(mockError)
    })
  })
})
