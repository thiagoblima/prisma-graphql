import 'cross-fetch/polyfill'
import {gql} from 'apollo-boost'
import seedDatabase, { userOne, postOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import prisma from '../src/prisma'

const client = getClient()

beforeEach(seedDatabase)

jest.setTimeout(10000)
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

test('Should fetch user posts', async () => {
     const client = getClient(userOne.jwt)
     const myPosts = gql`
         query {
             myPosts {
                 id
                 title
                 body
                 published
             }
         }
     `

     const { data } = await client.query({ query: myPosts })

     expect(data.myPosts.length).toBe(2)
})

test('Should be able to update own post', async () => {
     const client = getClient(userOne.jwt)

     const updatePost = gql`
        mutation {
             updatePost(
                 id: "${postOne.post.id}",
                 data: {
                     published: false
                 }
             ) {
                 id
                 title
                 body
                 published
             }
        }
     `

     const { data } = await client.mutate({ mutation: updatePost })
     const exists = await prisma.exists.Post({ id: postOne.post.id, published: false })

     expect(data.updatePost.published).toBe(false)
     expect(exists).toBe(true)
     
})
