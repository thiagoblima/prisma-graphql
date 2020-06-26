import 'cross-fetch/polyfill'
import ApolloBoost, { gql } from 'apollo-boost' 
import { getFirstName, isValidPassword } from '../src/utils/user'
import prisma from '../src/prisma'

const client = new ApolloBoost({
    uri: 'http://localhost:4000'
})

test('Should create a new user', async () => {
     const createUser = gql `
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

     const exists = await prisma.exists.User({ id: response.data.createUser.user.id})
     expect(exists).toBe(true)

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