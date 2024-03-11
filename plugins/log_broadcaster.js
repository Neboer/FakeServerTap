const Tail = require('tail').Tail;
const { svtap } = require("../config.json")
const fp = require('fastify-plugin')
const { exit } = require('node:process')


module.exports = fp(async function (fastify, opts) {
    try {
        let tail = new Tail(svtap.log_file)
        tail.watch()
        tail.on("line", data => {
            const log_data_match_result = data.match(/^\[.*?] \[.*?] \[.*?]: (.*)$/)
            if (log_data_match_result) {
                const msg_text = log_data_match_result[1]
                try {
                    fastify.broadcast_data(msg_text)
                } catch (e) {
                    fastify.log.error(e, `error broadcast message ${msg_text}`)
                }
            }
        })
        tail.on("error", e => {
            fastify.log.fatal(e, `Error Tailing the file ${svtap.log_file}`)
            exit(2)
        })
    } catch (e) {
        fastify.log.fatal(e, `Error tail the file ${svtap.log_file}`)
        exit(1)
    }
})

