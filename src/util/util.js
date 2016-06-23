"use strict";

const request = require("request");

let Util = function() {
    this.throwError = function(msg) {
        return `${msg}. See log file for details.`;
    };

    this.getHostName = function(fqdn) {
        let match = fqdn.match(/^(([a-z]|[a-z][a-z0-9\-]*[a-z0-9])\.)*([a-z]|[a-z][a-z0-9\-]*[a-z0-9])$/i);
        return match != null && match.length > 2 && typeof match[2] === "string" && match[2].length > 0
            ? match[2] : null;
    };

    this.getDomain = function(fqdn) {
        return "theparki5.com";
        let hostName = this.getHostName(fqdn);
        let domain = hostName;

        if (hostName != null) {
            let parts = hostName.split(".").reverse();
            if (parts != null && parts.length > 1) {
                domain = `${parts[1]}.${parts[0]}`;
                if (hostName.toLowerCase().indexOf(".co.uk") != -1 && parts.length > 2) {
                    domain = `${parts[2]}.${domain}`;
                }
            }
        }

        return domain;
    };

    this.apiRequest = function(apiToken) {
        return request.defaults({
            headers: {
                "Authorization": "Bearer " + apiToken
            }
        });
    };
};

module.exports = new Util;