import 'dotenv/config'

import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'resource/prisma/schema.prisma',
  migrations: {
    seed: 'ts-node -r tsconfig-paths/register --files resource/seeds/prisma.seed.ts',
  },
})
