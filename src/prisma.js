import {
    Prisma
} from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
    secret: '61133F2EABE79CA4475F9CAB14124'
})

export { prisma as default }
