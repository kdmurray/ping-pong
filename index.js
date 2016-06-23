// TODO:
// Fix getHostName and getDomain utility functions
// Wrap the main loop in a try...catch and exec on interval

(function() {
    "use strict";

    let client = require("./src/client.js");
    client();
})();