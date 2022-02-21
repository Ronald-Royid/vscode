var tape = require('tape');
var summoner = require('../../index.js')
//var secServer = childProcess.spawn('node ../../node_modules/.bin/http-server -p 7575 --ssl --key --cert')


//var server = childProcess.spawn('./node_modules/.bin/http-server')

tape('Integration test', (main) => {
  main.plan(3);

  var json = 'http://localhost:7070/endpoints/json.json'
  var plain =
    { url: 'http://localhost:7070/endpoints/plain.txt'
    , type: 'text'
    }

  var expected =
    { "name": "This is JSON"
    , "type": "json"
    , "date": "2016-04-13T18:57:40.517Z"
    , "object":
      { "number": 10923
      , "bool": false
      }
    }

  main.test('- Basic functionality', (t) => {
    t.plan(8)
    summoner(json, (err, res1) => {
        t.ok( res1, 'Recieved data' )
        t.equal( res1.name, "This is JSON", 'Parsed JSON' )
        t.deepEqual( res1, expected, 'Test data matches' )
        res1.name = "changed values"
        res1.object.number = 2
        summoner(json, (err, res2) => {
          t.ok( res2, 'Retrieved data' )
          t.equal( res2.name, "This is JSON", 'Retrieved parsed JSON' )
          t.deepEqual( res2, expected, 'Same resonse' )
          t.notDeepEqual( res2, res1, 'Cloned object' )
          t.notEqual(res2.object.number, 2, 'Deep clone, effectively immutable.')
        })
      }
    )
  })

  main.test('- Alternate format tests', (t) => {
    t.plan(2)
    summoner(plain, (err, res) => {
      var text = "This is just plain text. It's nothing special...\n"
      t.equal(res, text, "Plain text stored as string.")
    })
    summoner.register('custom', (body) => JSON.parse(body).name.toUpperCase());
    summoner({url: json, type: 'custom'}, (err, res) => {
      t.equal(res, "THIS IS JSON", 'Custom transformations.')
    })
  })

  main.test('- Errors', (t) => {
    t.plan(6)
    summoner('http://localhost:7070/endpoints/nonexistant.json', (err, res) => {
      t.ok(err, "Errors on 404")
      t.equal(res, undefined, "Undefined on 404")
    })

    summoner('http://localhost:0/not/really/gonna/get/a/response/i/hope',(err, res)=>{
      t.ok(err, "Errors on bad url")
      t.equal(res, undefined, "Bad url gives undefined back")
      summoner('http://localhost:0/not/really/gonna/get/a/response/i/hope',(err2, res2)=>{
        t.ok(err2, "Errors repeatedly on bad url")
        t.equal(res2, undefined, "Bad url always gives undefined back")
      })
    })
  })

})
