const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (res, req) => {
    console.log("Hello world!");
}).listen(3000)