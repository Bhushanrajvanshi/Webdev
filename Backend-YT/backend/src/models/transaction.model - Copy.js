const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Transaction must have a source account"],
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Transaction must have a destination account"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["PELDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "Status must be either pending, completed, failed, or reversed"
        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        required: [true, "Transaction amount is required"],
        min: [0, "Transaction amount cannot be negative"]
    },
    idempotencyKey: {
        type: String,
        required: [true, "Idempotency key is required for transaction"],
        unique: true,
        index: true
    },
    type: {
        type: String,
        enum: {
            values: ["CREDIT", "DEBIT"],
            message: "Transaction type must be either credit or debit"
        },
        required: [true, "Transaction type is required"],
        immutable: true
    }
}, { timestamps: true });



const transactionModel = mongoose.model("Transaction", transactionSchema);
module.exports = transactionModel;