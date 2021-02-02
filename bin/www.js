
import http from 'http'
import config from '../config'
import app from '../app'
import DB from '../db'
//import os from 'os'




const onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error
    }
    let port = config.port;
    let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.log(`${bind} requires elevated privileges`)
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.log(`${bind} is already in use`)
            process.exit(1)
            break
        default:
            throw error
    }
}

const onListening = () => {
    let addr = server.address()
    let bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
    console.log(`Listening on ${bind}`)
}

app.set('port', config.PORT)
/**
 * Create Http serve.
 */
let server = http.createServer(app)

DB.initialize()
    .then(succ => {
        console.log('Database is connected successfully.')
        server.listen(config.PORT)
        server.on('error', onError)
        server.on('listening', onListening)
    })
    .catch(err => {
        console.log('err', err)
    })
