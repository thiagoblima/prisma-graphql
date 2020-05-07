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

// prisma.query prisma.mutation prisma.subscription prisma.exists

const createPostForUser = async (authorId, data) => {
    const userExists = await prisma.exists.User({ id: authorId })

    if (!userExists) {
        throw new Error('User not found')
    }

    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    }, '{ author { id name email posts { id title published } } }')

    return post.author
}

// createPostForUser('cjjybkwx5006h0822n32vw7dj', {
//     title: 'Great books to read',
//     body: 'The War of Art',
//     published: true
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
//     console.log(error.message)
// })

const updatePostForUser = async (postId, data) => {
    const postExists = await prisma.exists.Post({ id: postId })

    if (!postExists) {
        throw new Error('Post not found')
    }

    const post = await prisma.mutation.updatePost({
        where: {
            id: postId
        },
        data
    }, '{ author { id name email posts { id title published } } }')
    
    return post.author
}

// updatePostForUser("power", { published: true }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
//     console.log(error.message)
// })
