const path = require('path')
const root = path.resolve(`${__dirname}/` + '../delivery/')

module.exports = {
  files: ['./resource/**/*', `${root}/**/*`],
  proxy: 'localhost:3000',
  port: 4000,
  browser: 'google chrome canary'
}
