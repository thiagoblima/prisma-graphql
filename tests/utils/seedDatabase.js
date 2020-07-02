import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma'

const seedDatabase = async () => {
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()
    const user = await prisma.mutation.createUser({
        data: {
            name: 'Jen',
            email: 'jen@live.com',
            password: bcrypt.hashSync('Dummypass')
        }
    })

    await prisma.mutation.createPost({
        data: {
            title: 'Testing Create Post',
            body: 'Just a test line',
            published: true,
            author: {
                connect: {
                    id: user.id
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
                    id: user.id
                }
            }
        }
    })
}

export { seedDatabase as default }
