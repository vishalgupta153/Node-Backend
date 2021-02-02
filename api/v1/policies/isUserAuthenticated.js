import jwt from 'jsonwebtoken'
import config from '../../../config'


module.exports = function (req, res, next) {
  if (!config.jwtTokenVerificationEnable) { // skip token verification
    return next()
  }

  // Get token from headers
  var reqToken = req.headers ? req.headers['authorization'] : '';
  // verify a token
  jwt.verify(reqToken, config.secret, function (err, decoded) {
    if (err) {
      console.log(`ERROR: ${err.message}`)
      res.status(401).json({
        status: 401,
        message: err.message
      })
    } else if (decoded) {
      // store userInfo in request (userInfo)
      req.userInfo = decoded
      next()
    } else {
      // send Unauthorized response
      res.status(401).json({
        status: 401,
        message: 'Unauthorized user'
      })
    }
  })
}
