module.exports = function (app, apiBase) {
    require('./v1')(app, `${apiBase}/v1`)
}