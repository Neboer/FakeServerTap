const parse_online_players = require("../../utils/parse_online_players")

// pass config to option
module.exports = async function (fastify, opts) {
    fastify.get("/players", async (request, reply) => {
        try {
            const rcon_query_players_result = fastify.send_rcon("list")
            const players = parse_online_players(rcon_query_players_result)
            return players.map(name => ({
                displayName: name
            }))
        } catch (e) {
            if (e.message == "Cannot read properties of null (reading 'send')") {
                fastify.log.error(`broadcast message ${message_content} error: rcon connection is broken.`)
                reply.status(500)
                return "rcon connection is broken."
            } else {
                fastify.log.fatal(e, "get online players")
                reply.status(500)
                return "unknown error while get online players"
            }
        }
    })
}