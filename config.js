"use strict";

// Define configuration settings here
// This is NOT a JSON file, but a regular JS file

const keys = require("./config-keys");
const _ = require("lodash");

let config = {
    // The interval on which to update the DNS record
    updateInterval: 900000, // 15m
    
    // The endpoint that will be queried for the external IP
    getIpUrl: "https://myexternalip.com/raw",
    
    digitalOcean: {
        hostnames: ["test.ddns.theparki5.com"]
    }
};

// Sensitive keys are stored in a separate config file called
// config-keys.js. Copy the sample config-keys.js file provided.
_.merge(config, keys);

module.exports = config;

