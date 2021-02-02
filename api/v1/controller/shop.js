import DB from '../../../db'
import async from 'async'
import mongoose from 'mongoose';

import config from '../../../config'

module.exports = {

    /**
    * Create Store Api
    * @param {name}
    */
    createShop: (req, res) => {
        async.waterfall([
            (nextCall) => {
                req.checkBody('name', "Shop Name is required.").notEmpty()
                var error = req.validationErrors()
                if (error && error.length) {
                    return nextCall({
                        message: error[0].msg
                    })
                }
                nextCall(null, req.body)
            },
            // (body, nextCall) => {
            //     DB.Shop.findOne({
            //         userId: req.userInfo.id
            //     }).then(result => {
            //         if (!result) {
            //             nextCall(null, body)
            //         } else {
            //             nextCall({
            //                 message: "You have already create a Shop."
            //             })
            //         }
            //     }).catch(err => {
            //         nextCall(err)
            //     });
            // },
            (body, nextCall) => {
                let createShop = new DB.Shop()
                createShop.userId = req.userInfo.id;
                createShop.name = body.name;
                createShop.save().then(result => {
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
    },
    /**
     * Get Shop Details Api
     * @param {shopId}
     */
    getShopDetails: (req, res) => {
        async.waterfall([
            (nextCall) => {
                req.checkBody('shopId', "Shop Id is required.").notEmpty()
                var error = req.validationErrors()
                if (error && error.length) {
                    return nextCall({
                        message: error[0].msg
                    })
                }
                nextCall(null, req.body)
            },
            (body, nextCall) => {
                DB.Shop.findOne({
                    _id: body.shopId
                }).then(result => {
                    if (!result) {
                        nextCall({
                            message: "Shop Not Found."
                        })
                    } else {
                        nextCall(null, result)
                    }
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
     * Update Shop Details Api
     * @param {shopId}
     * @param {name}
     */
    updateShopDetails: (req, res) => {
        async.waterfall([
            (nextCall) => {
                req.checkBody('shopId', "Shop Id is required.").notEmpty()
                var error = req.validationErrors()
                if (error && error.length) {
                    return nextCall({
                        message: error[0].msg
                    })
                }
                nextCall(null, req.body)
            },
            (body, nextCall) => {
                let updateFields = {
                    name: body.name
                }
                DB.Shop.findOneAndUpdate({
                    _id: body.shopId
                }, {
                    $set: updateFields
                }, { upsert: true }).then(result => {
                    if (!result) {
                        nextCall({
                            message: "Shop Not Found."
                        })
                    } else {
                        nextCall(null, body)
                    }
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
     * Delete Shop Details Api
     * @param {shopId}
     */
    deleteShop: (req, res) => {
        async.waterfall([
            (nextCall) => {
                req.checkBody('shopId', "Shop Id is required.").notEmpty()
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
                 * Delete Shop 
                 */
                DB.Shop.findOneAndRemove({
                    _id: body.shopId
                }).then(result => {
                    if (!result) {
                        nextCall({
                            message: "Shop not found."
                        })
                    } else {
                        nextCall(null, {})
                    }
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
     * Get All Shop list which are created by user
     * @param {length}
     * @param {page}
     */
    getMyShop: (req, res) => {
        async.waterfall([
            (nextCall) => {
                req.checkBody('length', "length is required.").notEmpty()
                req.checkBody('page', "length is required.").notEmpty()
                var error = req.validationErrors()
                if (error && error.length) {
                    return nextCall({
                        message: error[0].msg
                    })
                }
                nextCall(null, req.body)
            },
            (body, nextCall) => {
                let aggregateQuery = []

                /*Stage 1 */
                aggregateQuery.push({
                    $match: {
                        userId: mongoose.Types.ObjectId(req.userInfo.id)
                    }
                })
                /**Stage 2 */
                aggregateQuery.push({
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetail'
                    }
                })
                /**Stage 3 */
                aggregateQuery.push({
                    $unwind: {
                        path: "$userDetail",
                        preserveNullAndEmptyArrays: false // optional
                    }
                });
                /**Stage 4 */
                aggregateQuery.push({
                    $group: {
                        _id: "$_id",
                        firstName: { $first: "$userDetail.firstName" },
                        lastName: { $first: "$userDetail.lastName" },
                        email: { $first: "$userDetail.email" },
                        userId: { $first: "$userId" },
                        name: { $first: "$name" },
                        created_at: { $first: "$created_at" }
                    }
                })
                /**Stage 5 */
                aggregateQuery.push({
                    $sort: {
                        created_at: -1
                    }
                })
                /**Stage 6 */
                aggregateQuery.push({
                    $group: {
                        _id: null,
                        count: {
                            $sum: 1
                        },
                        list: {
                            $push: {
                                _id: "$_id",
                                firstName: "$firstName",
                                lastName: "$lastName",
                                email: "$email",
                                userId: "$userId",
                                name: "$name",
                                created_at: "$created_at"
                            }
                        }
                    }
                })
                /**Stage 7 */
                aggregateQuery.push({
                    $unwind: {
                        path: "$list",
                        preserveNullAndEmptyArrays: true // optional
                    }
                });
                /**Stage 8 */
                aggregateQuery.push({
                    $limit: ((Number(req.body.length) * (Number(req.body.page) - 1))) + Number(req.body.length)
                });
                aggregateQuery.push({
                    $skip: Number(req.body.length) * (Number(req.body.page) - 1)
                });
                /**Stage 9 */
                aggregateQuery.push({
                    $group: {
                        _id: null,
                        recordsTotal: { "$first": "$count" },
                        recordsFiltered: { "$first": "$count" },
                        data: { "$push": "$list" }
                    }
                });
                /**Stage 10 */
                aggregateQuery.push({
                    $project: {
                        _id: 0,
                        recordsTotal: 1,
                        recordsFiltered: 1,
                        data: 1
                    }
                });
                nextCall(null, aggregateQuery)
            },
            (aggregateQuery, nextCall) => {
                DB.Shop.aggregate(aggregateQuery).then(finalRes => {
                    if (finalRes && finalRes.length <= 0) {
                        finalRes = [{
                            "recordsTotal": 0,
                            "recordsFiltered": 0,
                            "data": []
                        }];
                    }
                    nextCall(null, finalRes && finalRes[0])
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
}
