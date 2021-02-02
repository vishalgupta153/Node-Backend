import mongoose from 'mongoose'
import DS from '../../services/date'

const ShopCollection = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
    },
    name: {
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
    collection: 'shops',
    versionKey: false
});

ShopCollection.pre('save', function (next) {
    this.created_at = this.updated_at = DS.now();
    next();
});
ShopCollection.pre('update', function (next) {
    this.update({}, { $set: { updated_at: DS.now() } });
    next();
});

export default ShopCollection
