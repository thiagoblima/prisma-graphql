import "@babel/polyfill/noConflict"
import server from './server'

server.start({ port: process.env.PORT || 4000}, (server) => {
    console.log('The server is up!', server)
})
