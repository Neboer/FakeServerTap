// pass config to option

module.exports = async function (fastify, opts) {
    fastify.get("/ws/console", { websocket: true }, async (connection, req) => {
        const incomming_websocket = connection.socket
        fastify.add_connection(incomming_websocket)
    })
}