import 'cross-fetch/polyfill'
import ApolloBoost, {gql} from 'apollo-boost'
import bcrypt from 'bcryptjs'
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

test('Should not signip user with invalid password', async () => {
    const createUser = gql`
        mutation {
            createUser(
                data: {
                    name: "Rob",
                    email: "rob@live.com",
                    password: "rob123"
                }
            ){
                token
            }
        }
    `

    await expect(client.mutate({mutation: createUser})).rejects.toThrow()
})

test('Should expose public posts', async () => {
    const getPosts = gql`
        query {
            posts {
                id
                title
                body
                published
            }
        }
     `

    const response = await client.query({
        query: getPosts
    })

    expect(response.data.posts.length).toBe(1)
    expect(response.data.posts[0].published).toBe(true)
})

test('Should notlogin with bad credentials', async () => {
    const login = gql`
        mutation {
            login (
                data: {
                    email: "jen@live.com"
                    password: "1234"
                }
            ){
              token 
            }
        }
    `

    await expect(client.mutate({mutation: login})).rejects.toThrow()
})
