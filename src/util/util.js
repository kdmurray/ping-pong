"use strict";

const request = require("request");
const log = require("./logging");
const _ = require("lodash");

let Util = function() {

    this.throwError = function() {
        const fields = arguments.length === 2 ? arguments[0] : null;
        const msg = arguments.length === 2 ? arguments[1] : arguments[0];

        let err = fields instanceof Error 
            ? fields : _.assign(new Error(msg), { context: fields });

        log.error(err);
        throw err;
    };

    this.throwHttpError = function(res, err, msg) {
        this.throwError({ statusCode: res.statusCode, err: err }, msg);
    };

    this.errObj = function(msg) {
        return { err: msg };
    };
    
};

module.exports = new Util;