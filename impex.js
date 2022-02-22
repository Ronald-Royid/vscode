const axios = require('axios')
const config = require('./config')

axios.get(config.baseURL)
    .then(result => {
        console.log(result.status, "ok");
         console.log(result.data);
    }) 
    .catch(error => {
        console.log(error);
        console.log("Connection Failed");
    });

