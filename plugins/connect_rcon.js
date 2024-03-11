const fp = require('fastify-plugin')
const {Rcon} = require("rcon-client");
const {rcon} = require("../config.json")
const sleep = require("../utils/sleep")

let rcon_connection = {"connection": null}

function wait_rcon_connection_break(logger) {
    return new Promise(resolve => {
        rcon_connection.connection.once("error", (e) => {
            logger.error(e, "rcon connection error")
            resolve()
        })

        rcon_connection.connection.once("end", () => {
            logger.error("rcon connection ended.")
            resolve()
        })
    })
}

async function rcon_connector(logger) {
    while (true) {
        while (true) {
            try {
                rcon_connection.connection = await Rcon.connect(rcon)
                logger.info("rcon connected!")
                break
            } catch (e) {
                logger.error(e, "rcon connection failed")
                await sleep(5000)
            }
        }

        await wait_rcon_connection_break(logger)
        await sleep(5000)
    }
}

// pass config to option
module.exports = fp(async function (fastify, opts) {
    rcon_connector(fastify.log)
    fastify.decorate('rcon', rcon_connection)
})
