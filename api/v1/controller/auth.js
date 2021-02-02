import JWT from 'jsonwebtoken'
import DB from '../../../db'
import async from 'async'
import ED from '../../../services/encrypt_decrypt'
import config from '../../../config'

module.exports = {

    /**
     * Login Api To get access to the system
     * @param {email}  
     * @param {password} 
     */
    login: (req, res) => {
        async.waterfall([
            (nextCall) => {
                req.checkBody('email', "Email is required.").notEmpty()
                req.checkBody('password', "Password is required.").notEmpty()
                var error = req.validationErrors()
                if (error && error.length) {
                    return nextCall({
                        message: error[0].msg
                    })
                }
                nextCall(null, req.body)
            },
            (body, nextCall) => {
                /**
                 * Check user Exits in the System or not with email and username
                 */
                DB.User.findOne({
                    $or: [
                        { 'email': body.email },
                        { 'userName': body.email }
                    ]
                }).then(result => {
                    if (!result) {
                        return nextCall({
                            message: commonMessage.NO_USR_FND
                        });
                    } else if (result.password != ED.encrypt(body.password)) {
                        return nextCall({
                            message: commonMessage.INV_PASS
                        });
                    } else {
                        nextCall(null, result)
                    }
                }).catch(err => {
                    nextCall(err)
                });
            },
            async (user, nextCall) => {
                /**
                * Create Access Token
                */
                try {
                    var jwtData = {
                        id: user._id,
                        email: user.email
                    }
                    user.accessToken = await JWT.sign(jwtData, config.secret)
                    nextCall(null, user)
                } catch (error) {
                    nextCall(error)
                }
            },
            (user, nextCall) => {
                DB.User.findOneAndUpdate({
                    _id: user._id
                }, {
                    $set: { accessToken: user.accessToken }
                }, { upsert: true }).select({
                    password: 0
                }).then(result => {
                    nextCall(null, user)

                }).catch(err => {
                    nextCall(err)
                })
            }
        ], (err, response) => {
            if (err) {
                return res.status(400).json({
                    status: 400,
                    message: (err && err.message) || commonMessage.SOMETHING_WRONG,
                    data: {}
                })
            }
            return res.json({
                status: 200,
                message: commonMessage.SUCC,
                data: response
            })
        });
    },
    /**
     * Sign Up API for create account to a system.
     * @param {email} 
     * @param {password}
     */
    signUp: (req, res) => {
        async.waterfall([
            (nextCall) => {
                req.checkBody('email', "Email is required.").notEmpty()
                req.checkBody('email', "Email is not valid.").isEmail()
                req.checkBody('password', "Password is required.").notEmpty()
                var error = req.validationErrors()
                if (error && error.length) {
                    return nextCall({
                        message: error[0].msg
                    })
                }
                nextCall(null, req.body)
            },
            async (body, nextCall) => {
                let checkEmail = await DB.User.findOne({ email: body.email });
                if (checkEmail) {
                    return nextCall({
                        message: commonMessage.USR_ALRDY_EXIST
                    });
                } else {
                    nextCall(null, body)
                }
            },
            (body, nextCall) => {
                let userData = new DB.User({
                    email: body.email,
                    password: ED.encrypt(body.password)
                })
                userData.save(userData).then(result => {
                    nextCall(null, result)
                }).catch(err => {
                    nextCall(err)
                })
            },
            (user, nextCall) => {
                /**
                 * Create Access Token
                 */
                var jwtData = {
                    id: user._id,
                    email: user.email
                }
                user.accessToken = JWT.sign(jwtData, config.secret)
                nextCall(null, user)
            },
            (user, nextCall) => {
                DB.User.findOneAndUpdate({
                    _id: user._id
                }, {
                    $set: { accessToken: user.accessToken }
                }, { upsert: true })
                    .select({
                        password: 0
                    }).then(result => {
                        nextCall(null, result)

                    }).catch(err => {
                        nextCall({
                            message: commonMessage.SOMETHING_WRONG
                        })
                    })
            }
        ], (err, response) => {
            if (err) {
                return res.status(400).json({
                    status: 400,
                    message: (err && err.message) || commonMessage.SOMETHING_WRONG,
                    data: {}
                })
            }
            return res.json({
                status: 200,
                message: commonMessage.SUCC,
                data: response
            })
        });
    },
    /**
     * Test Api
     */
    test: (req, res) => {
        async.waterfall([
            (nextCall) => {
                req.checkBody('email', commonMessage.EMAIL_REQ).notEmpty()
                req.checkBody('password', commonMessage.PASSWORD_REQ).notEmpty()
                var error = req.validationErrors()
                if (error && error.length) {
                    return nextCall({
                        message: error[0].msg
                    })
                }
                nextCall(null, req.body)
            },
        ], (err, response) => {
            if (err) {
                return res.status(400).json({
                    status: 400,
                    message: (err && err.message) || "Something Went Wrong",
                    data: {}
                })
            }
            return res.json({
                status: 200,
                message: "Success",
                data: response
            })
        });
    }
}
