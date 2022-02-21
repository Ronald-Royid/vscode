const NodeCache = require('node-cache');
const cache = new NodeCache();
const transform = require('./src/transform.js');
const fetch = require('./src/fetch.js');

const hour = 60*60;

// Check the cache, if it's empty, try the live fetch a few times and collect
// the first success. Process the data via any config hooks. Cache the new
// result. Failing all that, pass on an error.
module.exports = (_config, cb) => {

  var config =
    { maxAttempts: 5
    , type: 'application/json'
    , ttl: hour
    };
  if (typeof _config === "string") {
    config.url = _config;
  } else {
    extend(config, _config);
  }

  // Check the cache for the value. It's keyed by url.
  cache.get(config.url + config.type, (err, cached) => {
    if (err || cached === undefined) {
      // If we got nothing there, then try the server.
      fetch(extend({}, config, ['maxAttempts', 'url', 'auth']), (err, body) => {
        if (err) {
          cb(err);
        } else {
          var answer = transform(body, config.type);
          cache.set(config.url + config.type, answer, config.ttl, (err) => {
            cb(err, answer);
          });
        }
      });
    } else {
      cb(null, cached);
    }
  });
}

module.exports.register = transform.register

// Shallow extend for configs. keys_ is optional and allows you to choose
// which properties you want.
var extend = (reciever, provider, keys_) => {
  var keys = keys_ || Object.keys(provider);
  for (var i = keys.length; i--;) {
    if (provider[keys[i]] !== undefined) reciever[keys[i]] = provider[keys[i]];
  }
  return reciever;
}
