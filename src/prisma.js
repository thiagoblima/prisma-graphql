import {
    Prisma
} from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
})

prisma.query.users(null, '{ id name email posts { id title }}').then((data) => {
    console.log(JSON.stringify(data, undefined, 2))
})

prisma.query.comments(null, '{ id text author { id name } post { id title body }}').then((data) => {
    console.log(JSON.stringify(data, undefined, 2))
})

prisma.mutation.createPost({
    data: {
        title: "GraphQL 101",
        body: "",
        published: false,
        author: {
            connect: {
                id: "ck9w7fp6300470987qaocktuy"
            }
        }
    }
}, '{ id title body published }').then((data) => {
    console.log(data)
    return prisma.query.users(null, '{ id name posts { id title } }')
}).then((data) => {
    console.log(JSON.stringify(data, undefined, 2))
})


prisma.mutation.updatePost({
    where: {
        id: "ck9w7hvl5005u0987qcy9cq40"
    },
    data: {
        body: "This is how to get started with Graphql...",
        published: true
    }
}, '{ id }').then(() => {
    return prisma.query.posts(null, '{ id title body published }')
}).then((data) => {
    console.log(data)
})