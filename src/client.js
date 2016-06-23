"use strict";

const log = require("./util/logging.js");
const util = require("./util/util.js");
const config = require("../config.js");
const _ = require("lodash");

const API_BASE = "https://api.digitalocean.com/v2/domains/";
const request = util.apiRequest(config.digitalOcean.apiKey);

function fetchAllResourceRecords(domain, cb) {
    const url = `${API_BASE}${domain}/records`;
    log.debug("DNSupdate attempting to fetch resource records at %s", url);
    request(url, (err, res, body) => {
        if (err || res.statusCode !== 200) {
            log.error("DNSupdate record fetch returned status code %d with error %s", res.statusCode, err);
            util.throwError("Failed to fetch domain resource records");
        }

        let data = JSON.parse(body);
        if (!data.domain_records) {
            log.error("DNSupdate resource record response JSON schema unexpected; data: %j", data);
            util.throwError("DNSupdate resource record response JSON schema unexpected");
        }

        var records = data.domain_records;
        log.debug("DNSupdate request successful; returned %d resource records", records.length);
        cb(records);
    });
}

function updateResourceRecord(domain, recordId, ip) {
    const url = `${API_BASE}${domain}/records/${recordId}`;

    let options = {
        url: url, 
        json: { data: ip }
    };
    
    request.put(options, (err, res, body) => {
        if (err || res.statusCode !== 200) {
            log.error("DNSupdate resource update returned status code %d with error %s", res.statusCode, err);
            util.throwError("Failed to update resource record");
        }
    });
}

function updateDns(publicIp) {
    config.digitalOcean.hostnames.forEach((fqdn) => {
        log.debug("DNSupdate starting for fqdn %s with public IP %s", fqdn, publicIp);

        let domain = "theparki5.com"; // util.getDomain(fqdn);
        log.debug("DNSupdate parsed domain as %s", domain);

        fetchAllResourceRecords(domain, (recs) => {
            var hostname = "test.ddns"; // util.getHostName(fqdn);
            log.debug("DNSupdate parsed hostname as %s", hostname);
            
            var matchingRecord = _.find(recs, (r) => {
                return r.name === hostname;
            });

            if (!matchingRecord) {
                log.error("DNSupdate could not find an existing matching resource record for hostname %s and domain %s", hostname, domain);
                util.throwError("Could not find an existing matching resource record to update!");
            }

            updateResourceRecord(domain, matchingRecord.id, publicIp);
        });
    });
}

module.exports = function() {
    const getIpUrl = config.getIpUrl;
    log.debug("getIP request starting; URL = %s", getIpUrl);

    request(getIpUrl, (err, res, body) => {
        if (err || res.statusCode !== 200) {
            log.error("getIP returned status code %d with error %s", res.statusCode, err);
            util.throwError("Failed to get public IP");
        }

        let publicIp = body.trim();
        log.info("getIP request successful; public IP: %s", publicIp);
        updateDns(publicIp);
    });
};