import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma'

const userOne = {
    input: {
        name: 'Jen',
        email: 'jen@live.com',
        password: bcrypt.hashSync('Dummypass')
    },
    user: undefined
}

const seedDatabase = async () => {
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })

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

export {seedDatabase as default}
