const path = require('path')
const root = path.resolve(`${__dirname}/` + '../delivery/')

module.exports = {
  files: ['./resource/**/*', `${root}/**/*`],
  https: true,
  proxy: {
    target: 'https://localhost:3000'
  },
  port: 4000,
  browser: 'google chrome canary',
  reloadDelay: 3500
}
