import dotenv from 'dotenv'
import type { MysqlError } from 'mysql'
import type { QueryError, ResultSetHeader, RowDataPacket } from 'mysql2'
import mysql from 'mysql2'
import path from 'path'

import type { User, UserList } from '../schemas/User'

type RowDataUser = User & RowDataPacket

const rootEnv = path.resolve(`${__dirname}/` + '../../../.env')
const deliveryDir = path.resolve(`${__dirname}/` + '../../../delivery/')
dotenv.config({ path: rootEnv })

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_ROOT_PASS,
  database: process.env.DB_NAME,
  dateStrings: true
})

con.connect(function (err) {
  if (err) {
    throw `Database Un Connected Error Below \n${err}`
  }
  console.log('Database Connected')
})

export const models = {
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
      con.query(sql, (error: MysqlError, results: UserList) => {
        if (error) {
          console.error('Error', error)
          reject(error)
          return
        }
        console.log('userList', results)
        resolve(results)
      })
    })
  },
  user: (userId: number): Promise<RowDataUser[] | QueryError> => {
    const sql = 'SELECT * FROM User WHERE id = ?;'
    return new Promise((resolve, reject) => {
      con.query<RowDataUser[]>(sql, userId, (error: QueryError | null, result: RowDataUser[]) => {
        if (error) {
          console.error('Error', error)
          reject(error)
          return
        }
        console.log('User', result)
        resolve(result)
      })
    })
  },
  insert: (reqBody: string[]): Promise<ResultSetHeader | QueryError> => {
    const sql = 'INSERT INTO User(name, url, phone, email, create_at, update_at) VALUES(?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
    return new Promise((resolve, reject) => {
      con.query(sql, reqBody, (error: QueryError | null, result: ResultSetHeader) => {
        if (error) {
          console.error('Error', error)
          reject(error)
          return
        }
        // Output Result Set Header.
        console.log(result)
        resolve(result)
      })
    })
  },
  update: (reqBody: string[]): Promise<ResultSetHeader | QueryError> => {
    const sql = 'UPDATE User SET name = ?, url = ?, phone = ?, email = ?, update_at = CURRENT_TIMESTAMP WHERE id = ?;'
    return new Promise((resolve, reject) => {
      con.query(sql, reqBody, (error: QueryError | null, result: ResultSetHeader) => {
        if (error) {
          console.error('Error', error)
          reject(error)
          return
        }
        // Output Result Set Header.
        console.log(result)
        resolve(result)
      })
    })
  },
  delete: (userId: number): Promise<ResultSetHeader | QueryError> => {
    const sql = 'DELETE FROM User WHERE id = ?;'
    return new Promise((resolve, reject) => {
      con.query(sql, userId, (error: QueryError | null, result: ResultSetHeader) => {
        if (error) {
          console.error('Error', error)
          reject(error)
          return
        }
        // Output Result Set Header.
        console.log(result)
        resolve(result)
      })
    })
  }
}
