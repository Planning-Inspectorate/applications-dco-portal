const { pino } = require('pino');
const config = require('../config');

const logger = pino({
	level: config.logger.level
});

export default logger;
