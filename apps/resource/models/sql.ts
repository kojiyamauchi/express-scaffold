import type { MysqlError } from 'mysql'
import type { QueryError, ResultSetHeader, RowDataPacket } from 'mysql2'
import path from 'path'

import { db, prisma } from '@/libs'
import type { User, UserList } from '@/schemas'

void (async (): Promise<void> => {
  const result = await prisma.user.findMany()
  console.info('prisma.user.findMany()', result)
})()

type RowDataUser = User & RowDataPacket

const deliveryDir = path.resolve(`${__dirname}/` + '../../../delivery/')

export const sqlModels = {
  deliveryDir: (): string | undefined => {
    return `Looking For Delivery Dir From Models.\n${deliveryDir}`
  },
  primaryEnv: (): string | undefined => {
    return process.env.PRIMARY_ENV
  },
  secondaryEnv: (): string | undefined => {
    return process.env.SECONDARY_ENV
  },
  userList: (): Promise<UserList | MysqlError> => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM User;'
      db.query(sql, (error: MysqlError, results: UserList) => {
        if (error) {
          console.error('Error', error)
          reject(error)
          return
        }
        console.info('userList', results)
        resolve(results)
      })
    })
  },
  user: (userId: number): Promise<RowDataUser[] | QueryError> => {
    const sql = 'SELECT * FROM User WHERE id = ?;'
    return new Promise((resolve, reject) => {
      db.query<RowDataUser[]>(sql, userId, (error: QueryError | null, result: RowDataUser[]) => {
        if (error) {
          console.error('Error', error)
          reject(error)
          return
        }
        console.info('User', result)
        resolve(result)
      })
    })
  },
  insert: (reqBody: string[]): Promise<ResultSetHeader | QueryError> => {
    const sql = 'INSERT INTO User(name, url, phone, email, create_at, update_at) VALUES(?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
    return new Promise((resolve, reject) => {
      db.query(sql, reqBody, (error: QueryError | null, result: ResultSetHeader) => {
        if (error) {
          console.error('Error', error)
          reject(error)
          return
        }
        // Output Result Set Header.
        console.info(result)
        resolve(result)
      })
    })
  },
  update: (reqBody: string[]): Promise<ResultSetHeader | QueryError> => {
    const sql = 'UPDATE User SET name = ?, url = ?, phone = ?, email = ?, update_at = CURRENT_TIMESTAMP WHERE id = ?;'
    return new Promise((resolve, reject) => {
      db.query(sql, reqBody, (error: QueryError | null, result: ResultSetHeader) => {
        if (error) {
          console.error('Error', error)
          reject(error)
          return
        }
        // Output Result Set Header.
        console.info(result)
        resolve(result)
      })
    })
  },
  delete: (userId: number): Promise<ResultSetHeader | QueryError> => {
    const sql = 'DELETE FROM User WHERE id = ?;'
    return new Promise((resolve, reject) => {
      db.query(sql, userId, (error: QueryError | null, result: ResultSetHeader) => {
        if (error) {
          console.error('Error', error)
          reject(error)
          return
        }
        // Output Result Set Header.
        console.info(result)
        resolve(result)
      })
    })
  },
}
