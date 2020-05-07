const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users
        }

        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts
        }

        return db.posts.filter((post) => {
            const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
            const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
            return isTitleMatch || isBodyMatch
        })
    },
    comments(parent, args, { db }, info) {
        return db.comments
    },
    greeting(parent, args, ctx, info) {
        if (args.name && args.position) {
            return `Hello, ${args.name}! You are my favoriate ${args.position}.`
        } else {
            return 'Hello!'
        }
    },
    order(parent, args, ctx, info) {
        if (args.item && args.qtd && args.price) {
            return `Your order: ${args.qtd} - ${args.item} - ${args.price}`
        }
    },
    add(parent, args, ctx, info) {
        if (args.numbers.length === 0) {
            return 0
        }

        return args.numbers.reduce((accumulator, currentValue) => {
            return accumulator + currentValue
        })
    },
    grades(parent, args, ctx, info) {
        return [99, 80, 93]
    },
    me() {
        return {
            id: '123098',
            name: 'Mike',
            email: 'mike@example.com'
        }
    },
    post() {
        return {
            id: '092',
            title: 'GraphQL 101',
            body: '',
            published: false
        }
    }
}

export { Query as default }
