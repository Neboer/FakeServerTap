module.exports = async function (fastify, opts) {
    fastify.post("/chat/broadcast", {
        schema: {
            body: {
                type: 'object',
                required: ['message']
            }
        }
    }, async (request, reply) => {
        const message_content = request.body.message
        fastify.log.info(`broadcast message ${message_content}`)
        try {
            await fastify.rcon.connection.send("tellraw @a " + JSON.stringify({"text": message_content}))
            return "successful"
        } catch (e) {
            if (e.message === "Cannot read properties of null (reading 'send')") {
                fastify.log.error(`broadcast message ${message_content} error: rcon connection is broken.`)
                reply.status(500)
                return "rcon connection is broken."
            } else {
                fastify.log.fatal(e, `unknown error while broadcast message ${message_content}`)
                reply.status(500)
                return "unknown error while broadcast message"
            }
        }
    })
}