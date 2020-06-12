import {
    Prisma
} from 'prisma-binding'
import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: '61133F2EABE79CA4475F9CAB14124',
    fragmentReplacements
})

export { prisma as default }
