const path = require('path')
const root = path.resolve(`${__dirname}/` + '../delivery/')

module.exports = {
  files: ['./resource/**/*', `${root}/**/*`],
  https: true,
  open: false,
  proxy: {
    target: 'https://localhost:3000'
  },
  port: 8000,
  browser: 'google chrome canary',
  reloadDelay: 10000, // TODO: PC買い替えて確認する
  ui: {
    port: 9999
  }
}
