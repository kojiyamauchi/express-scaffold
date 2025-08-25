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
  ormUser: router.get('/api/orm/user', controllers.ormUser),
  ormItem: router.get('/api/orm/item', controllers.ormItem),
  ormOrder: router.get('/api/orm/order', controllers.ormOrder),
  ormOrderItem: router.get('/api/orm/order-item', controllers.ormOrderItem),
  ormCreateUser: router.post('/api/orm/create-user', controllers.ormCreateUser),
  ormUpdateUser: router.put('/api/orm/update-user', controllers.ormUpdateUser),
  ormDeleteUser: router.delete('/api/orm/delete-user', controllers.ormDeleteUser),
  ormCreateOrder: router.post('/api/orm/create-order', controllers.ormCreateOrder),
}
