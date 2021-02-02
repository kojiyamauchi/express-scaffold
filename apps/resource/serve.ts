import app from './app'
import path from 'path'

app.listen(3000, () => {
  console.log('Looking Delivery Dir From Serve.ts\n', path.resolve(`${__dirname}/` + '../../delivery/'))
  console.log('Application started')
})
