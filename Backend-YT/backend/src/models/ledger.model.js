const mongoose = require('mongoose');


const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, 'Ledger entry must be associated with an account'],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required for a ledger entry'],
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: [true, 'Ledger entry must be associated with a transaction'],
        index: true,
        immutable: true
    }
}, { timestamps: true });




function preventLenderModification() {
    throw new Error("Modification of fromAccount and toAccount fields is not allowed after transaction creation");
}


ledgerSchema.pre('findOneAndDelete', preventLenderModification);
ledgerSchema.pre('findOneAndUpadate', preventLenderModification);
ledgerSchema.pre('findOneAndReplace', preventLenderModification);
ledgerSchema.pre('updateOne', preventLenderModification);
ledgerSchema.pre('deleteOne', preventLenderModification);
ledgerSchema.pre('remove', preventLenderModification);
ledgerSchema.pre('deleteMany', preventLenderModification);
ledgerSchema.pre('updateMany', preventLenderModification);


const ledgerModel = mongoose.model('Ledger', ledgerSchema);
module.exports = ledgerModel;