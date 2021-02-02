import mongoose from 'mongoose'
import DS from '../../services/date'

const UserCollection = new mongoose.Schema({
    email: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    userName: {
        type: String,
        default: null
    },
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    accessToken: {
        type: String,
        default: null
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }
}, {
    collection: 'users',
    versionKey: false
});

UserCollection.pre('save', function (next) {
    this.created_at = this.updated_at = DS.now();
    next();
});
UserCollection.pre('update', function (next) {
    this.update({}, { $set: { updated_at: DS.now() } });
    next();
});

export default UserCollection
