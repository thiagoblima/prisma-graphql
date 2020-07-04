import 'cross-fetch/polyfill'
import {gql} from 'apollo-boost'
import prisma from '../src/prisma'
import seedDatabase, {userOne} from './utils/seedDatabase'
import getClient from './utils/getClient'

const client = getClient()

beforeEach(seedDatabase)

const createUser = gql`
     mutation($data: CreateUserInput!) {
         createUser(data: $data){
             token,
                 user {
                     id
                     name
                 }
             }
         }
     `

const getUsers = gql`
     query {
         users {
             id
             name
             email
         }
     }
 `

const login = gql`
mutation($data: LoginUserInput!) {
    login (data: $data){
      token 
    }
}
`

jest.setTimeout(10000)
test('Should create a new user', async () => {
    const variables = {
        data: {
            name: "Dummy User",
            email: "dummy@dm.com.bf",
            password: "dummy11111"
        }
    }


    const response = await client.mutate({
        mutation: createUser,
        variables
    })

    const exists = await prisma.exists.User({id: response.data.createUser.user.id})
    expect(exists).toBe(true)

})

test('Should expose public author profiles', async () => {
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
    const variables = {
        email: "dummy@dm.com.bf",
        password: "dummy11111"
    }

    await expect(client.mutate({mutation: login, variables: variables})).rejects.toThrow()
})

test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt)
    const getProfile = gql`
         query {
             me {
                 id
                 name
                 email
             }
         }
     `

    const {data} = await client.query({query: getProfile})

    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.name).toBe(userOne.user.name)
    expect(data.me.email).toBe(userOne.user.email)
})
