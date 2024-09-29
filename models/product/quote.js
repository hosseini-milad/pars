const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const QuoteSchema = new Schema({
    cartItems:  { type : Array , "default" : [] },
    initDate: { type: Date, default: Date.now },
    cartNo:{ type: String },
    progressDate: { type: Date },
    userId:{ type: String },
    manageId:{ type: String },
    payValue:{ type: String },
    stockId:{type:String},
    description:{type:String},
    discount:{type:String},
    totalPrice:{ type: String },
})
module.exports = mongoose.model('quote',QuoteSchema);