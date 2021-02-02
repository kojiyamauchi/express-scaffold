import express from 'express'
import { controllers } from '../controllers'
const router = express.Router()

export const routes = {
  primary: router.get('/', controllers.primary),
  secondary: router.get('/secondary', controllers.secondary),
  third: router.get('/third', controllers.third),
  fourth: router.get('/fourth', controllers.fourth)
}
