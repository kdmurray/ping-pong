"use strict";

const fs = require("fs");
const path = require("path");
const proc = require("process");
const bunyan = require("bunyan");
const bunyanLoggly = require("bunyan-loggly");
const _ = require("lodash");

const CONFIG_PATH = "../../bunyan.json";
let config = require(CONFIG_PATH);

const env = proc.env.NODE_ENV || "development";
if (env === "development" && config.development) {
    _.merge(config, config.development);
}

if (env === "production" && config.production) {
    _.merge(config, config.production);
}

delete config.development;
delete config.production;

let conf = _.assign(config, {
    name: 'ping-pong',
    serializers: {
        err: bunyan.stdSerializers.err
    }
});

if (conf.streams && _.some(conf.streams, (x) => x.path)) {
    if (!fs.existsSync("./logs")) {
        fs.mkdirSync("./logs");
    }
}

if (config.loggly) {
    let logglyStream = new Bunyan2Loggly(config.loggly);
    var logger = bunyan.createLogger({
        name: "loggly",
        streams: [{
            type: "raw",
            stream: logglyStream
        }]
    });
}

let log = bunyan.createLogger(conf);
log.debug('logging configured!');

module.exports = log;