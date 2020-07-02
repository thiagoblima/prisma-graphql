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

const seedDatabase = async () => {
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })

    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

    await prisma.mutation.createPost({
        data: {
            title: 'Testing Create Post',
            body: 'Just a test line',
            published: true,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    await prisma.mutation.createPost({
        data: {
            title: 'Testing Another Create Post',
            body: 'Just a test line once more',
            published: false,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })
}

export {seedDatabase as default, userOne}
