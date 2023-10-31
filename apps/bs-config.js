const path = require('path')
const root = path.resolve(`${__dirname}/` + '../delivery/')

module.exports = {
  files: ['./resource/**/*', `${root}/**/*`],
  https: true,
  open: false,
  proxy: {
    target: 'https://localhost:3000'
  },
  port: 8080,
  browser: 'google chrome canary',
  reloadDelay: 7500, // Dockerで動かすとコンパイルが遅すぎてリロードが間に合わない
  ui: {
    port: 8888
  }
}
