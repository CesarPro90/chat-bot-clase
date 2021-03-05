const express = require('express');
const path = require('path');

const config = require('../config.json');

const app = express();

app.set('port', process.env.PORT || config.server.altport);

app.use(express.static(path.join(__dirname, config.server.public)))

const server = app.listen(app.get('port'), () => {
    console.log('Port: ' + app.get('port'));
});

const io = require('socket.io')(server);

require('./events/sockets')(io)
