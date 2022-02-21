var request = require('request');
var urlParser = require('url');

// Pass on all the necessary options to request.
const fetch = (options, cb) => {
  var reqOpts =
    { url: urlParser.parse(options.url)
    , method: options.method || "GET"
    , auth: options.auth
    , gzip: true
    };
  request(reqOpts, (err, res, body) => {
    cb(err, res, body)
  });
}

// Recursively try to fetch the data until we bump up against
// maxAttempts, default 5.
const attemptFetch = (options, cb, _count) => {
  // Set the recursion limit.
  var count = _count == null ? options.maxAttempts : _count;

  fetch( options, (err, res, body) => {
    if (err) {
      // No good, node is misbehaving. do we need to try again?
      if (!count || count < 0) {
        err.message = 'Too many attempt failures on ' + options.url + '\n' + err.message
        return cb(err)
      } else {
        attemptFetch(options, cb, count - 1)
      }
    } else if (res.statusCode > 399) {
      // No good, the destination server is throwing up at us. Try again?
      if (!count || count < 0) {
        cb(new Error (res.statusCode), body)
      } else {
        attemptFetch(options, cb, count - 1)
      }
    } else {
      // Yes! Got it! Send the value forward.
      cb(err, body)
    }
  });
}

module.exports = attemptFetch;
