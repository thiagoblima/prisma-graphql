import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma'

const userOne = {
    input: {
        name: 'Jen',
        email: 'jen@live.com',
        password: bcrypt.hashSync('Dummypass')
    },
    user: undefined,
    jwt: undefined
}

const userTwo = {
    input: {
        name: 'Luke',
        email: 'luke@live.com',
        password: bcrypt.hashSync('Dummypass')
    },
    user: undefined,
    jwt: undefined
}

const postOne = {
    input: {
        title: 'Testing Create Post',
        body: 'Just a test line',
        published: true,
    },
    post: undefined
}

const postTwo = {
    input: {
        title: 'Testing Another Create Post',
        body: 'Just a test line once more',
        published: false,
    },
    post: undefined
}

const commentOne = {
    input: {
        text: 'Great post test'
    },
    comment: undefined
}

const commentTwo = {
    input: {
        text: 'Great post test two'
    },
    comment: undefined
}

const seedDatabase = async () => {
    await prisma.mutation.deleteManyComments()
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()

    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })

    userOne.jwt = jwt.sign({userId: userOne.user.id}, process.env.JWT_SECRET)

    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    })

    userTwo.jwt = jwt.sign({userId: userTwo.user.id}, process.env.JWT_SECRET)

    postOne.post = await prisma.mutation.createPost({
        data: {
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    postTwo.post = await prisma.mutation.createPost({
        data: {
            ...postTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    commentOne.comment = await prisma.mutation.createComment({
        data: {
            ...commentOne.input,
            author: {
                connect: {
                    id: userTwo.user.id
                }
            },
            post: {
                connect: {
                    id: postOne.post.id
                }
            }
        }
    })

    commentTwo.comment = await prisma.mutation.createComment({
        data: {
            ...commentTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            },
            post: {
                connect: {
                    id: postOne.post.id
                }
            }
        }
    })
}

export {seedDatabase as default, userOne, userTwo, postOne, postTwo, commentOne, commentTwo}
