const Tail = require('tail').Tail;
const {svtap} = require("../config.json")
const fp = require('fastify-plugin')
const {exit} = require('node:process')


module.exports = fp(async function (fastify, opts) {
    try {
        let tail = new Tail(svtap.log_file)
        tail.watch()
        tail.on("line", data => {
            fastify.log.debug(`receive new line ${data}`)
            const log_data_match_result = data.match(/^\[.*?] \[.*?] \[.*?]: (.*)$/)
            if (log_data_match_result) {
                const msg_text = log_data_match_result[1]
                const msg_to_send = JSON.stringify({"message": msg_text, "timestampMillis": 0, "loggerName": "", "level": "INFO"})
                try {
                    fastify.log.info(`broadcast message ${msg_to_send}`)
                    fastify.broadcast_data(msg_to_send)
                } catch (e) {
                    fastify.log.error(e, `error broadcast message ${msg_to_send}`)
                }
            } else {
                fastify.log.debug(`unmatched log line ${data}`)
            }
        })
        tail.on("error", e => {
            fastify.log.fatal(e, `Error Tailing the file ${svtap.log_file}`)
        })
    } catch (e) {
        fastify.log.fatal(e, `Error tail the file ${svtap.log_file}`)
    }
})

