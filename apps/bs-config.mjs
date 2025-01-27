import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(`${__dirname}/` + '../delivery/')

export default {
  files: ['./resource/**/*', `${root}/**/*`],
  https: true,
  open: false,
  proxy: {
    target: 'https://localhost:3000',
  },
  port: 8000,
  browser: 'google chrome canary',
  reloadDelay: 10000, // TODO: PC買い替えて確認する
  ui: {
    port: 9999,
  },
}
