#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('prueba_nodejs:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);
var var_dump = require('var_dump');
var io = require('socket.io').listen(server); // Modulo Socket.io

nicknames = {}; //array donde se almacenaran los usuarios




// Creando servidor de Chat
io.sockets.on('connection', function (socket) {
    socket.on('sendMessage', function (data) {
        io.sockets.emit('newMessage', {msg: data, nick: socket.nickname});
    });


    socket.on("newUser", function (data, callback) { // funcion para validar que no se repita el usuario
        
        if (data == '' || data == ' ' || data == '  ' || data == '   ' ) { // usuario no venga vacio
            callback( );
        } else if (data in nicknames) { // si usuario ya existe devuelve false
            callback(false);
        } else {
            callback(true);     // si usuario no existe devuelve true y ejecuta la funcion updateNickNames()
            socket.nickname = data;
            nicknames[socket.nickname] = 1;
            updateNickNames();
            io.sockets.emit("usuarioRegistrado", data); // se envia el parametro del usuario conectado para el mensaje
        }
    });

    socket.on('disconnect', function (data) { // cuando un usuario se desconecta
        if (!socket.nickname)
            return;
        io.sockets.emit("usuarioDeslogueado", {nick: socket.nickname}); // se envia el parametro del usuario desconectado para el mensaje
        delete nicknames[socket.nickname]; // se elimina su nombre de usuario del array
        updateNickNames(); // se actualiza el nombre de usuarios
    });

    function updateNickNames() {

        io.sockets.emit("usernames", nicknames);

    }


});





//app.get('/', function(req, res) {
//  res.sendfile(__dirname + '/index2.html');
//});



//var server = require('http').createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
