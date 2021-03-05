module.exports = function (io) {
    const log = require('../../libs/console');
    io.on('connection', (socket) => {
        log('server', 'Nueva conexion :' + socket.id + ':!', 'yellow,green,yellow');
        socket.on('clt:active', (data) => {
            log('client', 'Hola ;) ! Soy :' + socket.id + ':!', 'yellow,green,yellow');
            log('client', 'Mensaje>: ' + data, 'orange,green');
            socket.emit('srv:welcome', {
                client: {
                    id: socket.id,
                    permission: true
                },
                server: {
                    version: 'config.json',
                    location: 'config.json'
                }
            });
            setTimeout(() => {
                socket.emit('prueba', "Hola, este es un comentario de debug");
            }, 5000);
        });
        socket.on('clt:ready', (data) => {
            if (data == true) {
                log('client', 'Todo funciona correctamente ;)', 'yellow')
            } else {
                log('client', 'Ha ocurrido un error interno: ' + data, 'yellow,green');
            }
        });
        socket.on('ctl:talk', (data) => {
            if (data) {
                setTimeout(() => {
                    socket.emit('srv:msg', {
                        author: 'ChatBot',
                        msg: {
                            text: `Hola ${socket.id}, soy ChatBot.`,
                            embed: {
                                title: 'Comandos',
                                txt: 'Comandos que le puedes enviar al bot',
                                fields: [
                                    {
                                        name: 'Hola',
                                        value: 'Hablarle al bot'
                                    },
                                    {
                                        name: 'Info',
                                        value: 'Info del servidor'
                                    }
                                ],
                                color: 'blue'
                            }
                        }
                    });
                }, 1);
            } else {
                // No se ni para que he puesto esto
            }
        });
        socket.on('usr:msg', (data) => {
            socket.emit('usr:msg', {
                author: socket.id,
                msg: {
                    text: data.msg
                }
            });
        });
    });
}
