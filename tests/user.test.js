import 'cross-fetch/polyfill'
import ApolloBoost, {gql} from 'apollo-boost'
import prisma from '../src/prisma'
import seedDatabase from './utils/seedDatabase'

const client = new ApolloBoost({
    uri: 'http://localhost:4000'
})

beforeEach(seedDatabase)

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
