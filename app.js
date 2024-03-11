'use strict'

const path = require('node:path')
const AutoLoad = require('@fastify/autoload')

// Pass --options via CLI arguments in command to enable these options.
const options = {
}

module.exports = async function (fastify, opts) {
    fastify.register(require('@fastify/formbody'))
    await fastify.register(require('@fastify/websocket'))

    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: Object.assign({}, opts)
    })

    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: Object.assign({}, opts)
    })
}

module.exports.options = options
