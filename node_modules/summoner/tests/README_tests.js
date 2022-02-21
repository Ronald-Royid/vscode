var summoner = require('../index.js');
summoner('http://jsonplaceholder.typicode.com/posts/1', (err, json) => {
  console.log(json) // All that wonderful JSON data, pre-parsed, as often as you like, almost guilt-free!
})

summoner({url: 'http://www.google.com/humans.txt', type: "text"}, (err, raw) => {
  console.log(raw) // Raw, fierce, unedited text!
})
