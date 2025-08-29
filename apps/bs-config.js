const path = require('path')
const root = path.resolve(`${__dirname}/` + '../delivery/')

module.exports = {
  files: ['./resource/**/*', `${root}/**/*`],
  https: true,
  open: false,
  proxy: {
    target: 'https://localhost:4000',
  },
  port: 8000,
  browser: 'google chrome canary',
  reloadDelay: 1000,
  ui: {
    port: 9999,
  },
}
