import DB from '../../../db'
import async from 'async'
import config from '../../../config'

module.exports = {

    /**
     * Get User Profile Details
     */
    getUserDetails: (req, res) => {
        async.waterfall([
            (nextCall) => {
                DB.User.findOne({
                    _id: req.userInfo.id
                }).then(result => {
                    if (!result) {
                        return nextCall({
                            message: commonMessage.NO_USR_FND
                        });
                    } else {
                        delete result.password
                        nextCall(null, result)
                    }
                }).catch(err => {
                    nextCall(err)
                });
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
     * Update User Details.
     * @param {firstName} 
     * @param {lastName}
     * @param {userName}
     */
    updateUserDetails: (req, res) => {
        async.waterfall([
            (nextCall) => {
                req.checkBody('firstName', "First Name is required.").notEmpty()
                req.checkBody('lastName', "Last Name is required.").notEmpty()
                req.checkBody('userName', "Username is required.").notEmpty()
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
                 * Check username already used or not
                 */
                DB.User.findOne({
                    _id: { $ne: req.userInfo.id },
                    userName: body.userName
                }).then(result => {
                    if (!result) {
                        nextCall(null, body)
                    } else {
                        nextCall({
                            message: "Username is already is use."
                        })
                    }
                }).catch(err => {
                    nextCall(err)
                })
            },
            (body, nextCall) => {
                /**
                 * Check username already used or not
                 */
                DB.User.findOne({
                    _id: { $ne: req.userInfo.id },
                    userName: body.userName
                }).then(result => {
                    if (!result) {
                        nextCall(null, body)
                    } else {
                        nextCall({
                            message: "Username is already is use."
                        })
                    }
                }).catch(err => {
                    nextCall(err)
                })
            },
            (body, nextCall) => {
                let updateFields = {
                    firstName: body.firstName,
                    lastName: body.lastName,
                    userName: body.userName
                }
                DB.User.findOneAndUpdate({
                    _id: req.userInfo.id
                }, {
                    $set: updateFields
                }, { upsert: true }).select({
                    password: 0,
                    __v: 0
                }).then(result => {
                    nextCall(null, result)
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
    }
}
