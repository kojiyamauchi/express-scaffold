import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '^@/(.+)': '<rootDir>/resource/$1'
  },
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  testMatch: ['**/resource/tests/**/*.test.+(ts|js)'],
  preset: 'jest-puppeteer'
}

export default config
