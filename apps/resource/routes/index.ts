import express from 'express'
import { controllers } from '../controllers'
const router = express.Router()

export const primary = router.get('/', controllers.primary)
export const secondary = router.get('/secondary', controllers.secondary)
export const third = router.get('/third', controllers.third)
export const fourth = router.get('/fourth', controllers.fourth)
