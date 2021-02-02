import DB from '../../../db'
import config from '../../../config'

module.exports = function (req, res, next) {
    if (!config.jwtTokenVerificationEnable) { // skip user verification
        return next()
    }
    var reqToken = req.headers ? req.headers['authorization'] : ''
    if (!req.userInfo || (req.userInfo && !req.userInfo.id)) {
        return res.status(401).json({
            status: 401,
            message: 'Unauthorized user'
        })
    }
    DB.User.findOne({
        _id: req.userInfo.id,
        accessToken: reqToken
    }).then(user => {
        console.log('user', user)
        if (!user) {
            return res.status(401).json({
                status: 401,
                message: 'User Not Found.'
            })
        } else {
            return next()
        }

    }).catch(err => {
        console.log('err', err)
        return res.status(500).json({
            status: 0,
            message: 'Internal server error'
        })
    })
}
