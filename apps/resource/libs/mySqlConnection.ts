import mysql from 'mysql2'

import { dotEnvConfig } from '@/utils'
dotEnvConfig()

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_ROOT_PASS,
  database: process.env.DB_NAME,
  dateStrings: true,
})

db.connect(function (err) {
  if (err) {
    throw `Database Un Connected Error Below \n${err}`
  }
  console.info('Database Connected')
})
