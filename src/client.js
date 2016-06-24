"use strict";

const log = require("./util/logging.js");
const util = require("./util/util.js");
const http = require("./util/http.js");
const config = require("../config.js");
const _ = require("lodash");

const API_BASE = "https://api.digitalocean.com/v2/domains/";
const request = http.apiRequest(config.digitalOcean.apiKey);

function getDomainResourceRecords(domain, cb) {

    const url = `${API_BASE}${domain}/records`;
    log.debug({ domain: domain }, "starting to fetch all domain records at %s", url);

    request(url, (err, res, body) => {
        if (err || res.statusCode !== 200) {
            util.throwHttpError(res, err, "failed to fetch all domain records");
        }

        let data = JSON.parse(body);
        if (!data.domain_records) {
            util.throwError({ data: data }, "fetched resource records JSON has invalid schema");
        }

        var records = data.domain_records;
        log.debug("got %d resource records successfully", records.length);
        cb(records);
    });
}

function updateResourceRecord(domain, recordId, publicIp, cb) {

    const url = `${API_BASE}${domain}/records/${recordId}`;
    log.debug({ recordId: recordId }, "starting to update domain resource record");

    const options = {
        url: url, 
        json: { data: publicIp }
    };

    request.put(options, (err, res, body) => {
        if (err || res.statusCode !== 200) {
            util.throwHttpError(res, err, "update resource record call failed");
        }

        log.info("updated resource record for record ID %d successfully with IP %s!", recordId, publicIp);
        cb();
    });
}

function startUpdate(publicIp, domainParts, cb) {

    const domain = domainParts.domain;
    const subdomain = domainParts.subdomain;
    log.debug({ fqdn: domainParts, publicIp: publicIp }, "starting resource record update");

    getDomainResourceRecords(domain, (recs) => {
        
        var matchingRecord = _.find(recs, (r) => {
            return r.name === subdomain;
        });

        if (!matchingRecord) {
            util.throwError("could not find matching resource record for subdomain %s", domainParts.subdomain);
        }

        updateResourceRecord(domain, matchingRecord.id, publicIp, cb);
    });
}

function fetchPublicIp(cb) {
    const getIpUrl = config.getIpUrl;
    log.debug("starting to fetch public IP using endpoint %s", getIpUrl);

    request(getIpUrl, (err, res, body) => {
        if (err || res.statusCode !== 200) {
            util.throwHttpError(res, err, "failed to fetch public IP");
        }

        let publicIp = body.trim();
        log.info({ ip: publicIp }, "fetched public IP successfully");
        cb(publicIp);
    });
}

exports.performDnsUpdate = function(cb) {

    try {

        fetchPublicIp((publicIp) => {

            const fqdns = config.digitalOcean.hostnames;
            fqdns.forEach((fqdn) => {
            
                const domainParts = http.getDomainParts(fqdn);
                if (domainParts.err) {
                    util.throwError({ input: fqdn }, "could not parse domain parts");
                }

                startUpdate(publicIp, domainParts, cb);
            });

        });

    } catch (err) {
        log.error(err, "the DNS update operation failed");
        cb();
    }

};