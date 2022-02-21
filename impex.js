const { response } = require('express');
const https = require('https');
const axios = require('axios')
const config = require('./config.js')

axios.get(config.baseURL)
    .then(result => {
        console.log(result.data);
    }) 
    .catch(error => {
        console.log(error);
        console.log(("Connection Fail"))
    });

