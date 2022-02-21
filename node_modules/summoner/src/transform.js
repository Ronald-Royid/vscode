var formats = {};

// Add a new handler for a given MIMEtype
var register = (type, fn) => { formats[type] = fn };

var noop = x => x;

// We've got json as a default. Otherwise it's treated as plain text.
// TODO: add xml and other support
register('json', JSON.parse);
register('application/json', JSON.parse);

module.exports = (body, type) => (formats[type] || noop)(body);
module.exports.register = register;
