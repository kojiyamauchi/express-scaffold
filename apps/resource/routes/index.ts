import express from 'express'

import { controllers } from '@/controllers'

const router = express.Router()

export const routes = {
  // View.
  primary: router.get('/', controllers.primary),
  secondary: router.get('/secondary', controllers.secondary),
  third: router.get('/third', controllers.third),
  userList: router.get('/user-list', controllers.userList),
  user: router.get('/user/:id', controllers.user),
  insertUser: router.get('/insert-user', controllers.insertUser),

  // API.
  insert: router.post('/api/user/', controllers.insert),
  update: router.put('/api/user/:id', controllers.update),
  delete: router.delete('/api/user/:id', controllers.delete),

  // ORM API
  ormUsers: router.get('/api/orm/users', controllers.ormUsers),
  ormItems: router.get('/api/orm/items', controllers.ormItems),
  ormOrders: router.get('/api/orm/orders', controllers.ormOrders),
  ormOrderItems: router.get('/api/orm/order-items', controllers.ormOrderItems),
}
