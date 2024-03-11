// pass config to option

module.exports = async function (fastify, opts) {
    fastify.get("/ws/console", { websocket: true }, (connection, req) => {
        const incomming_websocket = connection.socket
        fastify.add_connection(incomming_websocket)
        fastify.log.info('add a incomming websocket.')
    })
}