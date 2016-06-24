// TODO:
// Fix getHostName and getDomain utility functions
// Wrap the main loop in a try...catch and exec on interval

(function() {
    "use strict";

    const client = require("./src/client.js");
    const config = require("./config.js");
    const log = require("./src/util/logging.js");
    
    function doUpdate() {
        log.info("starting DNS update...");
        client.performDnsUpdate(() => {
            log.info("completed DNS update");
            log.info("the next update operation will occur in %d milliseconds", config.updateInterval);
            setTimeout(doUpdate, config.updateInterval);
        });
    }

    doUpdate();

})();