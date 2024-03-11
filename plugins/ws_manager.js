const fp = require('fastify-plugin')

const connection_pool = []

function delete_ws_by_id(id) {
    for (let i = 0; i < connection_pool.length; i++) {
        if (connection_pool[i].connection_index == id) {
            connection_pool.splice(i, 1)
        }
    }
}

let next_connection_index = 0

function add_connection(ws, logger) {
    ws.connection_index = connection_index
    ws.on("connect", () => {
        logger.info(`ws connection ${ws.connection_index} connected.`)
        connection_pool.push(ws)
    })
    ws.on("disconnect", () => {
        logger.warn(`ws connection ${ws.connection_index} disconnected.`)
        delete_ws_by_id(ws.connection_index)
    })
    ws.on("connectionError", () => {
        logger.error(e, `ws connection ${ws.connection_index} error!`)
        delete_ws_by_id(ws.connection_index)
    })

    next_connection_index = next_connection_index + 1
}

function broadcast_data(data) {
    connection_pool.forEach(async ws => {
        await ws.send(data)
    })
}

// pass config to option
module.exports = fp(async function (fastify, opts) {
    fastify.decorate('add_connection', add_connection)
    fastify.decorate('broadcast_data', broadcast_data)
})
