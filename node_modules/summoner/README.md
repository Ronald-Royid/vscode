# Summoner
A caching http requester for consuming APIs on the server.

## What it is
Summoner will get data from a server, parse it, cache it for a configurable length of time, and hand it back off to you as many times as you like until it expires.

Summoner is not yet battle-hardened, so any error reports or pull requests are welcomed.

## How to use it
`summoner(opts || url, callback)`

The callback receives (err, response).

````javascript
var summoner = require('summoner');
summoner('http://jsonplaceholder.typicode.com/posts/1', (err, json) => {
  console.log(json) // All that wonderful JSON data, pre-parsed, as often as you like, almost guilt-free!
})

summoner({url: 'http://www.google.com/humans.txt', type: "text"}, (err, raw) => {
  console.log(raw) // Raw, fierce, unedited text!
})
````
The current options and defaults are as follows:
### maxAttempts: 5
  This is how many times summoner will try to get the data from the server before giving up and returning an error.
### type: 'application/json'
  The type of data we're getting, and the sort of processing that needs doing. This should get expanded over time. At the moment, anything other than 'application/json' or 'json' will get returned as plain text. Alternatively, you may add your own processing function by registering it with summoner:
  ````javascript
    summoner.register('myType', (body) => { /*do stuff, then return it.*/ } )
    summoner({url: 'www.example.com', type: 'myType'}, callback)
  ````
### ttl: 60*60 (one hour)
  Time To Live, how long in seconds the cache will keep ahold of the parsed data before fetching again from the server.
### auth: undefined
  Auth is an object, currently only useful for basic auth. The format is as follows:
````
{
  "user": "username",
  "pass": "password"
}
````


## What it's made of
[Node-cache](https://www.npmjs.com/package/node-cache) makes up the backbone of the beast, while the fabulous and extensive [request](https://www.npmjs.com/package/request) library is its sinews. The summoner's resolve is tested with the slim and deceptive [http-server](https://www.npmjs.com/package/http-server), and its wit is measured with [tape](https://www.npmjs.com/package/tape).
