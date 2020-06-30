import 'cross-fetch/polyfill'
import ApolloBoost, {gql} from 'apollo-boost'
import bcrypt from 'bcryptjs'
import {getFirstName, isValidPassword} from '../src/utils/user'
import prisma from '../src/prisma'

const client = new ApolloBoost({
    uri: 'http://localhost:4000'
})

beforeEach(async () => {
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
})

jest.setTimeout(10000)
test('Should create a new user', async () => {
    const createUser = gql`
         mutation {
             createUser(
                 data: {
                     name: "Dummy User",
                     email: "dummy@dm.com.bf",
                     password: "dummy11111"
                 }
             ){
                 token,
                 user {
                     id
                     name
                 }
             }
         }
     `

    const response = await client.mutate({
        mutation: createUser
    })

    const exists = await prisma.exists.User({id: response.data.createUser.user.id})
    expect(exists).toBe(true)

})

test('Should expose public author profiles', async () => {
    const getUsers = gql`
        query {
            users {
                id
                name
                email
            }
        }
    `

    const response = await client.query({
        query: getUsers
    })

    expect(response.data.users.length).toBe(1)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe('Jen')
})

test('Should return only the individuals first name', () => {
    const firstName = getFirstName('Thiago Lima')

    expect(firstName).toBe('Thiago')
})

test('Should return first name when given first name', () => {
    const firstName = getFirstName('Jen')

    expect(firstName).toBe('Jen')
})

test('Should reject password shorter than 8 characters', () => {
    const isValid = isValidPassword('abc123')

    expect(isValid).toBe(false)
})

test('Should reject password that contains word password', () => {
    const isValid = isValidPassword('abcPassword098')

    expect(isValid).toBe(false)
})

test('Should correctly validate a valid password', () => {
    const isValid = isValidPassword('Test098!123')

    expect(isValid).toBe(true)
})
