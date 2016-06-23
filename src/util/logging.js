"use strict";

const _ = require("lodash");
const path = require("path");
const proc = require("process");
const bunyan = require("bunyan");

const CONFIG_PATH = "../../bunyan.json";
let config = require(CONFIG_PATH);

const env = proc.env.NODE_ENV || "development";
console.log("env: " + env);

if (env === "development" && config.development) {
    _.merge(config, config.development);
}

if (env === "production" && config.production) {
    _.merge(config, config.production);
}

delete config.development;
delete config.production;
console.log(config);

var conf = _.assign(config, {
    name: 'ping-pong',
    serializers: {
        err: bunyan.stdSerializers.err
    }
});

var log = bunyan.createLogger(conf);
log.debug('logging configured...');

module.exports = log;