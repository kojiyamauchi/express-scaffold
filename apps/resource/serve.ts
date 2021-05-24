import app from './app'
import path from 'path'
import fs from 'fs'
import https from 'https'

/* TBD for Http Server.
import http from 'http'
const env = app.get('env')
const server = http.createServer(app)
server.listen(3000, () => console.info('Http Application Started'))
*/

const setupHttps = {
  key: fs.readFileSync(path.resolve(__dirname, '../server.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../server.cert'))
}
const server = https.createServer(setupHttps, app)
server.listen(3000, () => console.info('Https Application Started.'))
