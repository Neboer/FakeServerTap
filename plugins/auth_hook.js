const fp = require('fastify-plugin')
const { svtap } = require("../config.json")

module.exports = fp(function (fastify, opts, plugin_done) {
    fastify.addHook('onRequest', (request, reply, done) => {
        if (request.headers.cookie && request.headers.cookie.includes(`x-servertap-key=${svtap.secret}`)) {
            done()
        } else {
            reply.status(401).send("unauthorized.")
            fastify.log.info("unauthorized request.")
            done()
        }
    })
    plugin_done()
})
