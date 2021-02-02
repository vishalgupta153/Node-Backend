import mongoose from 'mongoose';
import _self from '../api/v1/controller/auth';
import config from '../config'

const DB = {}

/**
 * Import collection over here
 */
import UserCollection from './models/user'
import ShopCollection from './models/store'


/**
 *  Create a Promise for connecting Database 
 */
DB.initialize = () => {
    return new Promise(function (resolve, reject) {   //return promise object
        mongoose.connect(config.database.mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }, (err, collection) => {
            if (err) {
                return reject(err);     //onRejected
            }
            
            DB.User = collection.model('users', UserCollection)
            DB.Shop = collection.model('shops', ShopCollection)

            resolve();  //onFullfiled
        });

    })
}

export default DB