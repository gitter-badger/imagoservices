const config = require('config');
const logger = require('log4js');
logger.configure(config.get('logging'));
const log = new logger.getLogger();

/**
 * Simplest possible version tor reduce code only.
 */
module.exports.getLogger = function () {
    return log;
}
