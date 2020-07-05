import 'cross-fetch/polyfill'
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase'
import { getPosts, myPosts, updatePost, createPost, deletePost } from  './utils/operations'
import getClient from './utils/getClient'
import prisma from '../src/prisma'

const client = getClient()

beforeEach(seedDatabase)

jest.setTimeout(20000)
test('Should expose public posts', async () => {
    const response = await client.query({
        query: getPosts
    })

    expect(response.data.posts.length).toBe(1)
    expect(response.data.posts[0].published).toBe(true)
})

test('Should fetch user posts', async () => {
     const client = getClient(userOne.jwt)
     const { data } = await client.query({ query: myPosts })

     expect(data.myPosts.length).toBe(2)
})

test('Should be able to update own post', async () => {
     const client = getClient(userOne.jwt)
     const variables = {
         id: postOne.post.id,
         data: {
             published: false
         }
     }

     const { data } = await client.mutate({ mutation: updatePost, variables })
     const exists = await prisma.exists.Post({ id: postOne.post.id, published: false })

     expect(data.updatePost.published).toBe(false)
     expect(exists).toBe(true)
     
})

test('Should create a new post', async () => {
     const client = getClient(userOne.jwt)
     const variables = {
         data: {
             title: 'Tested create post',
             body: 'This was successfully passed',
             published: true
         }
     }
     
     const { data } = await client.mutate({ mutation: createPost, variables })
     
     expect(data.createPost.title).toBe('Tested create post')
     expect(data.createPost.body).toBe('This was successfully passed')
     expect(data.createPost.published).toBe(true)
})

test('Should delete post', async () => {
     const client = getClient(userOne.jwt)
     const variables = {
         id: postTwo.post.id
     }

     await client.mutate({ mutation: deletePost, variables })
     const exists = await prisma.exists.Post({ id: postTwo.post.id })

     expect(exists).toBe(false)

})
