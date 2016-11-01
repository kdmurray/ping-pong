"use strict";

const request = require("request");
const util = require("./util");
const _ = require("lodash");

let Http = function() {

    this.getDomainParts = function(input) {
        // Note: this method does not work with domains with 
        // prefixes made up of multiple parts (e.g. co.uk)
        // nor with ones lacking a subdomain.

        let result = {};
        let split = input.split(".");
        if (split.length < 3) {
            return util.errObj("The input must have at least 3 domain parts");
        }

        result.domain = _.join(split.splice(split.length-2), ".");
        result.subdomain = _.join(split, ".");
        return result;
    };

    this.apiRequest = function(apiToken) {
        return request.defaults({
            headers: {
                "Authorization": "Bearer " + apiToken
            }
        });
    };

};

module.exports = new Http;