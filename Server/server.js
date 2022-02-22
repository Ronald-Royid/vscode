const express = require("express");
const app = express();
const port = 3000
const fs = require("fs");


app.listen(port,()=>
    console.log("Server lisitning on http://localhost:",{port})
);

app.get('/get-data',(req,res,next) =>{
const fileStream =fs.createReadStream(
    // TBD
);
fileStream.on('open',() => {
    fileStream.pipe(res);
});
});


