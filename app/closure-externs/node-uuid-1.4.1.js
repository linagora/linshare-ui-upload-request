/**
 * @param {Object} obj
 * @return {!uuid}
 * @constructor
 */
function uuid(obj) {}

/**
 * @param {Object} options
 * @param {Array} buffer
 * @param {Number} offset
 * @return {String}
 */
uuid.v1 = function(options, buffer, offset) {};

/**
 * @param {Object} options
 * @param {Array} buffer
 * @param {Number} offset
 * @return {String}
 */
uuid.v4 = function(options, buffer, offset) {};

/**
 * @param {String} id
 * @param {Array} buffer
 * @param {Number} offset
 * @return {Array}
 */
uuid.parse = function(id, buffer, offset) {};

/**
 * @param {Array} buffer
 * @param {Number} offset
 * @return {String}
 */
uuid.unparse = function(buffer, offset) {};

/**
 * @return {Object}
 */
uuid.noConflict = function() {};
