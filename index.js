const express = require('express');

const server = express();

server.get('/', (req, res) => {
    res.status(200).json('Welcome to Server-side Routing with Node JS')
})

server.listen(4100, ()=> console.log('Server listening on port 4100'))