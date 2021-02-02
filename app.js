import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import expressValidator from 'express-validator'
import initAPISVersions from './api'
import staticRoutes from './routes'
import Message from './message'

const app = express()

global.commonMessage = Message
// view engine setup
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')


app.use(bodyParser.json({
    limit: '5mb'
}))

app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}))
/**
 * Set Validator to check body params
 */
app.use(expressValidator())

//Changes for Authorization from web panel
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', false)
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name, Authorization,authorization')
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        return res.sendStatus(200);
    } else {
        next();
    }
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/success', staticRoutes);
app.get('/error', staticRoutes);
// initilize API versions
initAPISVersions(app, '')


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})


// development error handler - will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500)
        res.json({
            code: 500,
            message: err.message,
            error: err
        })
        res.render('error', {
            message: err.message,
            error: err
        })
    })
}

// production error handler - no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
})

module.exports = app
