import fs from 'fs'
import https from 'https'
import path from 'path'

import app from '@/app'

/* TBD for Http Server.
import http from 'http'
const env = app.get('env')
const server = http.createServer(app)
server.listen(3000, () => console.info('Http Application Started'))
*/

const setupHttps = {
  key: fs.readFileSync(path.resolve(__dirname, '../server.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../server.cert')),
}
const server = https.createServer(setupHttps, app)
server.listen(4000, () => console.info('Https Application Started.'))
