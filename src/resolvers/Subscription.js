const Subscription = {
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0

            setInterval(() => {
                count++
                pubsub.publish('count', {
                    count
                })
            }, 1000)

            return pubsub.asyncIterator('count')
        }
    },
    comment: {
       subscribe(parent, { postId }, { prisma }, info) {
           return prisma.subscription.comment({
               where: {
                   node: {
                       post: {
                           id: postId
                       }
                   }
               }
           }, info)
       }
    },
    post: {
        subscribe(parent, args, { prisma }, info) {
            return prisma.subscription.post({
                where: {
                   node: {
                       published: true
                   }
                }
            }, info)
        }
    }
}

export { Subscription as default }