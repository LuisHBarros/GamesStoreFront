const mongoose = require("mongoose");
const donePaymentSchema = new mongoose.Schema(
    {
        user_id: {type:mongoose.Types.ObjectId, ref: 'user', unique: false},
        status:{type: String, required:true},
        payment_id:{type: String, required:true},
        date:{type: String, required:true},
        payment_link:{type: String, required:true}
}
)

const donePayment = mongoose.model('donePayment', donePaymentSchema);
module.exports = donePayment;